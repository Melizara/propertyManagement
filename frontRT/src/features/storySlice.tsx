import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

interface Story {
    id: number;
    title: string;
    text: string;
    // ajoute d'autres champs si ton API en renvoie (ex: author, createdAt, etc.)
}
interface StoriesState {
    stories: Story[];
    status: "loading" | "success" | "error";
}

const initialState: StoriesState = {
    stories: [],
    status: "loading",
};

export const fetchStories = createAsyncThunk<Story[]>("/stories/fetchStories", async () => {
    const { data } = await axios.get("/api/stories");
    console.log("Response:", data);
    return data;
})

export const deleteStory = createAsyncThunk<void, number>(
    "/stories/deleteStory",
    async (id) => {
        await axios.delete(`/api/stories/${id}`);
    }
);


const storiesSlice = createSlice({
    name: "stories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStories.pending, (state) => {
                state.stories = []
                state.status = "loading"
            })
            .addCase(fetchStories.rejected, (state) => {
                state.stories = []
                state.status = "error"
            })
            .addCase(fetchStories.fulfilled, (state, action) => {
                state.stories = action.payload
                state.status = "success"
            })
            .addCase(deleteStory.pending, (state, action) => {
                state.stories = state.stories.filter((story) => story.id !== action.meta.arg)

            })
    }
});

export default storiesSlice.reducer;