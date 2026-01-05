import { Callback } from "src/types";
import { bot, text } from "../../index.ts";
import Utils from "src/Utils.ts";
import Database from "src/database/Database.ts";
import { InlineKeyboardButton } from "node-telegram-bot-api";

const command : Callback = {
    name: "products",
    async exec(query, [ type, n ]) {
        text.setDefaultNamespace("basic");

        const products = await Database.getAllProducts({ type });
        if (!products) return console.log(`❌ Error | No ${type} products were found!`);
        products.sort((a, b) => a.name.localeCompare(b.name, "uk"));

        const necessaryProducts = products.filter((_, index) => index > 15*(+n) - 1 && index < 15*(+n + 1) - 1);
        const buttons = necessaryProducts.map(product => ([{
            text: `🛌 ${Utils.toUpperFirst(product.name)}`,
            callback_data: `get_product:${product.id}`
        } as InlineKeyboardButton]));
        buttons.push(Utils.createNavigateButtons(+n, `products:${type}`, Math.ceil(products.length/15)));

        await bot.editMessageText(text.t(`${type}_products`), {
            message_id: query!.message!.message_id,
            chat_id: query.message!.chat.id,
            reply_markup: {
                inline_keyboard: [
                    ...buttons,
                    [
                        {
                           text: text.t("back", {
                                ns: "basic"
                            }),
                            callback_data: "start"
                        }
                    ]
                ]
            }
        });
    }
}

export default command;