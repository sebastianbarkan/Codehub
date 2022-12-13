const baseUrl =
  process.env.NODE_ENV === "production" ? "api" : "http://localhost:8080/api";

export default baseUrl;
