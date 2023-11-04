import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchJobs } from "../api";

// Define the state structure for jobs
export interface JobState {
  jobs: {
    id: string;
    title: string;
    company: string;
    description: string;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const initialState: JobState = {
  jobs: [],
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<JobState["jobs"]>) => {
      state.jobs = action.payload;
    },
    addJob: (state, action: PayloadAction<JobState["jobs"][0]>) => {
      state.jobs.push(action.payload);
    },
    updateJob: (state, action: PayloadAction<JobState["jobs"][0]>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    removeJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.jobs = action.payload;
    });
  },
});

export const { setJobs, addJob, updateJob, removeJob } = jobSlice.actions;
export default jobSlice.reducer;
