package com.skillforge.lms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootHealthController {

    @GetMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "status", "ONLINE",
                "service", "LearnSphere LMS Backend",
                "version", "1.0.0",
                "coursesEndpoint", "/api/v1/courses",
                "documentation", "/api/swagger-ui/index.html"
        ));
    }
}
