const isNonEmptyValue = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
};

export const mergeStaticAndApiContent = (staticItem = {}, apiItem = {}) => {
  const merged = { ...staticItem };

  Object.entries(apiItem || {}).forEach(([key, value]) => {
    if (isNonEmptyValue(value)) {
      merged[key] = value;
    }
  });

  return merged;
};
