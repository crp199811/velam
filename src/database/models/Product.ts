import mongoose, { InferSchemaType, Schema } from "mongoose";

const productSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [ "wooden", "soft", "sofa", "stand", "other" ]
    }
});

export type ProductDoc = InferSchemaType<typeof productSchema>;
export default mongoose.model("beds", productSchema);