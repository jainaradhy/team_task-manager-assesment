import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { seedDemoData } from "./config/seed.js";

const PORT = process.env.PORT || 5000;

await connectDatabase();
await seedDemoData();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 Demo login: admin@acme.dev / Admin@1234 (Owner)`);
  console.log(`🔑 Demo login: alice@acme.dev  / Member@1234 (Member)`);
});
