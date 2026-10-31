export const getPayload = (response) =>
  response?.data?.data ?? response?.data ?? response;
export const getArray = (value) =>
  Array.isArray(value)
    ? value
    : value?.items || value?.rooms || value?.tasks || value?.completions || [];
export const getErrorMessage = (error) =>
  error?.userMessage ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";
export const initials = (name = "Room mate") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
export const formatDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
