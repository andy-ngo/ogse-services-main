package com.lifecycle.components.exceptionUtil;

import javax.persistence.EntityNotFoundException;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHelper {

	@ExceptionHandler(EntityNotFoundException.class)
	public ResponseEntity<Object> handleInvalidInputException(EntityNotFoundException ex){
		ExceptionModel e = new ExceptionModel(ex.getMessage(), HttpStatus.NOT_FOUND);
		return new ResponseEntity<Object>(e,HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(DuplicateKeyException.class)
	public ResponseEntity<Object> handleDuplicateEntry(DuplicateKeyException d){
		ExceptionModel e = new ExceptionModel(d.getMessage(), HttpStatus.BAD_REQUEST);
		return new ResponseEntity<Object>(e,HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Object> handleRuntimeError(RuntimeException ex){
		ExceptionModel e = new ExceptionModel(ex.getMessage(), HttpStatus.BAD_REQUEST);
		return new ResponseEntity<Object>(e, HttpStatus.BAD_REQUEST);
	}
	
}
