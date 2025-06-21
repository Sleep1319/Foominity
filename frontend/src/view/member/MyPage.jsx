import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import EditProfile from "./EditProfile";

const MyPage = () => {
  // 상위 컴포넌트에서 상태 관리
  const [nickname, setNickname] = useState("키무민송");
  const [avatar, setAvatar] = useState(null); // base64 이미지

  // 수정 불가한 값은 고정
  const userName = "김민성";
  const userGrade = "bronze";
  const userPoints = 0;

  return (
    <Routes>
      {/* /mypage 또는 /mypage/profile 로 접근 가능 */}
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
            onNicknameChange={setNickname}
            onAvatarChange={setAvatar}
          />
        }
      />
    </Routes>
  );
};

export default MyPage;
