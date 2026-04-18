import express from "express";
import cors from "cors";
import config from "./config.js";


const app = express();

app.use(cors({
  origin: config.cors.origin,
  methods: config.cors.methods,
  credentials: config.cors.credentials
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", env: config.env });
});


app.listen(config.server.port, config.server.host, () => {
  console.log(
    `Server running on http://${config.server.host}:${config.server.port}`
  );
});