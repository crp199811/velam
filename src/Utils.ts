import { InlineKeyboardButton } from "node-telegram-bot-api";
import config from "config.json" with { type: "json" };
import { bot } from "./bot";

class Utils {
    public static getRandomString(n: number) : string {
        return [...Array(n)]
            .map(() => Math.random().toString(36)[2])
            .join("");
    }

    public static shieldText(text: string) : string {
        return text.replace(/[-_*[\]()~`>#+=|{}.!\\]/g, '\\$&');
    }

    public static isAdmin(id: number) : boolean {
        return config.admins.includes(id);
    }

    public static async isWorker(id: number) : Promise<boolean> {
        if (config.admins.includes(id) || config.workers.includes(id)) return true;

        const user = await bot.getChatMember(config.group_id, id);
        return Boolean(user);
    }

    public static createNavigateButtons(n: number, callback_data: string, totalLength: number) : InlineKeyboardButton[]{
        const navigationButtons = [];
        if (totalLength > 1 && +n !== 0) navigationButtons.push({ 
            text: "1", 
            callback_data: `${callback_data}:0`
        }, 
        { 
            text: `←`, 
            callback_data: `${callback_data}:${+n - 1}` 
        });
        if (totalLength > 1) navigationButtons.push({ 
            text: `${+n + 1}/${totalLength}`, 
            callback_data: "_" 
        });
        if (totalLength > 1 && +n !== totalLength - 1) navigationButtons.push({ 
            text: `→`, 
            callback_data: `${callback_data}:${+n + 1}`
        }, 
        { 
            text: `...${totalLength}`, 
            callback_data: `${callback_data}:${totalLength - 1}` 
        });
        return navigationButtons;
    }

    public static toUpperFirst(str: string) {
        return str[0].toUpperCase() + str.slice(1)
    }
}

export default Utils;