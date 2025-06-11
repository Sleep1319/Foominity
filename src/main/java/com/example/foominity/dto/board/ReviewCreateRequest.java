
import org.springframework.lang.Nullable;

import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.member.Member;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCreateRequest {

    @NotNull
    private Member memberId;

    @NotNull
    private String title;

    @NotNull
    private String content;

    @Nullable
    private float starPoint;

    private String Category;

    public Review toEntity(ReviewCreateRequest req, Member member) {
        return new Review(title, content, null, starPoint);
    }

}
