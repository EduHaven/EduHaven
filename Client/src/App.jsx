import { Routes, Route } from "react-router-dom";
import RouterSelector from "./lib/RouterSelector";
import Layout from "./components/Layout";
import Home from "./pages/Home.jsx";
import Stats from "./pages/Stats"; // Updated import name
import GameRoom from "./routes/GameRoutes.jsx";
import Signout from "./Auth/Signout";
// import SignUp from "./Auth/Authenticate.jsx";
import PageNotFound from "../src/pages/PageNotFound";
import ProjectInfo from "../src/pages/ProjectInfo";
import Session from "./pages/Sessions.jsx";
import StudyRoom from "./pages/SessionRoom";
import OtpInput from "./Auth/Verifyotp.jsx";
import Settings from "./pages/Settings";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import GoogleRedirect from "./Auth/GoogleRedirect";
import Auth from "./Auth/Auth";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { SocketProvider } from "./context/SocketContext";
import FriendsPage from "./pages/FriendsPage.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoteNest from "./pages/NoteNest";
import Delete from "./components/settings/Delete";

function App() {
  return (
    <UserProfileProvider>
      <SocketProvider>
        <RouterSelector>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="session" element={<Session />} />
              <Route path="stats" element={<Stats isCurrentUser={true} />} />
              <Route path="user/:userId" element={<Stats isCurrentUser={false} />} />
              <Route path="games/*" element={<GameRoom />} />
              <Route path="notenest" element={<NoteNest />} />
              <Route path="project-details" element={<ProjectInfo />} />
              <Route path="settings/" element={<Settings />} />
              <Route path="friends" element={<FriendsPage />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="/delete-account" element={<Delete />} />

            </Route>

            <Route path="session/:id" element={<StudyRoom />} />
            <Route path="/signout" element={<Signout />} />
            <Route path="/verify" element={<OtpInput />} />
            <Route path="/authenticate" element={<Auth />} />
            <Route path="/auth/google/callback" element={<GoogleRedirect />} />
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
    </UserProfileProvider>
  );
}

export default App;
