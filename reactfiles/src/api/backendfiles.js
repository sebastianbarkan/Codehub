const baseUrl =
  process.env.NODE_ENV === "api" ? null : "http://localhost:8080/api";

export default baseUrl;
