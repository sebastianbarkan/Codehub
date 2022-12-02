const baseUrl =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8080";

export default baseUrl;
