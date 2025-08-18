function GoalsAndEvents() {
  return (
    <div className="max-w-3xl xl:max-w-7xl mx-auto mb-28 flex gap-4 xl:gap-24 items-center justify-center">
      <div className="flex-1 max-w-[600px] relative">
        <img
          src="/Page1LightScreenshot.png"
          alt="Goals"
          className="w-full h-auto"
          style={{
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
          }}
        />
      </div>
      <h1 className="flex-1 max-w-[400px] text-balance text-2xl xl:text-3xl font-poppins font-thin leading-[1.5] min-h-[calc(1.5em*4)]">
        Set achievable goals and track important academic events seamlessly.
      </h1>
    </div>
  );
}

export default GoalsAndEvents;
