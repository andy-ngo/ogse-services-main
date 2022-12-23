package com;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

@Configuration
@EnableWebMvc
@EnableWebSocketMessageBroker
public class WebConfig implements WebMvcConfigurer, WebSocketMessageBrokerConfigurer{

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
		        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
    
    //Websocket configuration
    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry)
    {
        registry.addEndpoint("/results-channel").withSockJS();
    }

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry)
    {
        registry.setApplicationDestinationPrefixes("/server");
        registry.enableSimpleBroker("/client");
    }
    
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry)
    {
    	registry.setMessageSizeLimit(500*1024);
    	registry.setSendBufferSizeLimit(1024*1024);
    	registry.setSendTimeLimit(20000);
    }

    @Bean
    public ClassLoaderTemplateResolver templateResolver() {
        ClassLoaderTemplateResolver templateResolver = 
                new ClassLoaderTemplateResolver();
        templateResolver.setPrefix("/templates/");
        templateResolver.setSuffix(".html");
        templateResolver.setCharacterEncoding("UTF-8");

        return templateResolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver());
        return templateEngine;
    }
    
    @Bean
    public ViewResolver viewResolver() {
        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
        viewResolver.setTemplateEngine(templateEngine());
        viewResolver.setCharacterEncoding("UTF-8");
        return viewResolver;
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
      if (!registry.hasMappingForPattern("/static/css/**")) {
          registry.addResourceHandler("/static/css/**").addResourceLocations("classpath:/static/css/");
          registry.addResourceHandler("/static/js/**").addResourceLocations("classpath:/static/js/");
      }
    }
}