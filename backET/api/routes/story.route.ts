import { Router } from "express";
import { createStory, getStory, getStories, updateStory, deleteStory } from "../controllers/story.controller.ts"
import { protectAuth } from "../middlewares/protectAuth.ts";
const storyRouter = Router();

storyRouter.post("/", protectAuth, createStory);
storyRouter.get("/", getStories);
storyRouter.get("/:id", getStory);
storyRouter.put("/:id", protectAuth, updateStory);
storyRouter.delete("/:id", protectAuth, deleteStory);

export default storyRouter;