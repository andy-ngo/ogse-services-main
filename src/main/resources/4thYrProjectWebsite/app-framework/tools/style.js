import BucketFill from "../components/style/bucketFill.js";
import BucketRadius from "../components/style/bucketRadius.js";
import BucketStroke from "../components/style/bucketStroke.js";
import BucketScale from "../components/style/bucketScale.js";
import StaticFill from "../components/style/staticFill.js";
import StaticRadius from "../components/style/staticRadius.js";
import StaticStroke from "../components/style/staticStroke.js";
import StaticScale from "../components/style/staticScale.js";
import Polygon from "../components/style/polygon.js";
import Point from "../components/style/point.js";
import PointIcon from "../components/style/pointIcon.js";
import Linestring from "../components/style/linestring.js";

/** 
 * A utility class that contains a series of basic functions for styling maps
 **/
export default class Style {
	
	/**
	* calculates a series of statistics useful for map classification (min, max, sorted values, etc.)
	* @param {Simulation} simulation - the simulation object
	* @return {object} the statistics calculated from the simulation.
	*/
	static statistics(simulation) {		
		var values = {};

		// TODO :Something doesn't work here now that there can be multiple model types. 
		// Statistics should be computed in the GIS part of the app, by property on the map.
		for (var i = 0; i < simulation.frames.length; i++) {
			var fr = simulation.frames[i];
			
			for (var j = 0; j < fr.state_messages.length; j++) {
				var m = fr.state_messages[j];
				
				for (var k = 0; k < m.value.length; k++) {
					var f = m.model.state.fields[k].name;

					if (!values[f]) values[f] = [];
					
					values[f].push(m.value[k]);
				}
			}
		}
			
		for (var f in values) {
			values[f] = values[f].filter(v => !isNaN(v));
			values[f] = values[f].sort((a, b) => (a < b) ? -1 : 1);
		} 
		
		var stats = {};
		
		for (var f in values) {
			var length = values[f].length;
			
			stats[f] = {
				sorted: values[f],
				length: length,
				min: values[f][0],
				max: values[f][length - 1]
			}
		}
		
		return stats;
	}
	
	/**
	* calculates a classification buckets using quantiles
	* @param {number[]} values - an array of numbers, all the values in the simulation
	* @param {number} n - the number of buckets
	* @param {boolean} zero - if true, filter out 0 values.
	* @return {number[]} an array of numbers representing upper limits of buckets.
	*/
	static quantile_buckets(values, n, zero) {
		var buckets = [];
		
		var zValues = zero ?  values.filter(v => v != 0) : values;
		
		if (zValues.length == 0) return [0];
		
		var interval = Math.floor(zValues.length / n);
		
		for (var i = 1; i < n; i++) buckets.push(zValues[i * interval]);
		
		buckets.push(zValues[zValues.length - 1]);
		
		return buckets;
	}
	
	/**
	* calculates a classification buckets using equivalent ranges
	* @param {number} min - the minimum value among all simulation values
	* @param {number} max - the maximum value among all simulation values
	* @param {number} n - the number of buckets.
	* @return {number[]} an array of numbers representing upper limits of buckets.
	*/
	static equivalent_buckets(min, max, n) {
		var buckets = [];
		
		var interval = (max - min) / n;
		
		for (var i = 1; i < n; i++) buckets.push(min + i * interval);
		
		buckets.push(max);
		
		return buckets;
	}
	
	/**
	* Apply buckets to a style definition. Adds a buckets property on the style definition.
	* @param {object} style - the style definition
	* @param {object} stats - the simulation statistics
	*/
	static bucketize_style(style, stats) {
		if (style.type == "quantile") {	
			style.buckets = Style.quantile_buckets(stats[style.property].sorted, style.length, !!style.zero);
		}
		else if (style.type == "equivalent") {
			style.buckets = Style.equivalent_buckets(stats[style.property].min, stats[style.property].max, style.length);
		}
	}
	
