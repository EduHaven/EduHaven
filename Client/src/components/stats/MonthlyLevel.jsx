const MonthlyLevel = () => {
  return (
    <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 flex flex-col items-center w-full">
      <h3 className="text-xl font-bold mb-2">Monthly Level</h3>
      <p className="mb-4">
        Level <span className="font-semibold">7</span>
      </p>
      <div className="w-full">
        <div className="h-3 bg-slate-500 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: "75%" }}></div>
        </div>
        <p className="text-xs  mt-1 text-center">
          75% to next level
        </p>
      </div>
      <div className="mt-4 w-full grid grid-cols-2 gap-2">
        <div className="bg-[var(--bg-ter)] rounded-md p-2 text-center">
          <p className="text-sm ">XP</p>
          <p className="font-semibold">1200</p>
        </div>
        <div className="bg-[var(--bg-ter)] rounded-md p-2 text-center">
          <p className="text-sm ">Needed</p>
          <p className="font-semibold">400</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyLevel;
