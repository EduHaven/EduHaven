import { Routes, Route } from "react-router-dom";
import RouterSelector from "./lib/RouterSelector";
import Layout from "./components/Layout";
import Home from "./pages/Home.jsx";
import Stats from "./pages/Stats"; // Updated import name
import GameRoom from "./routes/GameRoutes.jsx";
import Signout from "./Auth/Signout";
import PageNotFound from "../src/pages/PageNotFound";
import About from "./pages/AboutPage";
import Session from "./pages/Sessions.jsx";
import StudyRoom from "./pages/SessionRoom";
import OtpInput from "./Auth/Verifyotp.jsx";
import Settings from "./pages/Settings";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import GoogleRedirect from "./Auth/GoogleRedirect";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { SocketProvider } from "./contexts/SocketContext";
import FriendsPage from "./pages/FriendsPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notes from "./pages/Notes";
import Delete from "./Auth/DeleteAccount";
import Chats from "./pages/Chats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthLayout from "./components/AuthLayout";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

function App() {
  const queryClient = new QueryClient();

  return (
    <UserProfileProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <RouterSelector>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="session" element={<Session />} />
                <Route path="stats" element={<Stats isCurrentUser={true} />} />
                <Route
                  path="user/:userId"
                  element={<Stats isCurrentUser={false} />}
                />
                <Route path="games/*" element={<GameRoom />} />
                <Route path="notes" element={<Notes />} />
                <Route path="about" element={<About />} />
                <Route path="settings/" element={<Settings />} />
                <Route path="friends" element={<FriendsPage />} />
                <Route path="chat" element={<Chats />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>

              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="verify" element={<OtpInput />} />
                <Route path="delete-account" element={<Delete />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="verify-reset-otp" element={<OtpInput />} />
                <Route path="reset-password" element={<ResetPassword />} />
              </Route>

              <Route
                path="/auth/google/callback"
                element={<GoogleRedirect />}
              />

              <Route path="/signout" element={<Signout />} />
              <Route path="session/:id" element={<StudyRoom />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </RouterSelector>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </SocketProvider>
      </QueryClientProvider>
    </UserProfileProvider>
  );
}

export default App;
