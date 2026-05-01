const RICKROLL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

function wildcardToRegex(pattern) {
  return pattern
    .replace(/\./g, "\\.")
    .replace(/\*/g, ".*");
}

function createRule(pattern, id) {
  let regexFilter;

  if (pattern.startsWith("regex:")) {
    regexFilter = pattern.replace("regex:", "");
  } else {
    regexFilter = wildcardToRegex(pattern);
  }

  return {
    id: id,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: RICKROLL }
    },
    condition: {
      regexFilter: regexFilter,
      resourceTypes: ["main_frame"]
    }
  };
}