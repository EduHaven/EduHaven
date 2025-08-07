import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_API_URL;

const OtpInput = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow only numeric input and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      setIsVerifying(true);
      try {
        const activationToken = localStorage.getItem("activationToken"); // Retrieve the token from localStorage

        const response = await fetch(`${backendUrl}/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activationToken}`, // Pass the token in the headers
          },
          body: JSON.stringify({ otp }),
        });

        if (response.ok) {
          const data = await response.json();
          alert(`OTP Verified: ${data.message}`);

          // Redirect to dashboard or desired page
          alert("Login Now")
          navigate("/authenticate");
        } else {
          const error = await response.json();
          alert(`Verification failed: ${error.message}`);
        }
      } catch (err) {
        alert(`An error occurred: ${err.message}`);
      } finally {
        setIsVerifying(false);
      }
    } else {
      alert("Please enter a 6-digit OTP.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
        <h2 className="text-xl font-semibold mb-4 text-center text-black">Verify OTP</h2>
        <Input
          type="text"
          value={otp}
          onChange={handleChange}
          maxLength="6"
          placeholder="Enter OTP"
          className="mb-4 text-center text-lg text-black font-bold"
        />
        <Button
          onClick={handleVerifyOtp}
          disabled={isVerifying}
          className={`w-full bg-black text-white font-bold py-2 mt-2 hover:bg-gray-800`}
        >
          {isVerifying ? "Please wait..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
};

export default OtpInput;
