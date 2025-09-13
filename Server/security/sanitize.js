import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (input, options = {}) => {
  if (typeof input != "string") {
    return;
  }

  const defaultOptions = {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "u",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "a",
      "img",
    ],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
    nonTextTags: ["script", "style", "iframe"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: {
          href: attribs.href,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  };

  const sanitizeOptions = { ...defaultOptions, ...options };
  return sanitizeHtml(input, sanitizeOptions);
};
