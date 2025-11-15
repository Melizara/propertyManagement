import type { Request, Response } from "express";
import { Story } from "../models/story.model.ts";
import { User } from "../models/user.model.ts";

export const createStory = async (req: Request, res: Response) => {
    try {
        if (!req.userMatricule) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }
        const story = await Story.create({
            title: req.body.title,
            text: req.body.text,
            poster: req.body.poster,
            userMatricule: req.userMatricule!
        });
        return res.status(201).json(story);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
export const updateStory = async (req: Request, res: Response) => {
    try {
        const story = await Story.findByPk(req.params.id);

        if (!story) {
            return res.status(404).json({ message: "not found storie update" });
        }

        await story.update({
            title: req.body.title,
            text: req.body.text,
            poster: req.body.poster,
            userMatricule: req.userMatricule!
        });

        return res.status(200).json(story);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const getStory = async (req: Request, res: Response) => {
    try {
        const storyId = req.params.id;

        const story = await Story.findByPk(storyId, {
            include: [
                {
                    model: User,
                    as: "author", // si tu as défini l'alias dans les relations
                    attributes: ["id", "username", "email"] // sélectionner seulement les champs voulus
                    // si tu veux inclure password aussi : ["id","username","email","password"]
                },
            ],
        });

        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        // Incrémentation du nombre de vues
        await story.save();

        return res.status(200).json(story);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

export const getStories = async (req: Request, res: Response) => {
    try {
        const stories = await Story.findAll({
            order: [["id", "DESC"]],
            include: [{ association: "author", attributes: { exclude: ["password"] } }],
        });
        return res.status(200).json(stories);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
export const deleteStory = async (req: Request, res: Response) => {
    try {
        const story = await Story.findByPk(req.params.id);

        if (!story) {
            return res.status(404).json({ message: "not found storie delete" });
        }

        await story.destroy();
        return res.status(200).json(story);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};



