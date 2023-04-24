'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Widget from '../base/widget.js';

export default Core.templatable("Api.Widget.Playback", class Playback extends Widget { 

	get is_looping() { return this.settings.loop; } 
	
	get interval() { return 1000 / this.settings.speed; }

	get recorder() { return this._recorder; } 
	
	set recorder(value) {
		this._recorder = value;
		
		Dom.toggle_css(this.elems.record, "hidden", !value);
	}
	
	get recording() { return (this.recorder) ? this.recorder.recording : false; }

	constructor(container) {
		super(container);
		
		this.current = 0;
		this._interval = null;
		this.direction = null;
		
		this.enable(false);
		
		this.elems.first.addEventListener("click", this.on_first_click.bind(this));
		this.elems.stepBack.addEventListener("click", this.on_step_back_click.bind(this));
		this.elems.rewind.addEventListener("click", this.on_rewind_click.bind(this));
		this.elems.play.addEventListener("click", this.on_play_click.bind(this));
		this.elems.stepForward.addEventListener("click", this.on_step_forward_click.bind(this));
		this.elems.last.addEventListener("click", this.on_last_click.bind(this));
		this.elems.slider.addEventListener("input", this.on_slider_change.bind(this));
		this.elems.record.addEventListener("click", this.on_record_click.bind(this));
	}
	
	initialize(simulation, settings) {
		this.simulation = simulation;
		this.settings = settings;
		
		this.values = this.simulation.frames.map((f) => { return f.time; });
		
		this.min = 0;
		this.max = this.values.length - 1;
		
		this.elems.slider.setAttribute("min", this.min);
		this.elems.slider.setAttribute("max", this.max);
		
		this.set_current(this.min);
		
		this.enable(true);
	}
	
	enable (isEnabled) {
		this.elems.first.disabled = !isEnabled;
		this.elems.stepBack.disabled = !isEnabled;
		this.elems.rewind.disabled = !isEnabled;
		this.elems.play.disabled = !isEnabled;
		this.elems.stepForward.disabled = !isEnabled;
		this.elems.last.disabled = !isEnabled;
		this.elems.slider.disabled = !isEnabled;
		this.elems.record.disabled = !isEnabled;
	}
	
	set_current(i) {
		this.current = i;
		
		this.elems.label.innerHTML = this.values[this.current];
		this.elems.slider.value = this.current;
	}
	
	stop() {
		var d = this.direction;
		
		this.direction = null;
		
		if (this._interval) clearInterval(this._interval);
		
		Dom.set_css(this.elems.rewind, "fas fa-backward");
		Dom.set_css(this.elems.play, "fas fa-play");
		
		return d;
	}
	
	play(interval) {		
		this.direction = "play";
		
		this._interval = setInterval(() => { 
			if (this.current < this.max) this.go_to_next();
		
			else if (this.is_looping) this.go_to(this.min);
			
			else this.stop();
		}, interval);
	}
	
	rewind(interval) {
		this.direction = "rewind";
		
		this._interval = setInterval(() => { 
			if (this.current > this.min) this.go_to_previous();
		
			else if (this.is_looping) this.go_to(this.max);
			
			else this.stop();
		}, interval);
	}
	
	go_to_previous() {
		this.set_current(--this.current);
		
		this.simulation.go_to_previous_frame();
	}
	
	go_to_next() {
		this.set_current(++this.current);
		
		this.simulation.go_to_next_frame();
	}
	
	go_to(i) {
		this.set_current(i);
		
		this.simulation.go_to_frame(i);
	}
	
	on_first_click(ev) {
		this.stop();
		
		this.go_to(this.min);
	}
	
	on_step_back_click(ev) {
		this.stop();
		
		if (this.current > this.min) this.go_to_previous();
		
		else if (this.is_looping, this.go_to(this.max));
	}
	
	on_rewind_click(ev) {
		if (this.stop() == "rewind") return;
		
		Dom.set_css(this.elems.rewind, "fas fa-pause");
		
		this.rewind(this.interval);
	}
	
	on_play_click(ev) {
		if (this.stop() == "play") return;
		
		Dom.set_css(this.elems.play, "fas fa-pause");
		
		this.play(this.interval);
	}
	
	on_step_forward_click(ev) {
		this.stop();
		
		if (this.current < this.max) this.go_to_next();
		
		else if (this.is_looping) this.go_to(this.min)
	}
	
	on_last_click(ev) {
		this.stop();
		
		this.go_to(this.max);
	}
	
	on_record_click(ev) {
		if (this.recorder.recording) {
			Dom.set_css(this.elems.record, "fas fa-circle record");
			
			this.recorder.stop().then(e => {
				this.recorder.download(this.simulation.name);
			});
		}
		else {
			Dom.set_css(this.elems.record, "fas fa-square record");
			
			this.recorder.start();
		}
	}
	
	on_slider_change(ev) {
		this.stop();
		
		this.go_to(+ev.target.value);
	}
		
	html() {
		return "<div class='playback'>" +
				  "<div class='controls'>" +
				     "<button handle='first' title='nls(Playback_FastBackward)' class='fas fa-fast-backward'></button>" +
				     "<button handle='stepBack' title='nls(Playback_StepBack)' class='fas fa-step-backward'></button>" +
				     "<button handle='rewind' title='nls(Playback_Backwards)' class='fas fa-backward'></button>" +
				     "<button handle='play' title='nls(Playback_Play)' class='fas fa-play'></button>" +
				     "<button handle='stepForward' title='nls(Playback_StepForward)' class='fas fa-step-forward'></button>" +
				     "<button handle='last' title='nls(Playback_FastForward)' class='fas fa-fast-forward'></button>" +
			      "</div>" + 
			      "<input handle='slider' class='slider' title='nls(Playback_Seek)' type='range' min='0' max='1'>" +
			      "<label handle='label' class='label'>00:00:00:00</label>" + 
			      "<button handle='record' title='nls(Playback_Record)' class='fas fa-circle record hidden'></button>" +
		       "</div>" ;
	}

	localize(nls) {
		super.localize(nls);
		
		nls.add("Playback_FastBackward", "en", "Go to first frame");
		nls.add("Playback_StepBack", "en", "Step back");
		nls.add("Playback_Backwards", "en", "Play backwards");		
		nls.add("Playback_Play", "en", "Play forward");		
		nls.add("Playback_StepForward", "en", "Step forward");		
		nls.add("Playback_FastForward", "en", "Go to last frame");		
		nls.add("Playback_Seek", "en", "Slide to seek frame");		
		nls.add("Playback_Record", "en", "Record simulation to .web");		
	}
});