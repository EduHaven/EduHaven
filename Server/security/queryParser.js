import qs from "qs";

const sanitizeQuery = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  const cleanedObj = {};
  for (const k in obj) {
    if (["__proto__", "constructor", "prototype"].includes(k)) continue;
    cleanedObj[k] = sanitizeQuery(obj[k]);
  }
  return cleanedObj;
};

export const queryParser = (req, res, next) => {
  try {
    if (req.url.includes("?")) {
      const [path, queryString] = req.url.split("?");

      if (queryString.length > 2048) {
        return res
          .status(400)
          .json({ error: "Query string too long or malformed" });
      }

      let safeQueryString;
      try {
        safeQueryString = decodeURIComponent(queryString);
      } catch {
        return res.status(400).json({ error: "Invalid query encoding" });
      }

      const parsedQuery = qs.parse(safeQueryString, {
        allowPrototypes: false,
        depth: 5,
        parameterLimit: 100,
        ignoreQueryPrefix: true,
      });

      req.query = sanitizeQuery(parsedQuery);
    }

    next();
  } catch (e) {
    console.error("[QueryParser Error]:", e.message);
    res.status(400).json({ error: "Invalid query parameters" });
  }
};
