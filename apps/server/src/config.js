export default {
  env: process.env.NODE_ENV || "development",

  server: {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0"
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
  }
};