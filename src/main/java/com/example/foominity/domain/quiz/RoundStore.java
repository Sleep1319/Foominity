package com.example.foominity.domain.quiz;

import java.time.Instant;
import java.util.Optional;

public interface RoundStore {
        void save(
                        String roundId,
                        String trackId,
                        String title,
                        String artist,
                        Instant expiresAt,
                        Instant hintAvailableAt);

        Optional<RoundData> get(String roundId);

        void remove(String roundId);

        record RoundData(
                        String trackId,
                        String title,
                        String artist,
                        Instant expiresAt,
                        Instant hintAvailableAt) {
        }
}
