import { Command } from "src/types";
import { bot, text } from "../../index.ts";
import Utils from "src/Utils.ts";
import config from "config.json" with { type: "json" };
import Database from "src/database/Database.ts";

const command : Command = {
    name: "/stats",
    async exec(message) {
        if (!Utils.isAdmin(message.from!.id)) return;
        text.setDefaultNamespace("basic");
        
        const stats = await Database.getAllUsers({});
        if (!stats) return;
        const data = stats.map(stat => `🔷 *${Utils.shieldText((config.workers as Record<string, string>)[stat.id.toString()])}* \\- *${stat.requests}*`);
        await bot.sendMessage(message.chat.id, [
            text.t("statistics"),
            data.join("\n")
        ].join("\n\n"), {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: text.t("reload_stats"),
                            callback_data: "reload_stats"
                        }
                    ],
                    [
                        {
                            text: text.t("back"),
                            callback_data: "start"
                        }
                    ]
                ]
            }
        });
    }
}

export default command;