import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Account = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--txt)] mb-6">
        Account Settings
      </h1>
      <div className="flex w-full items-center justify-between hover:bg-sec p-4 rounded-xl cursor-not-allowed">
        <p>Change your Email</p>
        <ChevronRight />
      </div>
      <Link
        to="/auth/forgot-password"
        className="flex w-full items-center justify-between hover:bg-sec p-4 rounded-xl"
      >
        <p>Change your Password</p>
        <ChevronRight />
      </Link>
      <Link
        to="/auth/delete-account"
        className="flex w-full items-center justify-between hover:bg-sec p-4 rounded-xl"
      >
        <p>Request account deletion</p>
        <ChevronRight />
      </Link>
    </div>
  );
};

export default Account;
