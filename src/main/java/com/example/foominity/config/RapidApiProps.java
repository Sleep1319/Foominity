package com.example.foominity.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "rapidapi")
@Data
public class RapidApiProps {
  private String key;
  private Hosts hosts;

  @Data
  public static class Hosts {
    private String musixmatch;
    // private String shazam;
  }
}
