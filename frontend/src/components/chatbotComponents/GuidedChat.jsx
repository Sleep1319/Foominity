import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Avatar,
  Text,
  Spinner,
  Button,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
import axios from "axios";

const menuItems = [
  { label: "1. 플레이리스트 추천", key: "recommend" },
  { label: "2. 곡 진단", key: "diagnosis" },
  { label: "3. 가사 번역", key: "translate" },
];

const mbtiQuestions = [
  {
    question: "주말에 나는…",
    choices: ["📖 책 읽으며 차분히 쉬기", "🕺 클럽·파티에 놀러 가기"],
  },
  {
    question: "음악을 들을 때 주로 듣는 분위기는?",
    choices: ["😌 잔잔하고 부드러운 멜로디", "⚡️ 강한 비트와 드롭"],
  },
  {
    question: "새로운 음악을 발견하는 방법은?",
    choices: ["🎧 좋아하는 장르 위주", "🌍 추천 리스트·월드뮤직"],
  },
  {
    question: "노래에서 가장 중요한 요소는?",
    choices: ["🎤 가사와 보컬 감정 전달", "🥁 리듬·비트"],
  },
  {
    question: "플레이리스트에 가장 많이 담는 트랙은?",
    choices: ["🎸 어쿠스틱·발라드곡", "🚀 EDM·힙합·록"],
  },
  {
    question: "긴 하루를 보낸 후 듣고 싶은 곡은?",
    choices: ["🌙 부드러운 피아노·재즈", "🔊 에너지 폭발 록·댄스곡"],
  },
];

const genreOptions = ["Hip-Hop", "Pop", "Rock", "R&B", "Ballad", "Other"];

