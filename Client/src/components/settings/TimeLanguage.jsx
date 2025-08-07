import { Clock, Globe, Check } from "lucide-react";

import { useEffect, useState } from "react";

function TimeLanguage() {
  const [clockFormat, setClockFormat] = useState("12-hour");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const sc = localStorage.getItem("clock-format");
    if (sc) setClockFormat(sc);
    const sl = localStorage.getItem("language");
    if (sl) setLanguage(sl);
  }, []);
  const onClockChange = (e) => {
    setClockFormat(e.target.value);
    localStorage.setItem("clock-format", e.target.value);
  };

  const onLangChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  };
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-[1080px] mx-auto">
      {/* Clock Format */}
      <section className=" p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-[var(--btn)]" />
          <h3 className="text-xl font-semibold txt">Clock Format</h3>
        </div>
        <select
          value={clockFormat}
          onChange={onClockChange}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-sec txt transition-all duration-200 focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent outline-none"
        >
          <option value="12-hour">12-hour (2:30 PM)</option>
          <option value="24-hour">24-hour (14:30)</option>
        </select>
      </section>

      {/* Language */}
      <section className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-[var(--btn)]" />
          <h3 className="text-xl font-semibold txt">Language</h3>
        </div>
        <select
          value={language}
          onChange={onLangChange}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-sec txt transition-all duration-200 focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent outline-none"
        >
          <option value="English">English</option>
          <option value="Spanish">Español</option>
          <option value="French">Français</option>
          <option value="German">Deutsch</option>
          <option value="Japanese">日本語</option>
          <option value="Korean">한국어</option>
        </select>
      </section>
    </div>
  );
}

export default TimeLanguage;
