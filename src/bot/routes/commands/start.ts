import { Command } from "src/types";
import { bot, text } from "../../index.ts";

const command : Command = {
    name: "/start",
    async exec(message) {
        text.setDefaultNamespace("basic");

        await bot.sendMessage(message.chat.id, text.t("greeting"), {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: text.t("main_buttons.soft_beds"),
                            callback_data: "products:soft:0"
                        }
                    ],
                    [
                        {
                            text: text.t("main_buttons.wooden_beds"),
                            callback_data: "products:wooden:0"
                        }
                    ],[
                        {
                            text: text.t("main_buttons.sofas"),
                            callback_data: "products:sofa:0"
                        }
                    ],
                    [
                        {
                            text: text.t("main_buttons.stands"),
                            callback_data: "products:stand:0"
                        }
                    ],[
                        {
                            text: text.t("main_buttons.others"),
                            callback_data: "products:other:0"
                        }
                    ]
                ]
            }
        });
    }
}

export default command;