package com.srm.machinemonitor.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.util.zip.GZIPInputStream;

@RestController
public class CompressedResource {

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping("/bundle.js.gz")
    public ResponseEntity<Resource> getBundleGzip() throws IOException {
        Resource resource = resourceLoader.getResource("classpath:/static/bundle.js.gz");
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }
        InputStream gzippedInputStream = new GZIPInputStream(resource.getInputStream());
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/javascript");
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(resource.contentLength())
                .body(new InputStreamResource(gzippedInputStream));
    }
}
