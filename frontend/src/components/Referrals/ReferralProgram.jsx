import { useState } from "react";
import "./ReferralProgram.css";

const ReferralProgram = () => {
  const [referralCode] = useState("FRIEND50");
  const [referrals] = useState([
    { name: "John Doe", email: "john@example.com", status: "Completed", date: "2025-08-10" },
    { name: "Jane Smith", email: "jane@example.com", status: "Pending", date: "2025-08-15" },
    { name: "Shubham", email: "Shubham@example.com", status: "Completed", date: "2025-08-10" },
    { name: "Smith", email: "Smithane@example.com", status: "Pending", date: "2025-08-15" },
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied!");
  };

  return (
    <div className="referral-container">
      {/* Hero Section */}
      <div className="referral-hero">
        <h1 className="hero-title">
          Refer Friends & <span className="gradient-text">Earn Rewards</span>
        </h1>
        <p className="hero-description">
          Share your referral code and earn credits when your friends join and place their first order 🚀
        </p>
      </div>

      {/* Referral Code Card */}
      <div className="referral-card">
        <h2>Your Referral Code</h2>
        <div className="referral-code-box">
          <span className="referral-code">{referralCode}</span>
          <button className="copy-btn" onClick={copyToClipboard}>Copy</button>
        </div>

        {/* Share Buttons */}
        <div className="share-buttons">
          <button
            className="share-btn twitter"
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?text=Join%20me%20and%20earn%20rewards!%20Use%20my%20referral%20code:%20${referralCode}`,
                "_blank"
              )
            }
          >
            Share on Twitter
          </button>

          <button
            className="share-btn whatsapp"
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?text=Join%20me%20and%20earn%20rewards!%20Use%20my%20referral%20code:%20${referralCode}`,
                "_blank"
              )
            }
          >
            Share on WhatsApp
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="referral-stats">
        <div className="stat-box">
          <h3>5</h3>
          <p>Referrals Completed</p>
        </div>
        <div className="stat-box">
          <h3>2</h3>
          <p>Referrals Pending</p>
        </div>
        <div className="stat-box">
          <h3>₹500</h3>
          <p>Rewards Earned</p>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="referral-history">
        <h2>Referral History</h2>
        <table>
          <thead>
            <tr>
              <th>Friend</th>
              <th>Email</th>
              <th>Date Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((r, index) => (
              <tr key={index}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.date}</td>
                <td className={r.status.toLowerCase()}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How it Works</h2>
        <ol>
          <li>Share your unique referral code with friends.</li>
          <li>They sign up using your code.</li>
          <li>Once they place their first order, you earn rewards.</li>
          <li>Track progress right here in your dashboard.</li>
        </ol>
      </div>
    </div>
  );
};

export default ReferralProgram;
