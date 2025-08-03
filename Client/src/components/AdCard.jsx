import { useState, useEffect } from "react";
const icn = "/focusDocKIcon.jpg";
const display = "/focusDockDisplay.jpg";
const display2 = "/focusDockDisplay2.jpg";
const display3 = "/focusDockDisplay3.jpg";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.rishukumarcodes.Standbyclock";

function AdCard({ slideInterval = 3000 }) {
  const slides = [display, display2, display3];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, slideInterval);
    return () => clearInterval(id);
  }, [slideInterval, slides.length]);

  return (
    <div className="text-white p-4 rounded-2xl shadow-lg space-y-4 w-full max-w-md">
      <h1 className="text-lg font-semibold">More app from us: </h1>

      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center gap-4"
      >
        <img src={icn} alt="Ad Preview" className="h-16 w-16 rounded-xl" />
        <div>
          <h2 className="txt font-bold text-lg">Focus Dock</h2>
          <p className="txt-dim text-sm text-gray-300">
            Increase your productivity 10X with focus dock.
          </p>
        </div>
      </a>

      <div className="flex gap-4">
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-ter p-1.5 rounded-lg hover:btn-hover transition-colors text-center"
        >
          learn more
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn p-1.5 rounded-lg hover:btn-hover transition-colors text-center"
        >
          Try it
        </a>
      </div>

      {/* Carousel area with fade */}
      <div className="relative aspect-[27/35] w-full  overflow-hidden rounded-xl">
        {slides.map((src, idx) => (
          <a
            key={idx}
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 transition-opacity duration-500"
          >
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className={`
                h-auto w-full rounded-xl
                ${idx === current ? "opacity-100" : "opacity-0"}
              `}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default AdCard;
