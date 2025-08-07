import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { RotateCcw } from "lucide-react";

function Slogan() {
  const [quote, setQuote] = useState("Stay hungry; stay foolish.");
  const [author, setAuthor] = useState("");
  const [displayMode, setDisplayMode] = useState("greeting");
  const [firstName, setFirstName] = useState("User");

  const getFirstNameFromJWT = () => {
    const token = localStorage.getItem("token");
    if (!token) return "User";

    const decoded = jwtDecode(token);
    return decoded?.FirstName || "User";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${firstName}.`;
    else if (hour < 18) return `Good afternoon, ${firstName}.`;
    else return `Good evening, ${firstName}.`;
  };

  const fetchQuote = async () => {
    try {
      const apis = [
        "https://api.quotable.io/random",
        "https://zenquotes.io/api/random",
        "https://api.adviceslip.com/advice",
      ];

      function isMotivationalQuote(quoteText) {
        const lower = quoteText.toLowerCase();
        return (
          quoteText.length <= 50 && (
            lower.includes("success") ||
            lower.includes("work") ||
            lower.includes("dream") ||
            lower.includes("believe") ||
            lower.includes("future") ||
            lower.includes("goal") ||
            lower.includes("effort") ||
            lower.includes("discipline") ||
            lower.includes("motivation") ||
            lower.includes("push") ||
            lower.includes("challenge")
          )
        );
      }


      for (const apiUrl of apis) {
        try {
          const response = await fetch(apiUrl);
          let quote = "" , author = "Anonymous";
          if (response.ok) {
            const data = await response.json();

            if (apiUrl.includes("quotable")) {
              quote = data.content;
              author = data.author;
            } else if (apiUrl.includes("zenquotes")) {
              quote = data[0].q;
              author = data[0].a;
            } else if (apiUrl.includes("adviceslip")) {
              quote = data.slip.advice;
              author =  "Anonymous" ;
            }
          }

          if (isMotivationalQuote(quote)) {
            return { quote, author };
          }
        } catch (apiError) {
          console.error(`Error with ${apiUrl}:`, apiError);
          continue;
        }
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }

    const fallbackQuotes = 
      [
        {
          "quote": "Success doesn't come to you. You go to it.",
          "author": "Marva Collins"
        },
        {
          "quote": "The only limit is the one you set yourself.",
          "author": "Unknown"
        },
        {
          "quote": "Push through the pain. Growth is on the other side.",
          "author": "Unknown"
        },
        {
          "quote": "Stay focused and never give up on your dreams.",
          "author": "Unknown"
        },
        {
          "quote": "Discipline is doing it even when you don’t feel like it.",
          "author": "Unknown"
        },
        {
          "quote": "Work hard in silence, let success make the noise.",
          "author": "Frank Ocean"
        },
        {
          "quote": "Small steps every day lead to big results.",
          "author": "Unknown"
        },
        {
          "quote": "Your future is created by what you do today.",
          "author": "Unknown"
        },
        {
          "quote": "The struggle you’re in today builds strength for tomorrow.",
          "author": "Unknown"
        },
        {
          "quote": "If it matters to you, you’ll find a way.",
          "author": "Unknown"
        },
        {
          "quote": "The harder you work, the luckier you get.",
          "author": "Gary Player"
        },
        {
          "quote": "Great things never come from comfort zones.",
          "author": "Unknown"
        },
        {
          "quote": "Success is earned, not given.",
          "author": "Unknown"
        },
        {
          "quote": "Don’t watch the clock; do what it does — keep going.",
          "author": "Sam Levenson"
        },
        {
          "quote": "Believe in your hustle.",
          "author": "Unknown"
        },
        {
          "quote": "Dream it. Wish it. Do it.",
          "author": "Unknown"
        },
        {
          "quote": "Don’t limit your challenges, challenge your limits.",
          "author": "Jerry Dunn"
        },
        {
          "quote": "You are stronger than your excuses.",
          "author": "Unknown"
        },
        {
          "quote": "Focus on the goal, not the obstacle.",
          "author": "Unknown"
        },
        {
          "quote": "It always seems impossible until it's done.",
          "author": "Nelson Mandela"
        }
      ];

    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  };

  const shouldRefreshQuote = () => {
    const cachedDate = localStorage.getItem("quoteTimestamp");
    if (!cachedDate) return true;

    const ninetyMinAgo = Date.now() - 180 * 60 * 1000;
    return parseInt(cachedDate) < ninetyMinAgo;
  };

  const forceRefreshQuote = async () => {
    setQuote("Fetching new quote...");
    setAuthor("");
    try {
      const fetchedData = await fetchQuote();
      setQuote(fetchedData.quote);
      setAuthor(fetchedData.author);
      localStorage.setItem("dailyQuote", fetchedData.quote);
      localStorage.setItem("quoteAuthor", fetchedData.author);
      localStorage.setItem("quoteTimestamp", Date.now().toString());
      console.log("Quote refreshed:", fetchedData);
    } catch (error) {
      setQuote("Failed to fetch quote.");
      setAuthor("Try again");
      console.error("Error during refresh:", error);
    }
  };

  const handleIconClick = () => {
    forceRefreshQuote();
  };

  useEffect(() => {
    setFirstName(getFirstNameFromJWT());

    const cachedQuote = localStorage.getItem("dailyQuote");
    const cachedAuthor = localStorage.getItem("quoteAuthor");

    if (cachedQuote && !shouldRefreshQuote()) {
      setQuote(cachedQuote);
      setAuthor(cachedAuthor || "");
      console.log("Using cached quote:", cachedQuote);
    } else {
      console.log("Fetching new quote...");
      fetchQuote().then((fetchedData) => {
        setQuote(fetchedData.quote);
        setAuthor(fetchedData.author);
        localStorage.setItem("dailyQuote", fetchedData.quote);
        localStorage.setItem("quoteAuthor", fetchedData.author);
        localStorage.setItem("quoteTimestamp", Date.now().toString());
        console.log("New quote fetched:", fetchedData);
      });
    }
  }, []);

  useEffect(() => {
    const duration = displayMode === "greeting" ? 5000 : 12 * 60 * 1000;
    const timer = setTimeout(() => {
      setDisplayMode((prev) => (prev === "greeting" ? "quote" : "greeting"));
    }, duration);

    return () => clearTimeout(timer);
  }, [displayMode]);

  const textVariants = {
    initial: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="slogan text-2xl font-semibold txt min-h-[3rem] flex items-center justify-center relative group">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayMode + (displayMode === "quote" ? quote : getGreeting())}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-center max-w-4xl px-4"
        >
          {displayMode === "quote" ? (
            <div className="flex items-end gap-4">
              <div>{quote}</div>
              <motion.div
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="txt-dim opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={handleIconClick}
                title="Refresh Quote"
              >
                <RotateCcw size={20} />
              </motion.div>
            </div>
          ) : (
            getGreeting()
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Slogan;
