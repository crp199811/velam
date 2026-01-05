import { State } from "src/types";
import config from "config.json" with { type: "json" };
import Database from "src/database/Database.ts";

const command : State = {
    name: "message_reacted",
    async exec(message: any) {
       if (!message.new_reaction?.map((reaction : { type: string, emoji?: string }) => reaction?.emoji).includes(config.delete_reaction)) return;
    
       const deleteingProduct = await Database.deleteProductMedia(message.message_id);
       if (!deleteingProduct) return;

       //Check for clearing
       const attachedToOldProduct = await Database.getAllProductMedias({ bed_id: deleteingProduct.bed_id });
       if (!attachedToOldProduct || !attachedToOldProduct.length) await Database.deleteProduct(deleteingProduct.bed_id);
    }
}

export default command;