import { bot, text } from "src/bot";
import Database from "src/database/Database";
import { SingleBedMedia, State } from "src/types";
import Utils from "src/Utils";

const state : State = {
    name: "main_state",
    async exec(message) {
        if (!message.text) return;
        text.setDefaultNamespace("basic");

        //Get bed
        const product = await Database.getProductByName(message.text.toLowerCase());
        if (!product) {
            await bot.sendMessage(message.chat.id, text.t("product_not_found"), {
                parse_mode: "MarkdownV2",
                reply_to_message_id: message.message_id
            });
            return;
        }

        //Get medias for this bed
        const productMedias = await Database.getAllProductMedias({ bed_id: product.id });
        if (!productMedias) return;

        //Prepare array for single photos or videos
        const singleMedias : SingleBedMedia[] = [];

        for (const bedMedia of productMedias) {
            //Dedicating for groupping
            if (!bedMedia.description) {
                singleMedias.push(...bedMedia.medias
                    .map((media, index) => ({
                        media,
                        type: bedMedia.media_types[index]
                    })));
                continue;
            }

            await bot.sendMediaGroup(message!.chat.id, bedMedia.medias
                .map((media, index) => ({
                    type: bedMedia.media_types[index],
                    media,
                    caption: index === 0 ? `${Utils.toUpperFirst(product.name)}\n${bedMedia.description}` : undefined
                }))
            );
        }

        //Group rest medias and send
        for (let i = 0; i < Math.ceil(singleMedias.length/10); i++) {
            await bot.sendMediaGroup(message!.chat.id, singleMedias
                .slice(i*10, (i+1)*10)
                .map((bedMedia: SingleBedMedia, index: number) => ({
                    ...bedMedia,
                    caption: index === 0? Utils.toUpperFirst(product.name) : undefined
                }))
            );
        }
    }
}

export default state;