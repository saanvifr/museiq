package com.museiq.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final RestTemplate restTemplate;

    public SearchController() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping
    public ResponseEntity<?> searchiTunes(@RequestParam String query, @RequestParam(defaultValue = "album") String type) {
        try {
            // The frontend passes query and type=album
            String url = "https://itunes.apple.com/search?term=" + query + "&entity=" + type;
            String result = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching from iTunes API: " + e.getMessage());
        }
    }
}
