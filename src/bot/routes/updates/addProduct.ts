import Database from "src/database/Database";
import { State } from "src/types";
import Utils from "src/Utils";
import config from "config.json" with { type: "json" };
import mediaGroupStates from "src/bot/states/MediaGroupStates";
import { ProductMediaDoc } from "src/database/models/ProductMedia.ts";

/**
 * Adds photos to database in the bed form
 * @param photos 
 * @param message_thread_id 
 * @param name 
 * @returns 
 */
const addToDb = async (message_thread_id: number, bedName: string, mediaInfo: Omit<ProductMediaDoc, "bed_id">) => {
    let product = await Database.getProductByName(bedName.toLowerCase());
    if (!product) {
        product = await Database.createProduct({
            id: Utils.getRandomString(10),
            type: (config.topic_ids as Record<string, "wooden" | "soft" | "sofa" | "other" | "stand">)[message_thread_id.toString()],
            name: bedName.toLowerCase()
        });
    }
    if (!product) return;


    await Database.createProductMedia({
        bed_id: product.id,
        ...mediaInfo
    });
}

const command : State = {
    name: "add_product",
    async exec(message) {
        if (
            !message.is_topic_message || 
            (!message.photo && !message.video) || 
            !message.message_thread_id ||
            !Object.keys(config.topic_ids).includes(message.message_thread_id?.toString() ?? "wrong")
        ) return;
        
        const fileId : string =
            message.photo?.[message.photo.length - 1]?.file_id
            ?? message.video?.file_id
            ?? "";
        
        //If media is single
        if (!message.media_group_id && message.caption) {
            if (!fileId) return;

            //Parsing
            const productCaptionWords = message.caption.split(" ");
            const productName : string = productCaptionWords[0];

            productCaptionWords.shift();
            const description : string = productCaptionWords.join(" ");
            if (!productName) return;

            await addToDb(message.message_thread_id, productName, {
                medias: [ fileId ],
                media_types: [ message.video ? "video" : "photo" ],
                description,
                id: message.message_id
            });
            return;
        }
        if (!message.media_group_id) return;

        //If we got a media group
        const mediaGroupInfo = mediaGroupStates.get(message.media_group_id);
        if (mediaGroupInfo?.timeoutId) 
            clearTimeout(mediaGroupInfo.timeoutId);


        const resultTimeoutId = setTimeout(async () => {
            if (!message.media_group_id || !message.message_thread_id) return;

            const mediaGroupInfo = mediaGroupStates.get(message.media_group_id);
            if (!mediaGroupInfo || !mediaGroupInfo.caption.trim().length) return;
            
            const productCaptionWords = mediaGroupInfo.caption.split(" ");
            const productName : string = productCaptionWords[0];

            productCaptionWords.shift();
            const description : string = productCaptionWords.join(" ");
            if (!productName) return;

            await addToDb(message.message_thread_id, productName, {
                medias: mediaGroupInfo.medias,
                media_types: mediaGroupInfo.media_types,
                description,
                id: mediaGroupInfo.message_id
            });

            mediaGroupStates.delete(message.media_group_id);
        }, 1500);

        
        mediaGroupStates.set(message.media_group_id, {
            timeoutId: resultTimeoutId,
            medias: [...(mediaGroupInfo ? mediaGroupInfo.medias : []), fileId ],
            media_types: [...(mediaGroupInfo ? mediaGroupInfo.media_types : []), message.video ? "video" : "photo" ],
            caption: mediaGroupInfo?.caption ?? message.caption ?? "",
            message_id: mediaGroupInfo?.message_id ?? message.message_id
        });
    }
}

export default command;