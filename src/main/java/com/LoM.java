package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.SpringVersion;

@SpringBootApplication
public class LoM {

    public static void main(String[] args) {
    	java.util.logging.Logger.getLogger("org.apache").setLevel(java.util.logging.Level.WARNING);

        SpringApplication.run(LoM.class, args);
    }
}
