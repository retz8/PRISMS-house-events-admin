import axios from "axios";

const client = axios.create({
  baseURL: "https://prisms-house-events-api.onrender.com/api",
});

export default client;
