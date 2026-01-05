import { Callback, SingleBedMedia } from "src/types";
import Database from "src/database/Database.ts";
import { bot } from "src/bot";
import Utils from "src/Utils";

const callback : Callback = {
    name: "get_product",
    async exec(query, [ bed_id ]) {
        //Get bed
        const bed = await Database.getProduct(bed_id);
        if (!bed) return;

        //Get medias for this bed
        const productMedias = await Database.getAllProductMedias({ bed_id });
        if (!productMedias) return;

        //Prepare array for single photos or videos
        const singleMedias : SingleBedMedia[] = [];

        for (const productMedia of productMedias) {
            //Dedicating for groupping
            if (!productMedia.description) {
                singleMedias.push(...productMedia.medias
                    .map((media, index) => ({
                        media,
                        type: productMedia.media_types[index]
                    })));
                continue;
            }

            await bot.sendMediaGroup(query.message!.chat.id, productMedia.medias
                .map((media, index) => ({
                    type: productMedia.media_types[index],
                    media,
                    caption: index === 0 ? `${Utils.toUpperFirst(bed.name)}\n${productMedia.description}` : undefined
                }))
            );
        }

        //Group rest medias and send
        for (let i = 0; i < Math.ceil(singleMedias.length/10); i++) {
            await bot.sendMediaGroup(query.message!.chat.id, singleMedias
                .slice(i*10, (i+1)*10)
                .map((bedMedia: SingleBedMedia, index: number) => ({
                    ...bedMedia,
                    caption: index === 0? Utils.toUpperFirst(bed.name) : undefined
                }))
            );
        }
        try {
            await Database.updateUser(query.from.id, {
                $inc: { requests: 1}
            });
        } catch (err) {
            console.warn(`Adding statstics for user ${query.from.id} got ERROR!`);
            console.trace();
            console.log(err);
        }
    }
}

export default callback;