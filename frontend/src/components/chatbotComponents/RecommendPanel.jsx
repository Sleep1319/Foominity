// src/components/chatbotComponents/RecommendPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import { Box, VStack, HStack, Text, Checkbox, CheckboxGroup, Button, Spinner, Link, Icon } from "@chakra-ui/react";
import axios from "axios";
import { FiYoutube } from "react-icons/fi";
import { AiFillYoutube } from "react-icons/ai";

const mbtiQuestions = [
  { question: "주말에 나는…", choices: ["📖 책 읽으며 차분히 쉬기", "🕺 클럽·파티에 놀러 가기"] },
  { question: "음악을 들을 때 주로 듣는 분위기는?", choices: ["😌 잔잔하고 부드러운 멜로디", "⚡️ 강한 비트와 드롭"] },
  { question: "새로운 음악을 발견하는 방법은?", choices: ["🎧 좋아하는 장르 위주", "🌍 추천 리스트·월드뮤직"] },
  { question: "노래에서 가장 중요한 요소는?", choices: ["🎤 가사와 보컬 감정 전달", "🥁 리듬·비트"] },
  { question: "플레이리스트에 가장 많이 담는 트랙은?", choices: ["🎸 어쿠스틱·발라드곡", "🚀 EDM·힙합·록"] },
  { question: "긴 하루를 보낸 후 듣고 싶은 곡은?", choices: ["🌙 부드러운 피아노·재즈", "🔊 에너지 폭발 록·댄스곡"] },
];

const genreOptions = ["Hip-Hop", "Pop", "Rock", "R&B", "Ballad", "Other"];

