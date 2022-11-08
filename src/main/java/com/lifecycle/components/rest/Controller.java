package com.lifecycle.components.rest;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class Controller {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<RestResponse> handleException(Exception e, HttpServletRequest r) {
		RestResponse error = new RestResponse(new Date(), HttpStatus.BAD_REQUEST.value(), e.getMessage(),
				r.getRequestURI());

		return new ResponseEntity<RestResponse>(error, HttpStatus.BAD_REQUEST);
	}

	public ResponseEntity<RestResponse> handleSuccess() {
		ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		
		RestResponse resp = new RestResponse(new Date(), HttpStatus.OK.value(), "Success", attr.getRequest().getRequestURI());
		
		return new ResponseEntity<RestResponse>(resp, HttpStatus.OK);
	}
}
