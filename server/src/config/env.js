const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.local"), override: true });

if (!process.env.PORT) {
  process.env.PORT = "3000";
}
