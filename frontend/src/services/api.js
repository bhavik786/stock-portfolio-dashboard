import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  // const token = localStorage.getItem("token");
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGJjNjBiY2EzNzBmMDI5MWFhYjdmZSIsImlhdCI6MTc0NTYwOTUwMSwiZXhwIjoxNzQ2MjE0MzAxfQ.OJoeYLIawYixj9uzS0CTLPn1tUut_ESFmsmjgoxribE";
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
