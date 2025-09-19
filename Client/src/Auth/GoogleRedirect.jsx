import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserProfile } from "@/contexts/UserProfileContext";
export default function GoogleRedirect() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { setToken } = useUserProfile();
  useEffect(() => {
    const params = new URLSearchParams(search);
    // console.log(params);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token && refreshToken) {
      setToken(token);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/", { replace: true });
      toast.success("Login successful! Welcome back.");
    } else {
      navigate("/auth/login");
    }
  }, [navigate, search, setToken]);

  return <div className="text-black font-lg m-8">Logging you in…</div>;
}
