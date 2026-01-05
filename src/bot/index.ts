import TelegramBot from "node-telegram-bot-api";
import Router from "./Router.ts";
import initializeI18N from "../i18n/index.ts";
(await import("dotenv")).config({ path: "./process.env"});

const BOT_TOKEN : string | undefined = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("❌ Bot token wasn't found!");
const bot : TelegramBot = new TelegramBot(BOT_TOKEN, { 
    polling: {
        params: {
            allowed_updates: [ "message_reaction", "message", "callback_query", "edited_message" ]
        }
    }
});

const text = await initializeI18N();

export { bot, Router, text };