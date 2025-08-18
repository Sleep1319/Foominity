package com.example.foominity.repository.board;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.foominity.domain.board.Review;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

        Optional<List<Review>> findTop4ByOrderByCreatedDateDesc();

        // @Query(" select r from Review r left join Like l on r.id = l.review.id group
        // by r.id order by COUNT(l) desc ")
        // Optional<List<Review>> getTop3LikeReviews(Pageable pageable);

        @Query("""
                        SELECT DISTINCT rc.review
                          FROM ReviewComment rc
                         WHERE rc.memberId = :memberId
                         """)
        List<Review> findParticipatedReviews(Long memberId);

        @Query("""
                        SELECT aa.review
                        FROM AlbumArtist aa
                        WHERE aa.artist.id = :artistId
                        """)
        List<Review> findReviewsByArtist(Long artistId);

        @Query("SELECT r FROM Review r WHERE LOWER(r.title) = LOWER(:title)")
        Optional<Review> findByTitle(@Param("title") String title);

        // @Query("""
        // SELECT DISTINCT r
        // FROM Review r
        // JOIN r.reviewCategory rc
        // JOIN rc.category c
        // WHERE c.categoryName IN :names
        // """)
        // List<Review> findByCategories(@Param("names") List<String> names);

        @Query("""
                            SELECT rc.review
                            FROM ReviewCategory rc
                            JOIN rc.category c
                            GROUP BY rc.review
                            HAVING COUNT(DISTINCT CASE WHEN c.categoryName IN :names THEN c.categoryName END) = :size
                        """)
        List<Review> findByCategories(@Param("names") List<String> names, @Param("size") long size);

        @Query("""
                        SELECT r
                        FROM Review r
                        WHERE (:search IS NULL OR :search = ''
                               OR LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%')))
                        """)
        Page<Review> findByTitleContainingIgnoreCase(@Param("search") String search, Pageable pageable);

        @Query("""
                            SELECT r
                            FROM ReviewCategory rc
                            JOIN rc.review r
                            JOIN rc.category c
                            WHERE c.categoryName IN :names
                            GROUP BY r
                            ORDER BY COUNT(DISTINCT c.id) DESC, r.id DESC
                        """)
        List<Review> findByAnyCategoryNames(@Param("names") List<String> names);

        @Query("""
                        SELECT DISTINCT r
                        FROM Review r
                        LEFT JOIN ReviewCategory rc ON rc.review = r
                        LEFT JOIN Category c ON rc.category = c
                        WHERE (:search IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%')))
                        AND (:#{#categories == null || #categories.isEmpty()} = TRUE OR c.categoryName IN :categories)
                        """)
        Page<Review> findFilteredReviews(
                        @Param("search") String search,
                        @Param("categories") List<String> categories,
                        Pageable pageable);

        // 인기순 정렬

        @Query(value = """
                        select r
                        from Review r
                        left join ReviewComment rc on rc.review = r
                        group by r.id
                        order by coalesce(avg(rc.starPoint), 0) desc, r.id desc
                        """, countQuery = "select count(r) from Review r")
        Page<Review> findAllOrderByAvgRating(Pageable pageable);

        @Query(value = """
                        select r
                        from Review r
                        left join ReviewComment rc on rc.review = r
                        where (:search is null or :search = ''
                               or lower(r.title) like lower(concat('%', :search, '%')))
                        group by r.id
                        order by coalesce(avg(rc.starPoint), 0) desc, r.id desc
                        """, countQuery = """
                        select count(r)
                        from Review r
                        where (:search is null or :search = ''
                               or lower(r.title) like lower(concat('%', :search, '%')))
                        """)
        Page<Review> searchByTitleOrderByAvg(@Param("search") String search, Pageable pageable);

        @Query(value = """
                        select r
                        from ReviewCategory rcg
                          join rcg.review r
                          join rcg.category c
                          left join ReviewComment cm on cm.review = r
                        where c.categoryName in :names
                        group by r.id
                        having count(distinct c.categoryName) = :size
                        order by coalesce(avg(cm.starPoint), 0) desc, r.id desc
                        """, countQuery = """
                        select count(distinct r.id)
                        from ReviewCategory rcg
                          join rcg.review r
                          join rcg.category c
                        where c.categoryName in :names
                        group by r.id
                        having count(distinct c.categoryName) = :size
                        """)
        Page<Review> findByCategoriesOrderByAvg(@Param("names") List<String> names,
                        @Param("size") long size,
                        Pageable pageable);

}
