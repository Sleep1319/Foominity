import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import { useUser } from "../../context/UserContext";

const MyPage = () => {
  const { state, updateUser, isLoading } = useUser();

  if (isLoading || !state) return null;

  return (
    <Routes>
      <Route index element={<Profile />} />
      <Route path="profile" element={<Profile />} />
      <Route
        path="editprofile"
        element={
          <EditProfile
            nickname={state.nickname}
            avatar={state.avatar}
            onNicknameChange={(newNick) => updateUser({ nickname: newNick })}
            onAvatarChange={(newAvatar) => updateUser({ avatar: newAvatar })}
          />
        }
      />
    </Routes>
  );
};

export default MyPage;
