import mongoose, { Document, Schema } from "mongoose";

export interface IStory extends Document {
    author: String;
    title: String,
    text: String,
    poster: String,
    views: Number
}

const StorySchema: Schema<IStory> = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true,
    },
    poster: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Story = mongoose.model<IStory>("Story", StorySchema);
export default Story;

