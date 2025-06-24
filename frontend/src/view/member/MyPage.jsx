import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import { useUser } from "../../context/UserContext";

const MyPage = () => {
  const { state, updateUser } = useUser();

  if (!state) return null; // 아직 유저 로딩 중이면 아무것도 안 보여줌

  const nickname = state.nickname;
  const avatar = state.avatar; // 확장 가능
  const userName = state.userName;
  const userGrade = state.role; // 등급 필드 이름에 따라 수정
  const userPoints = 0; // 아직 없음

  return (
    <Routes>
      <Route
        index
        element={
          <Profile
            nickname={nickname}
            userName={userName}
            userGrade={userGrade}
            userPoints={userPoints}
            avatar={avatar}
          />
        }
      />
      <Route
        path="profile"
        element={
          <Profile
            nickname={nickname}
            userName={userName}
            userGrade={userGrade}
            userPoints={userPoints}
            avatar={avatar}
          />
        }
      />
      <Route
        path="editprofile"
        element={
          <EditProfile
            nickname={nickname}
            avatar={avatar}
            onNicknameChange={(newNick) => updateUser({ nickname: newNick })}
            onAvatarChange={(newAvatar) => updateUser({ avatar: newAvatar })}
          />
        }
      />
    </Routes>
  );
};

export default MyPage;

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Profile from "./Profile";
// import EditProfile from "./EditProfile";
// import { useUser } from "../../context/UserContext";

// const MyPage = () => {
//   const { state, updateUser } = useUser();

//   const nickname = state?.nickname || "";
//   const userName = state?.userName || "이름없음";
//   const userGrade = state?.role || "bronze";
//   const userPoints = state?.point || 0;
//   const avatar = state?.avatar || null;

//   return (
//     <Routes>
//       <Route
//         index
//         element={
//           <Profile
//             nickname={nickname}
//             userName={userName}
//             userGrade={userGrade}
//             userPoints={userPoints}
//             avatar={avatar}
//           />
//         }
//       />
//       <Route
//         path="profile"
//         element={
//           <Profile
//             nickname={nickname}
//             userName={userName}
//             userGrade={userGrade}
//             userPoints={userPoints}
//             avatar={avatar}
//           />
//         }
//       />
//       <Route
//         path="editprofile"
//         element={
//           <EditProfile
//             nickname={nickname}
//             avatar={avatar}
//             onNicknameChange={(nickname) => updateUser({ nickname })}
//             onAvatarChange={(avatar) => updateUser({ avatar })}
//           />
//         }
//       />
//     </Routes>
//   );
// };

// export default MyPage;
//============================================
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Profile from "./Profile";
// import EditProfile from "./EditProfile";
// import { useUser } from "../../context/UserContext";

// const MyPage = () => {
//   const { state, updateUser } = useUser();

//   const nickname = state?.nickname || "";
//   const userName = state?.userName || "이름없음";
//   const userGrade = state?.role || "bronze";
//   const userPoints = state?.point || 0;
//   const avatar = state?.avatar || null;

//   return (
//     <Routes>
//       <Route
//         index
//         element={
//           <Profile
//             nickname={nickname}
//             userName={userName}
//             userGrade={userGrade}
//             userPoints={userPoints}
//             avatar={avatar}
//           />
//         }
//       />
//       <Route
//         path="profile"
//         element={
//           <Profile
//             nickname={nickname}
//             userName={userName}
//             userGrade={userGrade}
//             userPoints={userPoints}
//             avatar={avatar}
//           />
//         }
//       />
//       <Route
//         path="editprofile"
//         element={
//           <EditProfile
//             nickname={nickname}
//             avatar={avatar}
//             onNicknameChange={(nickname) => updateUser({ nickname })}
//             onAvatarChange={(avatar) => updateUser({ avatar })}
//           />
//         }
//       />
//     </Routes>
//   );
// };

// export default MyPage;

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Profile from "./Profile";
// import EditProfile from "./EditProfile";
// import { useUser } from "../../context/UserContext";

// const MyPage = () => {
//   const { user } = useUser();

//   if (!user) return <div>로딩중...</div>;

//   return (
//     <Routes>
//       <Route
//         index
//         element={
//           <Profile
//             nickname={user.nickname}
//             userName={user.userName}
//             userGrade={user.role || "bronze"}
//             userPoints={user.points || 0}
//             avatar={user.avatar}
//           />
//         }
//       />
//       <Route
//         path="profile"
//         element={
//           <Profile
//             nickname={user.nickname}
//             userName={user.userName}
//             userGrade={user.role || "bronze"}
//             userPoints={user.points || 0}
//             avatar={user.avatar}
//           />
//         }
//       />
//       <Route path="editprofile" element={<EditProfile nickname={user.nickname} avatar={user.avatar} />} />
//     </Routes>
//   );
// };

// export default MyPage;
//-------------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import Profile from "./Profile";
// import EditProfile from "./EditProfile";
// import axios from "axios";

// const MyPage = () => {
//   const [nickname, setNickname] = useState("");
//   const [avatar, setAvatar] = useState(null);

//   const userName = "김민성"; // 고정값이 아닌 서버에서 받아오면 좋음
//   const userGrade = "bronze";
//   const userPoints = 0;

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("/api/user", { withCredentials: true });
//         setNickname(res.data.nickname);
//         // setAvatar(res.data.avatar); // 아바타 정보 있으면 반영
//       } catch (err) {
//         console.error("유저 정보 불러오기 실패:", err);
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <Routes>
//       <Route
//         index
//         element={
//           <Profile
//             nickname={nickname}
//             userName={userName}
//             userGrade={userGrade}
//             userPoints={userPoints}
//             avatar={avatar}
//           />
//         }
//       />
//       <Route
//         path="profile"
//         element={
//           <Profile
//             nickname={nickname}
//             userName={userName}
//             userGrade={userGrade}
//             userPoints={userPoints}
//             avatar={avatar}
//           />
//         }
//       />
//       <Route
//         path="editprofile"
//         element={
//           <EditProfile nickname={nickname} avatar={avatar} onNicknameChange={setNickname} onAvatarChange={setAvatar} />
//         }
//       />
//     </Routes>
//   );
// };

// export default MyPage;
