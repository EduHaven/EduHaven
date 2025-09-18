import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouterSelector from "./lib/RouterSelector";
import Layout from "./components/Layout";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { SocketProvider } from "./contexts/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthLayout from "./components/AuthLayout";

// Lazy load all route components
const Home = lazy(() => import("./pages/Home.jsx"));
const Stats = lazy(() => import("./pages/Stats"));
const GameRoom = lazy(() => import("./routes/GameRoutes.jsx"));
const Signout = lazy(() => import("./Auth/Signout"));
const PageNotFound = lazy(() => import("../src/pages/PageNotFound"));
const About = lazy(() => import("./pages/AboutPage"));
const Session = lazy(() => import("./pages/Sessions.jsx"));
const StudyRoom = lazy(() => import("./pages/SessionRoom"));
const OtpInput = lazy(() => import("./Auth/Verifyotp.jsx"));
const Settings = lazy(() => import("./pages/Settings"));
const GoogleRedirect = lazy(() => import("./Auth/GoogleRedirect"));
const ForgotPassword = lazy(() => import("./Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./Auth/ResetPassword"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const FriendsPage = lazy(() => import("./pages/FriendsPage.jsx"));
const Notes = lazy(() => import("./pages/Notes"));
const Delete = lazy(() => import("./Auth/DeleteAccount"));
const Chats = lazy(() => import("./pages/Chats"));
const Login = lazy(() => import("./Auth/Login"));
const SignUp = lazy(() => import("./Auth/SignUp"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const queryClient = new QueryClient();

  return (
    <UserProfileProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <RouterSelector>
            <Suspense fallback={<LoadingSpinner />}>
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
            </Suspense>
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
