package com.lifecycle.components.exceptionUtil;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

public class ExceptionModel {
	private String message;
	private HttpStatus code;
	private String timeStamp;
	
	public ExceptionModel(String message, HttpStatus code) {
		super();
		this.message = message;
		this.code = code;
		this.timeStamp = new Timestamp(System.currentTimeMillis())+"";
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public HttpStatus getCode() {
		return code;
	}
	public void setCode(HttpStatus code) {
		this.code = code;
	}
	public String getTimeStamp() {
		return timeStamp;
	}
	public void setTimeStamp(String timeStamp) {
		this.timeStamp = timeStamp;
	}
	
}
