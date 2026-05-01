import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { seedDemoData } from "./config/seed.js";

const PORT = process.env.PORT || 5000;

await connectDatabase();
await seedDemoData();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔑 Demo login: aradhy@bharat.dev / Admin@1234 (Owner)`);
  console.log(`🔑 Demo login: rahul@bharat.dev  / Member@1234 (Member)`);
});
