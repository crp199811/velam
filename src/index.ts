import { bot, Router } from "./bot/index.ts";
import Database from "./database/Database.ts";
import config from "../config.json" with { type: "json" };
console.clear();

const router = new Router();
router.route(bot);
console.log("Info | ✅ Bot started successfully!");
console.log("Info | Workers are ", Object.values(config.workers).join("\n"));
await Database.connect();