	/**
	* Get an OpenLayers style object from a type and a style definition
	* @param {string} type - the type of style (point, pointIcon, polygon, linestring)
	* @param {object} json - the style definition
	* @return an ol.style.Style object
	*/
	static get_style(type, json) {
		if (type == "point") return this.point_style(json);
		
		if (type == "pointIcon") return this.point_icon_style(json);
		
		if (type == "polygon" || type == "multipolygon") return this.polygon_style(json);
		
		if (type == "linestring") return this.linestring_style(json);
	}
	
	/**
	* Get an OpenLayers point icon style from a style definition
	* @param {object} json - the style definition
	* @return an ol.style.Style object using an ol.style.Icon
	*/
	static point_icon_style(json) {
		return new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 0.5],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				scale: json.scale,
				offset: [0,0],
				opacity: 1,
				src: json.src
			})
		});
	}
	
	/**
	* Get an OpenLayers point style from a style definition
	* @param {object} json - the style definition
	* @return an ol.style.Style object using an ol.style.Circle
	*/
	static point_style(json) {
		return new ol.style.Style({
			image: new ol.style.Circle({
				radius: json.radius,
				fill: new ol.style.Fill({
					color: json.fill.color
				}),
				stroke: new ol.style.Stroke({
					color: json.stroke.color,
					width: json.stroke.width,
				})
			})
		});
	}
	
	/**
	* Get an OpenLayers polygon style from a style definition
	* @param {object} json - the style definition
	* @return an ol.style.Style object using an ol.style.Stroke and ol.style.Fill
	*/
	static polygon_style(json) {
		return new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: json.stroke.color,
				width: json.stroke.width,
			}),
			fill: new ol.style.Fill({
				color: json.fill.color,
			})
		});
	}
	
	/**
	* Get an OpenLayers linestring style from a style definition
	* @param {object} json - the style definition
	* @return an ol.style.Style object using an ol.style.Stroke
	*/
	static linestring_style(json) {
		return new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: json.stroke.color,
				width: json.stroke.width
			})
		})
	}
	
	/**
	* Get a fill style from visual variable definition
	* @param {object} json - the visual variable definition
	* @return {StaticFill, BucketFill} the style object created
	*/
	static fill_style_from_json(json) {
		if (json.type == "equivalent" || json.type == "quantile" || json.type == "user-defined") {
			return BucketFill.from_json(json);
		}

		if (json.type == "static") return StaticFill.from_json(json);
	}
	
	/**
	* Get a stroke style from visual variable definition
	* @param {object} json - the visual variable definition
	* @return {StaticStroke, BucketStroke} the style object created
	*/
	static stroke_style_from_json(json) {
		if (json.type == "equivalent" || json.type == "quantile" || json.type == "user-defined") {
			return BucketStroke.from_json(json);
		}
		
		if (json.type == "static") return StaticStroke.from_json(json);
	}
	
	/**
	* Get a radius style from visual variable definition
	* @param {object} json - the visual variable definition
	* @return {StaticRadius, BucketRadius} the style object created
	*/
	static radius_style_from_json(json) {
		if (json.type == "equivalent" || json.type == "quantile" || json.type == "user-defined") {
			return BucketRadius.from_json(json);
		}
		
		if (json.type == "static") return StaticRadius.from_json(json.radius);	
	}
	
	/**
	* Get a scale style from visual variable definition
	* @param {object} json - the visual variable definition
	* @return {StaticScale, BucketScale} the style object created
	*/
	static scale_style_from_json(json) {
		if (json.type == "equivalent" || json.type == "quantile" || json.type == "user-defined") {
			return BucketScale.from_json(json);
		}
		
		if (json.type == "static") return StaticScale.from_json(json.scale);	
	}
	
	/**
	* Get a style for a geometry type and visual variable definition
	* @param {string} type - the gepometry type
	* @param {object} json - the visual variable definition
	* @return a style for the geometry initialized from the type and visual variable definition
	*/
	static from_json(type, json) {
		if (type == "polygon") return Polygon.from_json(json);
		
		if (type == "point") {
			if (json.radius) return Point.from_json(json);
			
			if (json.src) return PointIcon.from_json(json);
		}
		
		if (type == "linestring") return Linestring.from_json(json);
	}
}