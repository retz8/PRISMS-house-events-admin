import axios from "axios";

const client = axios.create({
  baseURL: "https://prisms-house-events-api-production.up.railway.app/api",
});

export default client;
