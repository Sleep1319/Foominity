package com.example.foominity.service.magazine;

import java.io.FileInputStream;
import java.net.URL;
import java.time.Duration;
import java.util.Comparator;
import java.sql.Date;
import java.util.List;

import com.example.foominity.config.jwt.JwtTokenProvider;
import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.notice.Magazine;
import com.example.foominity.exception.UnauthorizedException;

import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.foominity.dto.magazine.MagazineRequest;
import com.example.foominity.dto.magazine.MagazineResponse;
import com.example.foominity.dto.magazine.PendingMagazine;
import com.example.foominity.exception.ForbiddenActionException;
import com.example.foominity.exception.NoPendingNewsException;
import com.example.foominity.exception.NotFoundMemberException;
import com.example.foominity.exception.NotFoundNoticeException;
import com.example.foominity.repository.member.MemberRepository;
import com.example.foominity.repository.notice.MagazineRepository;
import com.example.foominity.service.image.ImageService;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import com.rometools.rome.feed.synd.*;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import org.apache.commons.text.StringEscapeUtils;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class MagazineService {

    private final MagazineRepository magazineRepository;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ImageService imageService;
    private final Environment env;
    private final MagazineAIService magazineAIService;

    public Page<MagazineResponse> findAll(int page) {
        PageRequest pageable = PageRequest.of(page, 4, Sort.by(Sort.Direction.DESC, "id"));
        Page<Magazine> notices = magazineRepository.findAll(pageable);
        List<MagazineResponse> magazineResponseList = notices.stream()
                .map(notice -> new MagazineResponse(notice.getId(), notice.getTitle(), notice.getSummary(),
                        notice.getContent(),
                        notice.getCreatedDate(),
                        notice.getImageFile().getSavePath(),
                        notice.getKeyPoints(),
                        notice.getOriginalUrl(),
                        notice.getPublishedDate()))
                .toList();
        return new PageImpl<>(magazineResponseList, pageable, notices.getTotalElements());
    }

    public MagazineResponse findByID(Long id) {
        Magazine notice = magazineRepository.findById(id).orElseThrow(NotFoundNoticeException::new);
        return new MagazineResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getSummary(),
                notice.getContent(),
                notice.getCreatedDate(),
                notice.getImageFile().getSavePath(),
                notice.getKeyPoints(),
                notice.getOriginalUrl(),
                notice.getPublishedDate());
    }

    @Transactional
    public void createNotice(MagazineRequest req, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        ImageFile imageFile = null;
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            imageFile = imageService.imageUpload(req.getImage());
        } else if (req.getImagePath() != null && !req.getImagePath().isBlank()) {
            imageFile = imageService.getImageByPath(req.getImagePath());
        } else {
            throw new IllegalArgumentException("이미지 정보가 없습니다.");
        }

        Magazine notice = req.toEntity();
        notice.setImageFile(imageFile);
        notice.setOriginalUrl(req.getOriginalUrl());
        magazineRepository.save(notice);
    }

    @Transactional
    public void deleteNotice(Long id, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        Magazine notice = magazineRepository.findById(id).orElseThrow(NotFoundNoticeException::new);
        magazineRepository.delete(notice);
    }

    @Transactional
    public void changeMainNotice(Long newMainNoticeId, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId).orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        magazineRepository.findByMainNoticeTrue().ifPresent(mainNotice -> {
            mainNotice.cancelNotice();
            magazineRepository.save(mainNotice);
        });

        magazineRepository.findById(newMainNoticeId)
                .map(newMain -> {
                    newMain.changeNotice();
                    return magazineRepository.save(newMain);
                })
                .orElseThrow(NotFoundNoticeException::new);
    }

    public List<MagazineResponse> findAllNotices() {
        List<Magazine> notices = magazineRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        return notices.stream()
                .map(notice -> new MagazineResponse(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getSummary(),
                        notice.getContent(),
                        notice.getCreatedDate(),
                        notice.getImageFile().getSavePath(),
                        notice.getKeyPoints(),
                        notice.getOriginalUrl(),
                        notice.getPublishedDate()))
                .toList();
    }

    public List<MagazineResponse> getLatest() {
        List<Magazine> noticeList = magazineRepository.findTop4ByOrderByIdDesc()
                .orElseThrow(NotFoundNoticeException::new);

        return noticeList.stream()
                .map(notice -> new MagazineResponse(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getSummary(),
                        notice.getContent(),
                        notice.getCreatedDate(),
                        notice.getImageFile().getSavePath(),
                        notice.getKeyPoints(),
                        notice.getOriginalUrl(),
                        notice.getPublishedDate()))
                .toList();
    }

    public PendingMagazine getNextPending() throws NoPendingNewsException {
        try {
            URL feedUrl = new URL("https://pitchfork.com/rss/news/");
            SyndFeed feed = new SyndFeedInput().build(new XmlReader(feedUrl));

            return feed.getEntries().stream()
                    .filter(e -> !magazineRepository.existsByOriginalUrl(e.getLink()))
                    .sorted(Comparator.comparing(SyndEntry::getPublishedDate)) // 오래된 순
                    .findFirst()
                    .map(this::toPending)
                    .orElseThrow(NoPendingNewsException::new);

        } catch (NoPendingNewsException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Pending fetch failed", e);
        }
    }

    @Transactional
    public void publishPending(MagazineRequest req, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveTokenFromCookie(request);
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException();
        }

        Long memberId = jwtTokenProvider.getUserIdFromToken(token);
        Member member = memberRepository.findById(memberId)
                .orElseThrow(NotFoundMemberException::new);

        if (!"ADMIN".equals(member.getRole().getName())) {
            throw new ForbiddenActionException();
        }

        Magazine mag = req.toEntity();
        mag.setOriginalUrl(req.getOriginalUrl());

        if (req.getKeyPoints() != null) {
            mag.setKeyPoints(req.getKeyPoints());
        }

        mag.setSummary(req.getSummary());

        mag.setPublishedDate(Date.valueOf(req.getPublishedDate()));

        ImageFile imageFile = null;
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            imageFile = imageService.imageUpload(req.getImage());
        } else if (req.getImagePath() != null && !req.getImagePath().isBlank()) {
            String path = req.getImagePath() != null ? req.getImagePath().trim() : "";

            if (!path.isBlank()) {
                if (path.startsWith("http")) {
                    imageFile = imageService.downloadAndSaveFromUrl(path);
                } else {
                    imageFile = imageService.getImageByPath(path);
                }
            }
        }

        mag.setImageFile(imageFile);

        magazineRepository.save(mag);
    }

    private PendingMagazine toPending(SyndEntry entry) {
        String full = fetchArticleBodyWithSelenium(entry.getLink());

        String translatedTitle = StringEscapeUtils.unescapeHtml4(translateText(entry.getTitle(), "ko"));
        String translatedContent = StringEscapeUtils.unescapeHtml4(translateText(full, "ko"));

        String summary = entry.getDescription() != null
                ? StringEscapeUtils.unescapeHtml4(
                        StringEscapeUtils.unescapeHtml4(
                                translateText(entry.getDescription().getValue(), "ko")))
                : "";

        List<String> keyPoints = magazineAIService.extractKeyPoints(translatedContent);

        String imageUrl = null;
        for (org.jdom2.Element element : entry.getForeignMarkup()) {
            if ("thumbnail".equals(element.getName()) &&
                    "http://search.yahoo.com/mrss/".equals(element.getNamespaceURI())) {

                imageUrl = element.getAttributeValue("url");
                break;
            }
        }

        return new PendingMagazine(
                entry.getTitle(),
                translatedTitle,
                summary,
                translatedContent,
                keyPoints,
                imageUrl,
                entry.getLink(), // 뉴스 한 건 = 하나의 entry
                entry.getPublishedDate());
    }

    private String translateText(String text, String targetLanguage) {
        try (FileInputStream keyStream = new FileInputStream(env.getProperty("google.translate.credentials-path"))) {
            GoogleCredentials credentials = GoogleCredentials.fromStream(keyStream);
            Translate translate = TranslateOptions.newBuilder()
                    .setCredentials(credentials)
                    .build()
                    .getService();

            Translation translation = translate.translate(
                    text,
                    Translate.TranslateOption.targetLanguage(targetLanguage),
                    Translate.TranslateOption.format("html"));

            return translation.getTranslatedText();
        } catch (Exception e) {
            e.printStackTrace();
            return "[번역 실패]";
        }
    }

    private String fetchArticleBodyWithSelenium(String url) {
        System.setProperty("webdriver.chrome.driver", "C:\\chromedriver\\chromedriver.exe");

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        WebDriver driver = new ChromeDriver(options);
        try {
            driver.get(url);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.presenceOfElementLocated(
                    By.cssSelector("div.body__inner-container")));

            return driver.findElement(By.cssSelector("div.body__inner-container")).getText();

        } catch (Exception e) {
            e.printStackTrace();
            return "[본문 크롤링 실패]";
        } finally {
            driver.quit();
        }
    }
}