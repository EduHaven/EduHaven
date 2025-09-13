function NotLogedInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[84vh] h-[100%]">
      <div className=" md:w-[450px] w-[300px] flex flex-col items-center">
        <h1 className="mb-4 text-4xl text-[var(--txt)] text-center">
          You are not logged-in.
        </h1>
        <p className="mb-4 text-md text-[var(--txt-dim)] -mt-2 text-center opacity-80">
          To access your profile, make friends, join session rooms, view your
          stats and more, please log in to your account.
        </p>
        <button
          onClick={() => (window.location.href = "/auth/login")}
          className="px-5 py-2.5 btn text-white rounded-lg hover:btn-hover mt-6 transition-colors"
        >
          Login to Eduhaven
        </button>
      </div>
    </div>
  );
}

export default NotLogedInPage;
