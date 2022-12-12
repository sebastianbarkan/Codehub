const baseUrl =
  process.env.NODE_ENV === "production" ? null : "https://localhost:8080";

export default baseUrl;
