import { Routes, Route } from "react-router-dom";
import RouterSelector from "./lib/RouterSelector";
import Layout from "./components/Layout";
import Home from "./pages/Home.jsx";
import Stats from "./pages/Stats";
import GameRoom from "./routes/GameRoutes.jsx";
import Signout from "./Auth/Signout";
import UserProfile from './pages/UserProfile';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <UserProfileProvider>
      <SocketProvider>
        <RouterSelector>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="session" element={<Session />} />
              <Route path="stats" element={<Stats />} />
              <Route path="games/*" element={<GameRoom />} />
              <Route path="project-details" element={<ProjectInfo />} />
              <Route path="settings/" element={<Settings />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>

            <Route path="session/:id" element={<StudyRoom />} />
            <Route path="/signout" element={<Signout />} />
            <Route path="/verify" element={<OtpInput />} />
            <Route path="/authenticate" element={<Auth />} />
            <Route path="/auth/google/callback" element={<GoogleRedirect />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/:userId" element={<UserProfile/>}/>
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