import fs from "fs";
import { PossibleEvent, RouteEvent } from "../types.ts";
import TelegramBot from "node-telegram-bot-api";
import Utils from "src/Utils.ts";
import config from "config.json" with { type: "json" };

class Router {
    private async get(event: PossibleEvent) {
        const data: RouteEvent = new Map();
        const dir : fs.Dirent[] = fs.readdirSync(`./src/bot/routes/${event}`, {
            withFileTypes: true
        });

        for (const file of dir) {
            if (file.isDirectory()) {
                const inData : RouteEvent = await this.get(`${event}/${file.name}`);
                for (const name of inData.keys()) {
                    data.set(name, inData.get(name)!);
                }
            } else {
                const info = (await import(`./routes/${event}/${file.name}`)).default;
                data.set(info.name, info.exec);
            }
        }

        return data;
    }

    private static async middleware(id: number) : Promise<boolean>{        
        return await Utils.isWorker(id) ? true : false;
    }

    public async route(bot: TelegramBot) {
        const commands = await this.get("commands");
        const callbacks = await this.get("callbacks");
        const fileStates = await this.get("states");
        const handlers = await this.get("updates");

        bot.on("message", async message => {
            //Middleware
            if (!(await Router.middleware(message.from!.id))) return;
            
            const command = commands.get(message.text!);
            
            if(command && message.chat.id > 0) {
                await command(message);
                return;
            }

            if (+config.group_id === message.chat.id) {
                await handlers.get("add_product")!(message)
                    .catch(async (err: Error) => {
                        console.log("ERROR | ", err);
                        await handlers.get("error")!(message.chat.id);
                    });
                return;
            }
            if (message.chat.id > 0)
                await fileStates.get("main_state")!(message)
                    .catch(async (err: Error) => {
                        console.log("ERROR | ", err);
                        await handlers.get("error")!(message.chat.id);
                    });
        });

        bot.on("callback_query", async query => {
            //Middleware
            if (!(await Router.middleware(query.from!.id))) return;

            const args = query.data!.split(":");
            const name = args[0];

            args.shift();
            await callbacks.get(name)?.(query, args)
                    .catch(async (err: Error) => {
                        console.log("ERROR | ", err);
                        await handlers.get("error")!(query.message!.chat.id);
                    });
        });

        bot.on("message_reaction", async update => {
            console.log(update);
            if (config.group_id !== update.chat.id) return;
            await handlers.get("message_reacted")!(update)
                    .catch(async (err: Error) => {
                        console.log("ERROR | ", err);
                        await handlers.get("error")!(update.chat.id);
                    });
            return;
        });

        bot.on("edited_message", async message => {
            if (config.group_id !== message.chat.id) return;
            await handlers.get("edited_message")!(message)
                    .catch(async (err: Error) => {
                        console.log("ERROR | ", err);
                        await handlers.get("error")!(message.chat.id);
                    });
            return;
        });
    }
}

export default Router;
