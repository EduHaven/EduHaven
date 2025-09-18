import { useState, useEffect } from "react";

// Focus Dock Product
const focusDockIcon = "/focusDocKIcon.jpg";
const focusDockDisplay = "/focusDockDisplay.jpg";
const focusDockDisplay2 = "/focusDockDisplay2.jpg";
const focusDockDisplay3 = "/focusDockDisplay3.jpg";
const focusDockDisplay4 = "/focusDockDisplay4.png";
const FOCUS_DOCK_URL =
  "https://play.google.com/store/apps/details?id=com.rishukumarcodes.Standbyclock";

// Product data
const products = [
  {
    id: "focus-dock",
    name: "Focus Dock",
    description: "Increase your productivity 10X with focus dock.",
    icon: focusDockIcon,
    url: FOCUS_DOCK_URL,
    slides: [
      focusDockDisplay,
      focusDockDisplay2,
      focusDockDisplay3,
      focusDockDisplay4,
    ],
  },
];

function AdCard({ slideInterval = 30000 }) {
  // Changed to 30 seconds (30000ms)
  const [currentProduct, setCurrentProduct] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentProductData = products[currentProduct];

  useEffect(() => {
    // Switch between products every 30 seconds
    const productInterval = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length);
      setCurrentSlide(0); // Reset slide when switching products
    }, slideInterval);

    return () => clearInterval(productInterval);
  }, [slideInterval]);

  useEffect(() => {
    // Switch between slides for current product (if multiple slides exist)
    if (currentProductData.slides.length > 1) {
      const slideInterval = setInterval(() => {
        setCurrentSlide(
          (prev) => (prev + 1) % currentProductData.slides.length
        );
      }, 3000); // 3 seconds for slide transitions

      return () => clearInterval(slideInterval);
    }
  }, [currentProductData.slides.length]);

  return (
    <div className="group space-y-2.5">
      <a
        href={currentProductData.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row  gap-4"
      >
        <img
          src={currentProductData.icon}
          alt="Ad Preview"
          className="h-16 w-16 rounded-xl"
        />
        <div className="relative w-full">
          <h2 className="txt font-semibold text-lg">
            {currentProductData.name}
          </h2>
          <p className="absolute bottom-0 group-hover:opacity-0 transition-all txt-dim text-sm h-9">
            {currentProductData.description}
          </p>
          <div className="absolute opacity-0 group-hover:opacity-100 transition-all bottom-0 flex gap-4 w-full">
            <a
              href={currentProductData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn p-1 rounded-lg hover:btn-hover transition-colors text-center"
            >
              Try it
            </a>
          </div>
        </div>
      </a>

      {/* Carousel area with fade */}
      <div className="relative aspect-video overflow-hidden w-full">
        {currentProductData.slides.map((src, idx) => (
          <a
            key={idx}
            href={currentProductData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
          >
            <img
              src={src}
              alt={`${currentProductData.name} Slide ${idx + 1}`}
              className={`
                h-full w-full rounded-xl object-cover object-center
                transition-opacity duration-500
                ${idx === currentSlide ? "opacity-100" : "opacity-0"}
              `}
            />
          </a>
        ))}
      </div>

      {/* Product indicator dots */}
      {/* <div className="flex justify-center gap-2 mt-2">
        {products.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentProduct ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
}

export default AdCard;
