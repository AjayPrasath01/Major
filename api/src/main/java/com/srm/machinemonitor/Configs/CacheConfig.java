package com.srm.machinemonitor.Configs;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager("monitor");
        return cacheManager;
    }

//    public Caffeine caffeineConfig() {
//        return Caffeine.newBuilder()
//                .recordStats()
//                .maximumSize(1000)
//                .expireAfterWrite(30, TimeUnit.MINUTES);
//    }
//
//    public CacheManager cacheManager(Caffeine caffeine) {
//        CaffeineCacheManager cacheManager = new CaffeineCacheManager("monitor");
//        cacheManager.setCaffeine(caffeine);
////        cacheManager.setCacheNames(List.of("monitor"));
//        return cacheManager;
//    }

}
