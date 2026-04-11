import dns from "dns";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

// Node will bypass your system DNS and use these instead — good for MongoDB Atlas SRV resolution
// 1.1.1.1 → Cloudflare DNS
// 8.8.8.8 → Google DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();
