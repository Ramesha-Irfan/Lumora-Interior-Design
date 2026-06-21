const Database = require("better-sqlite3");

const dbPaths = {
  libDb: "c:/Users/Yes/Downloads/Unsplash-Gallery-Update/Unsplash-Gallery-Update/lib/db/lumora.db",
  apiServerDb: "c:/Users/Yes/Downloads/Unsplash-Gallery-Update/Unsplash-Gallery-Update/artifacts/api-server/lumora.db"
};

for (const [key, dbPath] of Object.entries(dbPaths)) {
  console.log(`\n=== ${key} at ${dbPath} ===`);
  try {
    const db = new Database(dbPath);
    const users = db.prepare("SELECT id, name, username, email, created_at FROM users").all();
    console.log("Users:", users.length ? users : "(empty)");
    db.close();
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}
