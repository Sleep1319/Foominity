package com.example.foominity.service.quiz;

import com.example.foominity.domain.quiz.RoundStore;
import com.example.foominity.domain.quiz.RoundStore.RoundData;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryRoundStore implements RoundStore {

    private final Map<String, RoundData> store = new ConcurrentHashMap<>();

    @Override
    public void save(String roundId, String trackId, String title, String artist,
            Instant expiresAt, Instant hintAvailableAt) {
        store.put(roundId, new RoundData(trackId, title, artist, expiresAt, hintAvailableAt));
    }

    @Override
    public Optional<RoundData> get(String roundId) {
        return Optional.ofNullable(store.get(roundId));
    }

    @Override
    public void remove(String roundId) {
        store.remove(roundId);
    }
}
