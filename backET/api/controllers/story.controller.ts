import type { Request, Response } from "express";

export const createStory = async (req: Request, res: Response) => {
    return res.send('Create')
}
export const getStory = async (req: Request, res: Response) => {
    return res.send('Story')
}
export const getStories = async (req: Request, res: Response) => {
    return res.send('Stories')
}
export const updateStory = async (req: Request, res: Response) => {
    return res.send('Update')
}
export const deleteStory = async (req: Request, res: Response) => {
    return res.send('Delete')
}