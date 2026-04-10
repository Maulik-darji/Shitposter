import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Shell from "./layouts/Shell";
import ChatPage from "./pages/Chat";
import ExplorePage from "./pages/Explore";
import HomePage from "./pages/Home";
import MessagesPage from "./pages/Messages";
import NotificationsPage from "./pages/Notifications";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import ViralPage from "./pages/Viral";

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
      <Route index element={<HomePage />} />
      <Route path="explore" element={<ExplorePage />} />
      <Route path="viral" element={<ViralPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="chat" element={<ChatPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
