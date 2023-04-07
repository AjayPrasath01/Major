package com.srm.machinemonitor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimiter {
    private final Map<String, Long> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, Long> lastRequestTimes = new ConcurrentHashMap<>();
    private final long limit;
    private final long interval;

    public RateLimiter(long limit, long interval) {
        this.limit = limit;
        this.interval = interval;
    }

    public synchronized boolean allow(String key) {
        long now = System.currentTimeMillis();
        requestCounts.putIfAbsent(key, 0L);
        lastRequestTimes.putIfAbsent(key, now);
        if (now - lastRequestTimes.get(key) > interval) {
            requestCounts.put(key, 0L);
            lastRequestTimes.put(key, now);
        }
        if (requestCounts.get(key) < limit) {
            requestCounts.put(key, requestCounts.get(key) + 1);
            return true;
        } else {
            return false;
        }
    }
}
