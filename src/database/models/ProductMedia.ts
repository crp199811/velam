import mongoose, { InferSchemaType, Schema } from "mongoose";

const productMediaSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    medias: {
        type: [String],
        required: true
    },
    media_types: {
        type: [String],
        required: true,
        enum: ["photo", "video"]
    },
    description: String,
    bed_id: {
        type: String,
        required: true
    },
});

export type ProductMediaDoc = InferSchemaType<typeof productMediaSchema>;
export default mongoose.model("bedmedias", productMediaSchema);