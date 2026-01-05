import { ErrorState } from "src/types";
import { bot, text } from "src/bot";

const command : ErrorState = {
    name: "error",
    async exec(chatId) {
        bot.sendMessage(chatId, text.t("error"));
    }
}

export default command;