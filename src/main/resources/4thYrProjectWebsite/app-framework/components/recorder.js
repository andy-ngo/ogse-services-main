'use strict';

import Core from '../tools/core.js';

/** 
 * A component used to record a simulation trace (diagram, grid or GIS)
 **/
export default class Recorder { 
	
	/**
	 * Gets true if the recorder is recording, false otherwise
	 * @type {boolean}
	 */
	get recording() { return this._recording; }
	
	/**
	 * Sets whether the recorder is recording
	 * @type {boolean}
	 */
	set recording(value) { this._recording = value; }
	
	/**
	 * @param {canvas} canvas - an HTML5 canvas element
	 */	
	constructor(canvas) {		
		this.canvas = canvas;
		this.chunks = null;
		this._recording = false;
		
		var options;
		
		if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
			options = { mimeType: 'video/webm; codecs=vp9' };
		} 
		else {
			options = { mimeType: 'video/webm; codecs=vp8' };
		} 
		
	
		this.recorder = new MediaRecorder(canvas.captureStream(), options); // init the recorder
		
		// every time the recorder has new data, we will store it in our array
		this.recorder.ondataavailable = (function(ev) {
			if (ev.data && ev.data.size == 0) return;
			
			this.chunks.push(ev.data);
		}).bind(this);
	}	
	
	/**
	 * Begins the recording process
	 */	
	start() {
		this.recording = true;
		
		this.chunks = [];
		
		this.recorder.start();
	}
	
	/**
	 * Stops the recording process
	 */	
	stop() {
		this.recording = false;
		
		var d = Core.defer();
		
		this.recorder.onstop = e => d.Resolve();
		
		this.recorder.stop();
		
		return d.promise;
	}
	
	/**
	 * Downloads the video from the recorder
	 * @param {string} name - the name of the file to download
	 */	
	download(name) {
		// TODO : check if can use net.download
		if (this.chunks.length == 0) return;
		
		var blob = new Blob(this.chunks, { type: 'video/webm' });
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		
		document.body.appendChild(a);
		
		a.style = 'display: none';
		a.href = url;
		a.download = name + '.webm';
		a.click();
		
		window.URL.revokeObjectURL(url);
	}
}