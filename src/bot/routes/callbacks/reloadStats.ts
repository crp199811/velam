import { Callback} from "src/types";
import { text, bot } from "src/bot";
import Utils from "src/Utils";

const callback : Callback = {
    name: "reload_stats",
    async exec(query) {
        text.setDefaultNamespace("basic");

        await bot.deleteMessage(query.message!.chat.id, query.message!.message_id)
            .catch(_ => {});
        
        bot.processUpdate({
            update_id: Utils.getRandomNumber(10),
            message: {
                message_id: Utils.getRandomNumber(10),
                date: Date.now(),
                chat: query.message!.chat,
                text: "/stats",
                from: query.from
            }
        })
    }
}

export default callback;