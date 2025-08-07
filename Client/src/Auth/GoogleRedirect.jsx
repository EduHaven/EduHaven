import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GoogleRedirect() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    console.log(params)
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/", { replace: true });
    } else {
      navigate("/authenticate");
    }
  }, [navigate, search]);

  return <div className="text-black font-lg m-8">Logging you in…</div>;
}
