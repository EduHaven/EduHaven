import { ArrowLeft, CheckCircle, Mail, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";

const backendUrl = import.meta.env.VITE_API_URL;

const OtpInput = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const [verificationType, setVerificationType] = useState("signup");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Determine verification type based on current route or state
    const isPasswordReset =
      location.pathname === "/auth/verify-reset-otp" ||
      location.state?.type === "password-reset";

    setVerificationType(isPasswordReset ? "reset" : "signup");

    if (isPasswordReset) {
      // For password reset flow
      const resetEmail = localStorage.getItem("resetEmail");
      const resetToken = localStorage.getItem("resetToken");

      if (!resetEmail || !resetToken) {
        toast.error("Please start the password reset process again.");
        navigate("/auth/forgot-password");
        return;
      }
      setEmail(resetEmail);
    } else {
      // For signup flow - you might get email from localStorage or props
      const signupEmail = localStorage.getItem("signupEmail"); // You may need to store this during signup
      if (signupEmail) {
        setEmail(signupEmail);
      }
    }
  }, [navigate, location]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    setError("");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedOtp = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        pastedOtp.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        if (pastedOtp.length > 0) {
          inputRefs.current[Math.min(pastedOtp.length - 1, 5)]?.focus();
        }
      });
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a complete 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      if (verificationType === "reset") {
        // Password reset OTP verification
        const resetToken = localStorage.getItem("resetToken");

        const response = await fetch(`${backendUrl}/auth/verify-reset-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resetToken}`,
          },
          body: JSON.stringify({
            otp: otpString,
            email: email,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuccess(true);
          toast.success("OTP verified successfully!");

          // Store the new verified token for password reset
          const { verifiedResetToken } = data;
          localStorage.setItem("resetToken", verifiedResetToken);
          localStorage.setItem("otpVerified", "true");

          setTimeout(() => {
            navigate("/auth/reset-password");
          }, 1500);
        } else {
          const error = await response.json();
          setError(
            error.message ||
              error.error ||
              "Verification failed. Please try again."
          );
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } else {
        // Signup OTP verification (original logic)
        const activationToken = localStorage.getItem("activationToken");

        const response = await fetch(`${backendUrl}/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activationToken}`,
          },
          body: JSON.stringify({ otp: otpString }),
        });

        if (response.ok) {
          setSuccess(true);
          setTimeout(() => {
            navigate("/auth/login");
          }, 1500);
        } else {
          const error = await response.json();
          setError(error.message || "Verification failed. Please try again.");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoBack = () => {
    if (verificationType === "reset") {
      navigate("/auth/forgot-password");
    } else {
      navigate(-1);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (verificationType === "reset") {
        const response = await fetch(`${backendUrl}/auth/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Email: email }),
        });

        if (response.ok) {
          const data = await response.json();
          const { resetToken } = data;
          if (resetToken) {
            localStorage.setItem("resetToken", resetToken);
            toast.success("OTP sent to your email again!");
          }
        } else {
          toast.error("Failed to resend OTP. Please try again.");
        }
      } else {
        // Handle signup OTP resend if you have that endpoint
        toast.info("Please restart the signup process for a new OTP.");
      }
    } catch {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const getTitle = () => {
    return verificationType === "reset"
      ? "Verify Reset OTP"
      : "Verify Your Email";
  };

  const getDescription = () => {
    return verificationType === "reset"
      ? `We have sent a 6-digit verification code to ${email}. Please enter it below to continue with password reset.`
      : "We have sent a 6-digit verification code to your email address. Please enter it below to continue.";
  };

  const getSuccessMessage = () => {
    return verificationType === "reset"
      ? "OTP verified successfully! Redirecting to reset password..."
      : "Verification Successful! Redirecting you to login...";
  };
  if (success) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full text-center transition-colors">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {verificationType === "reset"
            ? "OTP Verified Successfully!"
            : "Verification Successful!"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {getSuccessMessage()}
        </p>
        <div className="mt-6 w-full bg-green-100 dark:bg-green-900 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 rounded-full animate-pulse"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl max-w-md w-full transition-colors">
      {/* Back Button */}
      <div className="flex items-center justify-center mb-6 relative">
        <Button
          onClick={handleGoBack}
          variant="transparent"
          className="absolute left-0 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </Button>

        <div className="w-16 h-16 bg-gray-800 dark:bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
          <Mail className="w-8 h-8 text-white dark:text-gray-900" />
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {getTitle()}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {getDescription()}
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="mb-6">
        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl transition-all duration-200
                  ${
                    digit
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                      : error
                        ? "border-red-300 bg-red-50 dark:bg-red-900"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-300 focus:border-blue-500"
                  } focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800`}
              disabled={isVerifying}
            />
          ))}
        </div>
        {error && (
          <div className="text-red-500 dark:text-red-300 text-sm text-center bg-red-50 dark:bg-red-900 p-3 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerifyOtp}
        disabled={isVerifying || otp.join("").length !== 6}
        variant="default" // Use the default variant or create a custom variant
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isVerifying ? (
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Verifying...
          </div>
        ) : (
          "Verify OTP"
        )}
      </Button>

      {/* Resend OTP */}

      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Did not receive the code?{" "}
          <Button
            onClick={handleResendOtp}
            variant="link" // Use 'link' variant for text-like button
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Resend OTP
          </Button>
        </p>
      </div>
      {/* Tip */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-blue-700 dark:text-blue-200 text-xs text-center">
          💡 <strong>Tip:</strong> You can paste the entire OTP at once using
          Ctrl+V
        </p>
      </div>
    </div>
  );
};

export default OtpInput;
