package com.example.reactbootserver.repository;

import com.example.reactbootserver.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SignRepository extends JpaRepository<Member, Long> {

    Optional<Member> findById (int id);
    //이메일로 찾기
    public Optional<Member> findByEmail(String email);

    //넥네임으로 찾기
    public Optional<Member> findByNickname (String nickname);

    boolean existsByEmail (String email);

    boolean existsByNickname (String nickname);
}
