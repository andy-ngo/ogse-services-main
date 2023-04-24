
import Evented from '../../base/evented.js';
import Widget from '../../base/widget.js';

/** 
 * A map component that wraps an OpenLayers maps (ol.Map)
 **/
export default class Map extends Evented {
	/** 
	* Gets the OL control underlying the map
	* @type {number} 
	*/
	get OL() { return this._ol; }
	
	/** 
	* Gets the map layers as a map of string and layers
	* @type {object} 
	*/
	get layers() { return this._layers; }
		
    /**
	 * @param {object} container - div container
	 * @param {ol.layer.Tile[]} basemaps - the basemaps to use
     */
	constructor(container, basemaps) {
		super(); 
		
		this._layers = {};
		
		var sl = new ol.control.ScaleLine();
	  	
		this.basemaps = basemaps;
		
		this._ol = new ol.Map({
			target: container,
			layers: [new ol.layer.Group({
				title: 'Basemaps',
				layers: basemaps
			})],
			controls: ol.control.defaults({ attributionOptions: { collapsible: true } }).extend([sl]),
		});
		
		this._ol.on("click", (ev) => {
			var features = [];
			
			this._ol.forEachFeatureAtPixel(ev.pixel, function (feature, layer) {
				features.push({ layer:layer.get('title'), feature:feature });
			});

			this.emit("click", { "features" : features, "coordinates" : ev.coordinate });
		})
		
		this.projection = basemaps[0].getSource().getProjection();
		
		this.popup = new ol.Overlay.Popup({ closeBox:true });
   
		this.OL.addOverlay(this.popup);
	}
	
	ready() {
		return new Promise(resolve => {
			this._ol.once("rendercomplete", resolve);
		});
	}
	
    /**
     * Get a layer by id
	 * @param {string} id - the layer id
	 * @return {ol.layer.Layer} the layer corresponding to the id
     */
	layer(id) {
		return this.layers[id];
	}

    /**
     * Get the features associated to a layer by id
	 * @param {string} id - the layer id
	 * @return {ol.Feature[]} an array of features from the layer
     */
	layer_features(id) {
		return this.layer(id).getSource().getFeatures();
	}

    /**
     * Adds controls to the map
	 * @param {ol.control.Control[]} controls - an array of controls to add to the map
     */
	add_control(controls) {
		if (!Array.isArray(controls)) controls = [controls];
		
		controls.forEach(c => this.OL.addControl(c));
	}
	
    /**
     * Removes controls to the map
	 * @param {ol.control.Control[]} controls - an array of controls to remove from the map
     */
	remove_control(controls) {
		if (!Array.isArray(controls)) controls = [controls];
		
		controls.forEach(c => this.OL.removeControl(c));
	}
	
    /**
     * Adds a layer to the map
	 * @param {string} id - the layer id
	 * @param {ol.layer.Layer} layer - the layer to add
	 * @return {ol.layer.Layer} the added layer
     */
	add_layer(id, layer) {
		this.OL.addLayer(layer);
		
		this.layers[id] = layer;
		
		return layer;
	}
	
    /**
     * Adds a layer to the map from geojson
	 * @param {string} id - the layer id
	 * @param {object} json - a geojson set of features
	 * @return {ol.layer.Layer} the added layer
     */
	add_geojson_layer(id, json) {			
		var format = new ol.format.GeoJSON({ featureProjection : this.projection });
		var vs = new ol.source.Vector({features: format.readFeatures(json)});
		
		return this.add_layer(id, new ol.layer.Vector({ source: vs, title: json.name  }));
	}
	
    /**
     * Adds a layer to the map from features
	 * @param {string} id - the layer id
	 * @param {object} features - an array of ol.Feature
	 * @param {string} title - the layer title
	 * @param {object} style - the layer style
	 * @return {ol.layer.Layer} the added layer
     */
	add_vector_layer(id, features, title, style) {
		// TODO: Not sure about the wrapX thing.
		var source = new ol.source.Vector({ features:features, wrapX:false });
		
		var vector = new ol.layer.Vector({ source:source, title:title, style:style });

		return this.add_layer(id, vector);
	}
	
    /**
     * Sets the map view, zoom and center
	 * @param {number[]} coord - an array of X,Y coordinates
	 * @param {number} zoom - the zoom level
     */
	set_view(coord, zoom) {
		this.OL.setView(new ol.View({
			center: ol.proj.transform(coord, "EPSG:4326", "EPSG:900913"),
			zoom: zoom,
		}));
	}

    /**
     * Shows an infopopup on the map
	 * @param {number[]} coord - an array of X,Y coordinates
	 * @param {Widget|string} content - the content of the infopopup
     */
	show_popup(coord, content) {
        this.popup.setPosition(coord);
		
		if (content instanceof Widget) {
			this.popup.show(coord, "");
			
			content.container = this.popup.content;
		}
		
		else this.popup.show(coord, content);
	}

    /**
     * Returns an OpenStreetMap basemap
	 * @param {boolean} visible - basemap visibility
	 * @return {ol.layer.Tile} the basemap created
     */
	static basemap_osm(visible) {
		return new ol.layer.Tile({ 
			title: "OpenStreetMap",
			source: new ol.source.OSM(),
			visible: !!visible,
			baseLayer: true
		});
	}

    /**
     * Returns a Satellite imagery basemap
	 * @param {boolean} visible - basemap visibility
	 * @return {ol.layer.Tile} the basemap created
     */
	static basemap_satellite(visible) {
		return new ol.layer.Tile({ 
			title: "Satellite",
			source: new ol.source.XYZ({
				// attributions: ['Powered by Esri',
				// 			   'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
				attributionsCollapsible: false,
				url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
				maxZoom: 23
			}),
			visible: !!visible,
			baseLayer: true
		});
	}
}