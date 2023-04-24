'use strict';

import Style from "../../tools/style.js";
import Widget from '../../base/widget.js';
import Dom from '../../tools/dom.js';

/** 
 * A legend widget for OpenLayers maps. Wrapper around an ol.control.Legend
 **/
export default class Legend extends Widget { 
	
	/** 
	* Gets the OL control underlying the legend
	* @type {number} 
	*/
	get control() { return this._control; }
  
	constructor() {		
		super();
		
		this._control = new ol.control.Control({ element: this.elems.legend_container });
	}
	
    /**
     * Adds a legend section for a visual variable
	 * @param {object} variable - the visual variable
     */
	add_legend(variable) {
		if (variable.style.fill) {
			var rows = this.build_fill(variable.style.fill);
			
			this.add_legend_rows(variable.layer, `${variable.style.fill.property}`, rows);
		}
		
		if (variable.style.radius) {
			var rows = this.build_radius(variable.style.radius);
		
			this.add_legend_rows(variable.layer, `${variable.style.radius.property}`, rows);
		}
		/*
		if (variable.style.src) {
			var rows = this.build_scale(variable.style.scale, variable.style.src);
		
			this.add_legend_rows(variable.layer, `${variable.style.scale.property}`, rows);
		}
		*/
	}
	
    /**
     * Adds the legend rows 
	 * @param {object} layer - a layer configuration object
	 * @param {string} property - the property used for the visual variable
	 * @param {object[]} rows - the rows for the legend
     */
	add_legend_rows(layer, property, rows) {
		var sizes = rows.map(r => r.size);
		var size = Math.max(...sizes) * 2;
		
		var legend = new ol.control.Legend({ title:`${layer.label} - ${property}`, margin:5, size:[size, size], collapsed:false, target:this.control.element });
		
		rows.forEach(r => {
			legend.addRow({ title:r.title, typeGeom:"Point", style:r.style });
		});
		
		Dom.place(legend.element, this.control.element);
	}
	
    /**
     * Adds the zero value legend row
	 * @param {object[]} rows - the rows for the legend
	 * @param {object} buckets - the buckets used for a visual variable
	 * @param {string} color - the zero color
     */
	add_zero(rows, buckets, color) {
		for (var i = 0; i < buckets.length; i++) {
			if (buckets[i] > 0) break;
		}
		
		rows.splice(i, 0, {
			title: "0", 
			size: 8, 
			style: Style.point_style({
				radius: 8, 
				stroke: { color: "#000", width: 1 },
				fill: { color: color }
			})
		});
	}
	
    /**
     * Builds legend rows for a fill style
	 * @param {StaticFill, BucketFill} style - the fill style 
	 * @return {object[]} the legend rows for the legend
	 * @todo This should be in the style classes directly
     */
	build_fill(style) {
		var prev = null;
		
		var rows = style.buckets.map((b, i) => {
			var curr = b.toFixed(4).toString();
			var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;
			
			prev = curr;

			return {
				title: title, 
				size: 8, 
				style: Style.point_style({
					radius: 8, 
					stroke: { color: "#000", width: 1 },
					fill: { color: style.colors[i] }
				})
			}
		});
		
		if (style.zero) this.add_zero(rows, style.buckets, style.zero);
		
		return rows;
	}
	
    /**
     * Builds legend rows for a radius style
	 * @param {StaticRadius|BucketRadius} style - the radius style 
	 * @return {object[]} the legend rows for the legend
	 * @todo This should be in the style classes directly
     */
	build_radius(style){
		var prev = null;
		
		var rows = style.buckets.map((b, i) => {			
			var curr = b.toFixed(4).toString();
			var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;

			prev = curr;
			
			return {
				title: title, 
				size: style.radius[i], 
				style: Style.point_style({
					radius: style.radius[i], 
					stroke: { color: "#000", width: 1 } ,
					fill: { color: "#fff" }
				})
			}
		});
		
		if (style.zero) this.add_zero(rows, style.buckets, style.zero);
		
		return rows;
	}
	
    /**
     * Builds legend rows for a scale style
	 * @param {StaticScale|BucketScale} style - the scale style 
	 * @param {string} src - the source for the icon
	 * @return {object[]} the legend rows for the legend
	 * @todo This should be in the style classes directly
     */
	build_scale(style, src){
		var prev = null;
		
		var rows = style.buckets.map((b, i) => {
			var curr = b.toFixed(4).toString();
			var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;

			prev = curr;
			
			return {
				title: title, 
				size: style.scale[i], 
				style: Style.point_icon_style({
					scale: style.scale[i], 
					src: src
				})
			}
		});
		
		if (style.zero) this.add_zero(rows, style.buckets, style.zero);
		
		return rows;
	}
	
	/**
	 * Create HTML for select element
	 * @returns {string} HTML for select element
	 */
	html() {
		return "<div handle='legend_container' class='ol-control ol-legend-container'></div>";
	}
}