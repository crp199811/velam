import mongoose, { InferSchemaType, Schema } from "mongoose";

const userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    requests: {
        type: Number,
        default: 0
    }
});

export type UserDoc = InferSchemaType<typeof userSchema>;
export default mongoose.model("users", userSchema);