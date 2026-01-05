import { State } from "src/types";
import config from "config.json" with { type: "json" };
import Database from "src/database/Database";
import Utils from "src/Utils";
import { bot } from "src/bot";

const command : State = {
    name: "edited_message",
    async exec(message) {
        if (
            !message.is_topic_message || 
            (!message.photo && !message.video) || 
            !message.message_thread_id ||
            !message.caption ||
            !Object.keys(config.topic_ids).includes(message.message_thread_id?.toString() ?? "wrong")
        ) return;

        //Parsing
        const productCaptionWords = message.caption.split(" ");
        const productName : string = productCaptionWords[0].toLowerCase();

        productCaptionWords.shift();
        const description : string = productCaptionWords.join(" ");
        if (!productName) return;

        const productMedia = await Database.getProductMedia({ id: message.message_id });
        if (!productMedia) {
            bot.processUpdate({
                update_id: message.message_id,
                message
            });
            return;
        }

        const product = await Database.getProduct(productMedia.bed_id);
        if (!product) return;

        //If only description was edited
        if (product.name === productName) {
            await Database.updateProductMedia(message.message_id, {
                description
            });
            return;
        }

        //Getting bed
        let newProduct = await Database.getProductByName(productName);
        if (!newProduct) {
            newProduct = await Database.createProduct({
                id: Utils.getRandomString(10),
                type: (config.topic_ids as Record<string, "wooden" | "soft">)[message.message_thread_id.toString()],
                name: productName
            });
        }
        if (!newProduct) return;

        //Update bedMedia info
        await Database.updateProductMedia(message.message_id, {
            description, 
            bed_id: newProduct.id
        });

        //Check for clearing
        const attachedToOldBed = await Database.getAllProductMedias({ bed_id: product.id });
        if (!attachedToOldBed || !attachedToOldBed.length) await Database.deleteProduct(product.id);
    }
}

export default command;