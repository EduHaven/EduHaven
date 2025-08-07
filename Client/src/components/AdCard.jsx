import { useState, useEffect } from "react";

// Focus Dock Product
const focusDockIcon = "/focusDocKIcon.jpg";
const focusDockDisplay = "/focusDockDisplay.jpg";
const focusDockDisplay2 = "/focusDockDisplay2.jpg";
const focusDockDisplay3 = "/focusDockDisplay3.jpg";
const FOCUS_DOCK_URL = "https://play.google.com/store/apps/details?id=com.rishukumarcodes.Standbyclock";

// GSSoC Navigator Product
const gssocNavigatorIcon = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlkIn00HvFnjK7qiCrZZ_JGw0P8-48NKg8rw&s";
const gssocNavigatorDisplay = "/navigator1.png";
const gssocNavigatorDisplay2 = "/navigator2.png";
const GSSOC_NAVIGATOR_URL = "https://girlscirpt2025.vercel.app";

// Product data
const products = [
  {
    id: "focus-dock",
    name: "Focus Dock",
    description: "Increase your productivity 10X with focus dock.",
    icon: focusDockIcon,
    url: FOCUS_DOCK_URL,
    slides: [focusDockDisplay, focusDockDisplay2, focusDockDisplay3]
  },
  {
    id: "gssoc-navigator",
    name: "GSSoC Navigator",
    description: "Navigate your way through GSSoC with our comprehensive gssoc project navigator.",
    icon: gssocNavigatorIcon,
    url: GSSOC_NAVIGATOR_URL,
    slides: [gssocNavigatorDisplay, gssocNavigatorDisplay2]
  }
];

function AdCard({ slideInterval = 30000 }) { // Changed to 30 seconds (30000ms)
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
        setCurrentSlide((prev) => (prev + 1) % currentProductData.slides.length);
      }, 3000); // 3 seconds for slide transitions

      return () => clearInterval(slideInterval);
    }
  }, [currentProductData.slides.length]);

  return (
    <>
      <h1 className="text-lg font-semibold">More products from us: </h1>

      <a
        href={currentProductData.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center gap-4"
      >
        <img src={currentProductData.icon} alt="Ad Preview" className="h-16 w-16 rounded-xl" />
        <div>
          <h2 className="txt font-bold text-lg">{currentProductData.name}</h2>
          <p className="txt-dim text-sm">
            {currentProductData.description}
          </p>
        </div>
      </a>

      <div className="flex gap-4">
        <a
          href={currentProductData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn p-1.5 rounded-lg hover:btn-hover transition-colors text-center"
        >
          Try it
        </a>
      </div>

      {/* Carousel area with fade */}
      <div className="relative aspect-[27/35] w-full">
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
                h-auto w-full rounded-xl
                transition-opacity duration-500
                ${idx === currentSlide ? "opacity-100" : "opacity-0"}
              `}
            />
          </a>
        ))}
      </div>

      {/* Product indicator dots */}
      <div className="flex justify-center gap-2 mt-2">
        {products.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentProduct ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </>
  );
}

export default AdCard;