export default function RecommendPanel({ onResult }) {
  const [preferredGenres, setPreferredGenres] = useState([]);
  const [phase, setPhase] = useState("genre"); // "genre" → "mbti" → "done"
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState("");
  const scrollRef = useRef(null);

  // 1) 장르 고르면 MBTI 단계로
  useEffect(() => {
    if (phase === "genre" && preferredGenres.length > 0) {
      setPhase("mbti");
    }
  }, [preferredGenres, phase]);

  // 2) 답변 늘어날 때마다 스크롤 맨 아래로
  useEffect(() => {
    if (phase === "mbti" && scrollRef.current) {
      const c = scrollRef.current;
      setTimeout(() => {
        c.scrollTo({ top: c.scrollHeight, behavior: "smooth" });
      }, 0);
    }
  }, [answers]);

  // 장르 변경 (최대 3개)
  const handleGenreChange = (vals) => {
    if (vals.length <= 3) setPreferredGenres(vals);
  };

  // MBTI 답변
  const handleAnswer = (idx, choice) => {
    if (loading || done) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = choice;
      return next;
    });
  };

  // 제출
  const handleSubmit = async () => {
    if (
      loading ||
      done ||
      preferredGenres.length === 0 ||
      answers.length !== mbtiQuestions.length ||
      answers.some((a) => a == null)
    ) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/chat", {
        mode: "recommend",
        preferredGenres,
        mbtiAnswers: answers,
      });
      setResult(data.reply);
      onResult?.(data.reply);
      setDone(true);
    } catch {
      const err = "추천 생성 중 오류가 발생했어요.";
      setResult(err);
      onResult?.(err);
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  // 추천 결과에서 번호+곡명 형태만 추출
  const songs = done
    ? result
        .split(/\r?\n/)
        .map((line) => line.replace(/[*_]/g, "").trim())
        .filter((line) => /^\d+\.\s/.test(line))
        .map((line) => line.replace(/^\d+\.\s*/, ""))
    : [];

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} h="100%" display="flex" flexDirection="column">
      {/* 설문 & 질문 생략, 완료 후에는 링크만 */}
      {!done ? (
        <VStack ref={scrollRef} align="stretch" spacing={6} flexGrow={1} overflowY="auto">
          {/* 1) 장르 선택 */}
          <Box>
            <Text fontWeight="bold">추천받고 싶은 장르를 선택해주세요! (최대 3개)</Text>
            <CheckboxGroup value={preferredGenres} onChange={handleGenreChange} colorScheme="blue">
              <HStack wrap="wrap" spacing={4}>
                {genreOptions.map((g) => (
                  <Checkbox
                    key={g}
                    value={g}
                    isDisabled={(preferredGenres.length >= 3 && !preferredGenres.includes(g)) || loading || done}
                  >
                    {g}
                  </Checkbox>
                ))}
              </HStack>
            </CheckboxGroup>
          </Box>
          {/* 2~7) MBTI 질문 */}
          {phase === "mbti" &&
            mbtiQuestions.map((q, i) => {
              if (i > answers.length) return null;
              return (
                <Box key={i}>
                  <Text fontWeight="bold">
                    {i + 1}) {q.question}
                  </Text>
                  <HStack spacing={4} mt={2}>
                    <Button
                      fontWeight="md"
                      flex={1}
                      variant={answers[i] === "A" ? "solid" : "outline"}
                      onClick={() => handleAnswer(i, "A")}
                      isDisabled={loading}
                    >
                      A) {q.choices[0]}
                    </Button>
                    <Button
                      fontWeight="md"
                      flex={1}
                      variant={answers[i] === "B" ? "solid" : "outline"}
                      onClick={() => handleAnswer(i, "B")}
                      isDisabled={loading}
                    >
                      B) {q.choices[1]}
                    </Button>
                  </HStack>
                </Box>
              );
            })}
        </VStack>
      ) : (
        // 완료 후: 유튜브 링크만 표시
        <VStack align="stretch" spacing={4} flexGrow={1} overflowY="auto">
          <Text mt="3px" mb="10px">
            지금 바로 유튜브에서 추천받은 곡들을 들어보세요!
          </Text>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            songs.map((song, idx) => (
              <Link
                key={idx}
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`}
                isExternal
                mb="11px"
              >
                <HStack spacing={2}>
                  <Icon as={AiFillYoutube} boxSize={5} color="red.500" />
                  <Text fontWeight="medium" color="gray.600" _hover={{ color: "black" }}>
                    {idx + 1}. {song}
                  </Text>
                </HStack>
              </Link>
            ))
          )}
        </VStack>
      )}

      {/* 제출 버튼 (done 전, 마지막 질문 완료 시) */}
      {!done && phase === "mbti" && answers.length === mbtiQuestions.length && (
        <Button
          mt={4}
          bg="black"
          color="white"
          onClick={handleSubmit}
          isLoading={loading}
          isDisabled={loading}
          width="100%"
          _hover={{ bg: "black", color: "white" }}
        >
          제출하기
        </Button>
      )}
    </Box>
  );
}

// // src/components/chatbotComponents/RecommendPanel.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Box, VStack, HStack, Text, Checkbox, CheckboxGroup, Button, Spinner } from "@chakra-ui/react";
// import axios from "axios";

// const mbtiQuestions = [
//   { question: "주말에 나는…", choices: ["📖 책 읽으며 차분히 쉬기", "🕺 클럽·파티에 놀러 가기"] },
//   { question: "음악을 들을 때 주로 듣는 분위기는?", choices: ["😌 잔잔하고 부드러운 멜로디", "⚡️ 강한 비트와 드롭"] },
//   { question: "새로운 음악을 발견하는 방법은?", choices: ["🎧 좋아하는 장르 위주", "🌍 추천 리스트·월드뮤직"] },
//   { question: "노래에서 가장 중요한 요소는?", choices: ["🎤 가사와 보컬 감정 전달", "🥁 리듬·비트"] },
//   { question: "플레이리스트에 가장 많이 담는 트랙은?", choices: ["🎸 어쿠스틱·발라드곡", "🚀 EDM·힙합·록"] },
//   { question: "긴 하루를 보낸 후 듣고 싶은 곡은?", choices: ["🌙 부드러운 피아노·재즈", "🔊 에너지 폭발 록·댄스곡"] },
// ];

// const genreOptions = ["Hip-Hop", "Pop", "Rock", "R&B", "Ballad", "Other"];

// export default function RecommendPanel({ onResult }) {
//   const [preferredGenres, setPreferredGenres] = useState([]);
//   const [phase, setPhase] = useState("genre"); // "genre" → "mbti" → "done"
//   const [answers, setAnswers] = useState([]); // e.g. ["A", "B", …]
//   const [loading, setLoading] = useState(false);
//   const [done, setDone] = useState(false);
//   const [result, setResult] = useState("");
//   const scrollRef = useRef(null);

//   // 1) 장르 고르면 바로 MBTI 단계로 전환
//   useEffect(() => {
//     if (phase === "genre" && preferredGenres.length > 0) {
//       setPhase("mbti");
//     }
//   }, [preferredGenres, phase]);

//   // 2) answers가 늘어날 때마다 스크롤 맨 아래로
//   useEffect(() => {
//     const c = scrollRef.current;
//     if (c) {
//       setTimeout(() => {
//         c.scrollTo({ top: c.scrollHeight, behavior: "smooth" });
//       }, 0);
//     }
//   }, [answers]);

//   // 장르 변경: 최대 3개까지만 허용
//   const handleGenreChange = (vals) => {
//     if (vals.length <= 3) {
//       setPreferredGenres(vals);
//     }
//   };

//   // MBTI 답변 핸들러
//   const handleAnswer = (idx, choice) => {
//     if (loading || done) return;
//     setAnswers((prev) => {
//       const next = [...prev];
//       next[idx] = choice;
//       return next;
//     });
//   };

//   // 제출
//   const handleSubmit = async () => {
//     if (
//       loading ||
//       done ||
//       preferredGenres.length === 0 ||
//       answers.length !== mbtiQuestions.length ||
//       answers.some((a) => a == null)
//     ) {
//       return;
//     }
//     setLoading(true);
//     try {
//       const { data } = await axios.post("/api/chat", {
//         mode: "recommend",
//         preferredGenres,
//         mbtiAnswers: answers,
//       });
//       setResult(data.reply);
//       onResult?.(data.reply);
//     } catch {
//       const err = "추천 생성 중 오류가 발생했어요.";
//       setResult(err);
//       onResult?.(err);
//     } finally {
//       setLoading(false);
//       setDone(true);
//     }
//   };

//   return (
//     <Box borderWidth="1px" borderRadius="md" p={4} h="100%" display="flex" flexDirection="column">
//       {/* 스크롤 가능한 질문 영역 */}
//       <VStack ref={scrollRef} align="stretch" spacing={6} flexGrow={1} overflowY="auto">
//         {/* 1) 항상 보이는 장르 선택 */}
//         <Box>
//           <Text fontWeight="bold">추천받고 싶은 장르를 선택해주세요! (최대 3개)</Text>
//           <CheckboxGroup value={preferredGenres} onChange={handleGenreChange} colorScheme="blue">
//             <HStack wrap="wrap" spacing={4}>
//               {genreOptions.map((g) => (
//                 <Checkbox
//                   key={g}
//                   value={g}
//                   isDisabled={done || (preferredGenres.length >= 3 && !preferredGenres.includes(g))}
//                 >
//                   {g}
//                 </Checkbox>
//               ))}
//             </HStack>
//           </CheckboxGroup>
//         </Box>

//         {/* 2~7) MBTI 질문: 답한 만큼만 쌓아서 표시 */}
//         {phase === "mbti" &&
//           mbtiQuestions.map((q, i) => {
//             if (i > answers.length) return null;
//             return (
//               <Box key={i}>
//                 <Text fontWeight="bold">
//                   {i + 1}) {q.question}
//                 </Text>
//                 <HStack spacing={4} mt={2}>
//                   <Button
//                     flex={1}
//                     variant={answers[i] === "A" ? "solid" : "outline"}
//                     onClick={() => handleAnswer(i, "A")}
//                     isDisabled={loading || done}
//                   >
//                     A) {q.choices[0]}
//                   </Button>
//                   <Button
//                     flex={1}
//                     variant={answers[i] === "B" ? "solid" : "outline"}
//                     onClick={() => handleAnswer(i, "B")}
//                     isDisabled={loading || done}
//                   >
//                     B) {q.choices[1]}
//                   </Button>
//                 </HStack>
//               </Box>
//             );
//           })}

//         {/* 결과 영역도 이 안에 표시됩니다. */}
//         {done && (
//           <Box textAlign="center" py={8}>
//             {loading ? (
//               <Spinner size="lg" />
//             ) : (
//               <>
//                 <Text fontWeight="bold" mb={4}>
//                   🎉 추천 결과
//                 </Text>
//                 <Text whiteSpace="pre-wrap">{result}</Text>
//               </>
//             )}
//           </Box>
//         )}
//       </VStack>

//       {/* 제출 버튼: 스크롤 영역 밖에 고정 */}
//       {phase === "mbti" && answers.length === mbtiQuestions.length && !done && (
//         <Button
//           mt={4}
//           bg="black"
//           color="white"
//           onClick={handleSubmit}
//           isLoading={loading}
//           isDisabled={loading}
//           width="100%"
//           _hover={{
//             bg: "black",
//             color: "white",
//           }}
//         >
//           제출하기
//         </Button>
//       )}
//     </Box>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { Box, VStack, HStack, Text, Checkbox, CheckboxGroup, Button, Spinner } from "@chakra-ui/react";
// import axios from "axios";
import { FaYoutube } from "react-icons/fa";

// const mbtiQuestions = [
//   {
//     question: "주말에 나는…",
//     choices: ["📖 책 읽으며 차분히 쉬기", "🕺 클럽·파티에 놀러 가기"],
//   },
//   {
//     question: "음악을 들을 때 주로 듣는 분위기는?",
//     choices: ["😌 잔잔하고 부드러운 멜로디", "⚡️ 강한 비트와 드롭"],
//   },
//   {
//     question: "새로운 음악을 발견하는 방법은?",
//     choices: ["🎧 좋아하는 장르 위주", "🌍 추천 리스트·월드뮤직"],
//   },
//   {
//     question: "노래에서 가장 중요한 요소는?",
//     choices: ["🎤 가사와 보컬 감정 전달", "🥁 리듬·비트"],
//   },
//   {
//     question: "플레이리스트에 가장 많이 담는 트랙은?",
//     choices: ["🎸 어쿠스틱·발라드곡", "🚀 EDM·힙합·록"],
//   },
//   {
//     question: "긴 하루를 보낸 후 듣고 싶은 곡은?",
//     choices: ["🌙 부드러운 피아노·재즈", "🔊 에너지 폭발 록·댄스곡"],
//   },
// ];

// const genreOptions = ["Hip-Hop", "Pop", "Rock", "R&B", "Ballad", "Other"];

// export default function RecommendPanel() {
//   const [phase, setPhase] = useState("genre"); // genre → mbti → done
//   const [preferredGenres, setPreferredGenres] = useState([]);
//   const [answers, setAnswers] = useState([]); // length = number of answered MBTI questions
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState("");

//   // 장르 선택 완료
//   const handleGenreSubmit = () => {
//     if (!preferredGenres.length) return;
//     setPhase("mbti");
//   };

//   // MBTI 질문 답변 (i번째 문항에 A/B 선택)
//   const handleMBTIAnswer = (i, choice) => {
//     setAnswers((prev) => {
//       const next = [...prev];
//       if (i < next.length) next[i] = choice;
//       else next.push(choice);
//       return next;
//     });
//   };

//   // 모든 MBTI 질문을 답했을 때, 서버 호출
//   useEffect(() => {
//     if (phase === "mbti" && answers.length === mbtiQuestions.length) {
//       setPhase("done");
//       setLoading(true);

//       axios
//         .post("/api/chat", {
//           mode: "recommend",
//           preferredGenres,
//           mbtiAnswers: answers,
//         })
//         .then(({ data }) => setResult(data.reply))
//         .catch(() => setResult("추천 생성 중 오류가 발생했어요."))
//         .finally(() => setLoading(false));
//     }
//   }, [answers, phase, preferredGenres]);

//   return (
//     <Box borderWidth="1px" borderRadius="md" p={4} h="100%" overflowY="auto">
//       <VStack align="stretch" spacing={6}>
//         {phase === "genre" && (
//           <>
//             <Text fontWeight="bold">1) 먼저, 좋아하는 장르를 선택해주세요.</Text>
//             <CheckboxGroup value={preferredGenres} onChange={setPreferredGenres} colorScheme="blue">
//               <HStack wrap="wrap" spacing={4}>
//                 {genreOptions.map((g) => (
//                   <Checkbox key={g} value={g}>
//                     {g}
//                   </Checkbox>
//                 ))}
//               </HStack>
//             </CheckboxGroup>
//             <Button mt={2} onClick={handleGenreSubmit} isDisabled={!preferredGenres.length}>
//               선택 완료
//             </Button>
//           </>
//         )}

//         {phase === "mbti" &&
//           mbtiQuestions.map((q, i) => {
//             // i번째 문항은, 답변 받았거나 바로 다음 질문까지만 렌더
//             if (i > answers.length) return null;
//             return (
//               <Box key={i}>
//                 <Text fontWeight="bold">
//                   {i + 2}) {q.question}
//                 </Text>
//                 <HStack spacing={4} mt={1}>
//                   <Button
//                     flex={1}
//                     variant={answers[i] === "A" ? "solid" : "outline"}
//                     onClick={() => handleMBTIAnswer(i, "A")}
//                   >
//                     A) {q.choices[0]}
//                   </Button>
//                   <Button
//                     flex={1}
//                     variant={answers[i] === "B" ? "solid" : "outline"}
//                     onClick={() => handleMBTIAnswer(i, "B")}
//                   >
//                     B) {q.choices[1]}
//                   </Button>
//                 </HStack>
//               </Box>
//             );
//           })}

//         {phase === "done" && (
//           <Box textAlign="center" py={8}>
//             {loading ? (
//               <Spinner size="lg" />
//             ) : (
//               <>
//                 <Text fontWeight="bold" mb={4}>
//                   🎉 추천 결과
//                 </Text>
//                 <Text whiteSpace="pre-wrap">{result}</Text>
//               </>
//             )}
//           </Box>
//         )}
//       </VStack>
//     </Box>
//   );
// }
