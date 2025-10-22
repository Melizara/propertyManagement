import type { Request, Response } from "express";
import Story from "../models/story.model.ts";

export const createStory = async (req: Request, res: Response) => {
    try {
        const doc = new Story({
            title: req.body.title,
            text: req.body.text,
            poster: req.body.poster,
            author: req.userId
        })

        const story = await doc.save();
        return res.status(200).json(story)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}
export const getStory = async (req: Request, res: Response) => {
    try {
        const storyId = req.params.id

        const story = await Story.findOneAndUpdate(
            { _id: storyId },
            { $inc: { views: 1 } },
            { returnDocument: "after" }
        )

        if (!story) {
            return res.status(404).json({
                message: "not found storie"
            })
        }

        return res.status(200).json(story);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                error: error.message
            })
        }
    }
}


export const getStories = async (req: Request, res: Response) => {
    try {
        const stories = await Story.find().sort({ createdAt: -1 }).populate("author", "-password").exec();

        return res.status(200).json(stories);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}
export const updateStory = async (req: Request, res: Response) => {
    try {
        const story = await Story.findOneAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                text: req.body.text,
                poster: req.body.poster,
                author: req.userId
            },
            { new: true }
        )

        if (!story) {
            return res.status(404).json({
                message: "not found storie update"
            })
        }

        return res.status(200).json(story);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}
export const deleteStory = async (req: Request, res: Response) => {
    try {
        const story = await Story.findByIdAndDelete({ _id: req.params.id });

        if (!story) {
            return res.status(404).json({
                message: "not found storie delete"
            })
        }

        return res.status(200).json(story);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }
}

