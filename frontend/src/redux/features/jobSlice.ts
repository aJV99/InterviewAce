import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "../dto/job.dto";
import { addInterview, deleteInterview, fetchInterviewDetails, fetchJobs, updateInterview } from "../api";
import { fetchJobDetails, createJob, editJob } from "../api";

// Define the state structure for jobs
export interface JobState {
  jobs: Job[];
  fetched: boolean;
}

const initialState: JobState = {
  jobs: [],
  fetched: false,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    reset: () => initialState,
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
    builder
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.fetched = true;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload; // Update existing job
        } else {
          state.jobs.push(action.payload); // Add new job if not present
        }
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(editJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(fetchInterviewDetails.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index].interviews = action.payload.interviews;
        }
      })
      .addCase(addInterview.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index].interviews.push(action.payload.interview);
        }
      })
      .addCase(updateInterview.fulfilled, (state, action) => {
        const jobIndex = state.jobs.findIndex(job => 
          job.interviews.some(interview => interview.id === action.payload.interview.id));
        if (jobIndex !== -1) {
          const interviewIndex = state.jobs[jobIndex].interviews.findIndex(interview => interview.id === action.payload.interview.id);
          if (interviewIndex !== -1) {
            state.jobs[jobIndex].interviews[interviewIndex] = action.payload.interview;
          }
        }
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.jobs.forEach(job => {
          job.interviews = job.interviews.filter(interview => interview.id !== action.payload);
        });
      });
  },
});

export const { setJobs, addJob, updateJob, removeJob, reset: resetJobs } = jobSlice.actions;
export default jobSlice.reducer;
