import { Command } from "src/types";
import { bot, text } from "../../index.ts";
import Utils from "src/Utils.ts";
import config from "config.json" with { type: "json" };

const command : Command = {
    name: "/stats",
    async exec(message) {
        if (!Utils.isAdmin(message.from!.id)) return;
        text.setDefaultNamespace("basic");
        
        const stats = (await import("stats.json", { with: { type: "json" } })).default as Record<string, number>;
        const data = Object.keys(stats).map(id => `🔷 *${Utils.shieldText((config.workers as Record<string, string>)[id])}* \\- *${stats[id]}*`);
        await bot.sendMessage(message.chat.id, [
            text.t("statistics"),
            data.join("\n")
        ].join("\n\n"), {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
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