const baseUrl =
  process.env.NODE_ENV === "api" ? null : "https://localhost:8080/api";

export default baseUrl;