export default function GuidedChat({ onModeChange }) {
  const [messages, setMessages] = useState([
    { sender: "BOT", content: "안녕하세요! 원하는 기능을 선택해주세요:" },
  ]);
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(0);
  const [preferredGenres, setPreferredGenres] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  const push = (msg) => setMessages((m) => [...m, msg]);

  // 장르 선택 완료 핸들러
  const handleGenreSubmit = (genres) => {
    push({ sender: "USER", content: genres.join(", ") });
    setStep(2);
    // 첫 번째 MBTI 질문 출력
    const firstQ = mbtiQuestions[0];
    push({
      sender: "BOT",
      content: `1. ${firstQ.question}\nA) ${firstQ.choices[0]}\nB) ${firstQ.choices[1]}`,
    });
  };

  // 메뉴 선택 핸들러
  const handleMenuClick = (item) => {
    push({ sender: "USER", content: item.label });
    setMode(item.key);
    setAnswers([]);
    setPreferredGenres([]);
    setStep(1);

    if (item.key === "recommend") {
      push({
        sender: "BOT",
        content: "먼저, 좋아하는 장르를 선택해주세요. (여러 개 선택 가능)",
      });
    } else {
      const nextQuestions = {
        diagnosis: "진단할 노래 제목과 아티스트를 알려주세요.",
        translate: "번역할 가사를 입력해주세요.",
      };
      push({ sender: "BOT", content: nextQuestions[item.key] });
    }

    onModeChange?.(item.key);
  };

  // MBTI 문항 응답 핸들러
  const handleAnswer = (choice) => {
    const newAns = [...answers, choice];
    setAnswers(newAns);
    push({ sender: "USER", content: choice });
    const idx = newAns.length;
    if (idx < mbtiQuestions.length) {
      const q = mbtiQuestions[idx];
      push({
        sender: "BOT",
        content: `${idx + 1}. ${q.question}\nA) ${q.choices[0]}\nB) ${
          q.choices[1]
        }`,
      });
    } else {
      setStep(mbtiQuestions.length + 2);
      callRecommendation(newAns);
    }
  };

  // 추천 요청 (10곡 플레이리스트 생성)
  const callRecommendation = async (ans) => {
    setLoading(true);
    try {
      const payload = {
        mode: "recommend",
        preferredGenres: preferredGenres,
        mbtiAnswers: ans,
      };
      const { data } = await axios.post("/api/chat", payload);
      push({ sender: "BOT", content: data.reply });
    } catch {
      push({ sender: "BOT", content: "추천 생성 중 오류가 발생했어요." });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    // recommend 모드 중 입력 단계를 제외하고는 일반 채팅 처리
    if (mode === "recommend" && step === 1) return;
    if (mode === "recommend" && step > 1 && step <= mbtiQuestions.length + 1) {
      const choice = input.trim().toUpperCase();
      if (!["A", "B"].includes(choice)) {
        push({ sender: "BOT", content: "A 또는 B 중 하나를 입력해주세요." });
        setInput("");
        return;
      }
      handleAnswer(choice);
      setInput("");
      return;
    }
    if (!input.trim()) return;

    push({ sender: "USER", content: input });
    setLoading(true);
    axios
      .post("/api/chat", { message: input, mode })
      .then(({ data }) => push({ sender: "BOT", content: data.reply }))
      .catch(() =>
        push({ sender: "BOT", content: "죄송합니다. 오류가 발생했어요." })
      )
      .finally(() => {
        setLoading(false);
        setStep(2);
        setInput("");
      });
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      h="600px"
      display="flex"
      flexDirection="column"
    >
      <VStack spacing={3} flexGrow={1} overflowY="auto" mb={4} align="stretch">
        {messages.map((m, i) => (
          <HStack
            key={i}
            justify={m.sender === "USER" ? "flex-end" : "flex-start"}
          >
            {m.sender === "BOT" && <Avatar size="sm" name="HarmoniAI" />}
            <Box
              bg={m.sender === "USER" ? "blue.100" : "gray.100"}
              p={3}
              borderRadius="md"
              maxW="70%"
            >
              <Text whiteSpace="pre-wrap">{m.content}</Text>
            </Box>
            {m.sender === "USER" && <Avatar size="sm" name="You" />}
          </HStack>
        ))}
        {loading && <Spinner alignSelf="center" />}
        <div ref={endRef} />
      </VStack>

      {/* 0단계: 메뉴 버튼만 렌더링 */}
      {step === 0 && (
        <HStack spacing={4}>
          {menuItems.map((item) => (
            <Button
              key={item.key}
              onClick={() => handleMenuClick(item)}
              flex={1}
            >
              {item.label}
            </Button>
          ))}
        </HStack>
      )}

      {/* 1단계: 장르 선택 (recommend 모드) */}
      {mode === "recommend" && step === 1 && (
        <VStack align="stretch">
          <CheckboxGroup
            value={preferredGenres}
            onChange={setPreferredGenres}
            colorScheme="blue"
          >
            <HStack wrap="wrap">
              {genreOptions.map((g) => (
                <Checkbox key={g} value={g}>
                  {g}
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
          <Button
            onClick={() => handleGenreSubmit(preferredGenres)}
            isDisabled={!preferredGenres.length}
          >
            선택 완료
          </Button>
        </VStack>
      )}

      {/* 2단계 이후: 입력창 */}
      {!(mode === "recommend" && step === 1) && step > 0 && (
        <HStack>
          <Input
            placeholder="여기에 답변을 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            isDisabled={loading}
          />
          <IconButton
            icon={<ArrowRightIcon />}
            aria-label="Send"
            onClick={handleSend}
            isLoading={loading}
          />
        </HStack>
      )}
    </Box>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   VStack,
//   HStack,
//   Input,
//   IconButton,
//   Avatar,
//   Text,
//   Spinner,
//   Button,
//   Checkbox,
//   CheckboxGroup,
// } from "@chakra-ui/react";
// import { ArrowRightIcon } from "@chakra-ui/icons";
// import axios from "axios";

// const menuItems = [
//   { label: "1. 플레이리스트 추천", key: "recommend" },
//   { label: "2. 곡 진단", key: "diagnosis" },
//   { label: "3. 가사 번역", key: "translate" },
// ];

// const mbtiQuestions = [
//   { question: "주말에 나는…", choices: ["📖 책 읽으며 차분히 쉬기", "🕺 클럽·파티에 놀러 가기"] },
//   { question: "음악을 들을 때 주로 듣는 분위기는?", choices: ["😌 잔잔하고 부드러운 멜로디", "⚡️ 강한 비트와 드롭"] },
//   { question: "새로운 음악을 발견하는 방법은?", choices: ["🎧 좋아하는 장르 위주", "🌍 추천 리스트·월드뮤직"] },
//   { question: "노래에서 가장 중요한 요소는?", choices: ["🎤 가사와 보컬 감정 전달", "🥁 리듬·비트"] },
//   { question: "플레이리스트에 가장 많이 담는 트랙은?", choices: ["🎸 어쿠스틱·발라드곡", "🚀 EDM·힙합·록"] },
//   { question: "긴 하루를 보낸 후 듣고 싶은 곡은?", choices: ["🌙 부드러운 피아노·재즈", "🔊 에너지 폭발 록·댄스곡"] },
// ];

// const genreOptions = ["Hip-Hop", "Pop", "Rock", "R&B", "Ballad", "Other"];

// export default function GuidedChat({ onModeChange }) {
//   const [messages, setMessages] = useState([{ sender: "BOT", content: "안녕하세요! 원하는 기능을 선택해주세요:" }]);
//   const [mode, setMode] = useState(null);
//   const [step, setStep] = useState(0);
//   const [preferredGenres, setPreferredGenres] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const endRef = useRef();

//   const push = (msg) => setMessages((m) => [...m, msg]);

//   // 장르 선택 완료 핸들러
//   const handleGenreSubmit = (genres) => {
//     push({ sender: "USER", content: genres.join(", ") });
//     setStep(2);
//     // 첫 번째 MBTI 질문 출력
//     const firstQ = mbtiQuestions[0];
//     push({
//       sender: "BOT",
//       content: `1. ${firstQ.question}\nA) ${firstQ.choices[0]}\nB) ${firstQ.choices[1]}`,
//     });
//   };

//   // 메뉴 선택 핸들러
//   const handleMenuClick = (item) => {
//     push({ sender: "USER", content: item.label });
//     setMode(item.key);
//     setAnswers([]);
//     setPreferredGenres([]);
//     if (item.key === "recommend") {
//       setStep(1);
//       push({ sender: "BOT", content: "먼저, 좋아하는 장르를 선택해주세요. (여러 개 선택 가능)" });
//     } else {
//       setStep(1);
//       const nextQuestions = {
//         recommend: "어떤 장르의 음악을 좋아하시나요?",
//         diagnosis: "진단할 노래 제목과 아티스트를 알려주세요.",
//         translate: "번역할 가사를 입력해주세요.",
//       };
//       push({ sender: "BOT", content: nextQuestions[item.key] });
//     }
//     onModeChange?.(item.key);
//   };

//   // MBTI 문항 응답 핸들러
//   const handleAnswer = (choice) => {
//     const newAns = [...answers, choice];
//     setAnswers(newAns);
//     push({ sender: "USER", content: choice });
//     const idx = newAns.length;
//     if (idx < mbtiQuestions.length) {
//       const q = mbtiQuestions[idx];
//       push({
//         sender: "BOT",
//         content: `${idx + 1}. ${q.question}\nA) ${q.choices[0]}\nB) ${q.choices[1]}`,
//       });
//     } else {
//       setStep(mbtiQuestions.length + 2);
//       callRecommendation(newAns);
//     }
//   };

//   // 추천 요청 (10곡 플레이리스트 생성)
//   const callRecommendation = async (ans) => {
//     setLoading(true);
//     try {
//       const payload = {
//         mode: "recommend", // playlist 추천 모드로 변경
//         preferred_genres: preferredGenres,
//         mbti_answers: ans,
//       };
//       const { data } = await axios.post("/api/chat", payload);
//       push({ sender: "BOT", content: data.reply });
//     } catch {
//       push({ sender: "BOT", content: "추천 생성 중 오류가 발생했어요." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = () => {
//     if (mode === "recommend" && step === 1) {
//       return; // 장르 선택 단계는 handleGenreSubmit에서 처리
//     }
//     if (mode === "recommend" && step > 1 && step <= mbtiQuestions.length + 1) {
//       const choice = input.trim().toUpperCase();
//       if (!["A", "B"].includes(choice)) {
//         push({ sender: "BOT", content: "A 또는 B 중 하나를 입력해주세요." });
//         setInput("");
//         return;
//       }
//       handleAnswer(choice);
//       setInput("");
//       return;
//     }
//     if (!input.trim()) return;
//     push({ sender: "USER", content: input });
//     setLoading(true);
//     axios
//       .post("/api/chat", { message: input, mode })
//       .then(({ data }) => push({ sender: "BOT", content: data.reply }))
//       .catch(() => push({ sender: "BOT", content: "죄송합니다. 오류가 발생했어요." }))
//       .finally(() => {
//         setLoading(false);
//         setStep(2);
//         setInput("");
//       });
//   };

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   return (
//     <Box borderWidth="1px" borderRadius="md" p={4} h="600px" display="flex" flexDirection="column">
//       <VStack spacing={3} flexGrow={1} overflowY="auto" mb={4} align="stretch">
//         {messages.map((m, i) => (
//           <HStack key={i} justify={m.sender === "USER" ? "flex-end" : "flex-start"}>
//             {m.sender === "BOT" && <Avatar size="sm" name="HarmoniAI" />}
//             <Box bg={m.sender === "USER" ? "blue.100" : "gray.100"} p={3} borderRadius="md" maxW="70%">
//               <Text whiteSpace="pre-wrap">{m.content}</Text>
//             </Box>
//             {m.sender === "USER" && <Avatar size="sm" name="You" />}
//           </HStack>
//         ))}
//         {loading && <Spinner alignSelf="center" />}
//         <div ref={endRef} />
//       </VStack>

//       {step === 0 && (
//         <HStack spacing={4}>
//           {menuItems.map((item) => (
//             <Button key={item.key} onClick={() => handleMenuClick(item)} flex={1}>
//               {item.label}
//             </Button>
//           ))}
//         </HStack>
//       )}

//       {mode === "recommend" && step === 1 && (
//         <VStack align="stretch">
//           <CheckboxGroup value={preferredGenres} onChange={setPreferredGenres} colorScheme="blue">
//             <HStack wrap="wrap">
//               {genreOptions.map((g) => (
//                 <Checkbox key={g} value={g}>
//                   {g}
//                 </Checkbox>
//               ))}
//             </HStack>
//           </CheckboxGroup>
//           <Button onClick={() => handleGenreSubmit(preferredGenres)} isDisabled={preferredGenres.length === 0}>
//             선택 완료
//           </Button>
//         </VStack>
//       )}

//       {!(mode === "recommend" && step === 1) && step > 0 && (
//         <HStack>
//           <Input
//             placeholder="여기에 답변을 입력하세요"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             isDisabled={loading}
//           />
//           <IconButton icon={<ArrowRightIcon />} aria-label="Send" onClick={handleSend} isLoading={loading} />
//         </HStack>
//       )}
//     </Box>
//   );
// }

//--------------------------------------------------------------------------------
// import React, { useState, useEffect, useRef } from "react";
// import { Box, VStack, HStack, Input, IconButton, Avatar, Text, Spinner, Button } from "@chakra-ui/react";
// import { ArrowRightIcon } from "@chakra-ui/icons";
// import axios from "axios";

// const menuItems = [
//   { label: "1. 앨범 추천", key: "recommend" },
//   { label: "2. 곡 진단", key: "diagnosis" },
//   { label: "3. 가사 번역", key: "translate" },
// ];

// const nextQuestions = {
//   recommend: "어떤 장르의 음악을 좋아하시나요?",
//   diagnosis: "진단할 노래 제목과 아티스트를 알려주세요.",
//   translate: "번역할 가사를 입력해주세요.",
// };

// export default function GuidedChat({ onModeChange }) {
//   const [messages, setMessages] = useState([{ sender: "BOT", content: "안녕하세요! 원하는 기능을 선택해주세요:" }]);
//   const [mode, setMode] = useState(null);
//   const [step, setStep] = useState(0);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const endRef = useRef();

//   const push = (msg) => setMessages((m) => [...m, msg]);

//   // 1) 메뉴 클릭 처리
//   const handleMenuClick = (item) => {
//     push({ sender: "USER", content: item.label });
//     setMode(item.key);
//     setStep(1);
//     push({ sender: "BOT", content: nextQuestions[item.key] });
//     // 2) 부모에게 모드 전달
//     onModeChange?.(item.key);
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;
//     push({ sender: "USER", content: input });
//     setLoading(true);
//     try {
//       const { data } = await axios.post("/api/chat", {
//         message: input,
//         mode,
//       });
//       push({ sender: "BOT", content: data.reply });
//     } catch {
//       push({ sender: "BOT", content: "죄송합니다. 오류가 발생했어요." });
//     } finally {
//       setLoading(false);
//       setStep(2);
//       setInput("");
//     }
//   };

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   return (
//     <Box borderWidth="1px" borderRadius="md" p={4} h="600px" display="flex" flexDirection="column">
//       <VStack spacing={3} flexGrow={1} overflowY="auto" mb={4} align="stretch">
//         {messages.map((m, i) => (
//           <HStack key={i} justify={m.sender === "USER" ? "flex-end" : "flex-start"}>
//             {m.sender === "BOT" && <Avatar size="sm" name="HarmoniAI" />}
//             <Box bg={m.sender === "USER" ? "blue.100" : "gray.100"} p={3} borderRadius="md" maxW="70%">
//               <Text whiteSpace="pre-wrap">{m.content}</Text>
//             </Box>
//             {m.sender === "USER" && <Avatar size="sm" name="You" />}
//           </HStack>
//         ))}
//         {loading && <Spinner alignSelf="center" />}
//         <div ref={endRef} />
//       </VStack>

//       {/* 0단계: 메뉴 버튼만 렌더링 */}
//       {step === 0 && (
//         <HStack spacing={4}>
//           {menuItems.map((item) => (
//             <Button key={item.key} onClick={() => handleMenuClick(item)} flex={1}>
//               {item.label}
//             </Button>
//           ))}
//         </HStack>
//       )}

//       {/* 1단계 이후: 입력창 */}
//       {step > 0 && (
//         <HStack>
//           <Input
//             placeholder="여기에 답변을 입력하세요"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             isDisabled={loading}
//           />
//           <IconButton icon={<ArrowRightIcon />} aria-label="Send" onClick={handleSend} isLoading={loading} />
//         </HStack>
//       )}
//     </Box>
//   );
// }
