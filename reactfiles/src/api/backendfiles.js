const baseUrl =
  process.env.NODE_ENV === "production" ? null : "http://localhost:8080/api";

export default baseUrl;
