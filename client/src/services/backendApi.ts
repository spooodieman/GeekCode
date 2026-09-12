import axios from "axios";

export const fetchData = axios.create({
  baseURL: "https://geekcode-server.onrender.com/api",
});

// Add request interceptor to include token dynamically

