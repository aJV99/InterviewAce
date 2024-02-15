import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateJobDto, Job, UpdateJobDto } from "../dto/job.dto";
import { RootState } from ".././store";
import { CreateInterviewDto, UpdateInterviewDto } from "../dto/interview.dto";
import axiosInstance from "@/app/axios"; // path to your axios.ts file

// import { addInterview, deleteInterview, fetchInterviewDetails, fetchJobs, updateInterview } from "../api";
// import { fetchJobDetails, createJob, editJob } from "../api";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { getState, rejectWithValue }) => {
    const { jobs, fetched } = (getState() as RootState).jobs; // Adjust RootState if the path is different
    if (fetched) {
      return jobs;
    } else {
      try {
        const response = await axiosInstance.get("/jobs");
        return response.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  },
);

export const fetchJobDetails = createAsyncThunk(
  "jobs/fetchJobDetails",
  async (id: string, { getState, rejectWithValue }) => {
    const existingJob = (getState() as RootState).jobs.jobs.find(job => job.id === id);
    
    if (existingJob && existingJob.interviews) {
      // If job details are already available, return them directly
      return existingJob;
    } else {
      try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/addJob",
  async (createJobDto: CreateJobDto, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/jobs", createJobDto);
      const newJob = response.data;

      return newJob;
    } catch (error) {
      // Handle error
      throw error;
    }
  },
);

// Thunk for updating a job
export const editJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, updateJobDto }: { id: string; updateJobDto: UpdateJobDto }) => {
    try {
      const response = await axiosInstance.put(`/jobs/${id}`, updateJobDto);
      const updatedJob = response.data;

      return updatedJob;
    } catch (error) {
      // Handle error
      throw error;
    }
  },
);

// Thunk for deleting a job
export const deleteJob = createAsyncThunk(
  "jobs/removeJob",
  async (id: string) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);

      return id;
    } catch (error) {
      // Handle error
      throw error;
    }
  },
);

// Thunk for fetching interview details
export const fetchInterviewDetails = createAsyncThunk(
  'jobs/fetchInterviewDetails',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/interviews/${jobId}`);
      return { jobId, interviews: response.data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk for adding an interview
export const addInterview = createAsyncThunk(
  'jobs/addInterview',
  async (createInterviewDto: CreateInterviewDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/interviews', createInterviewDto);
      return { jobId: createInterviewDto.jobId, interview: response.data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk for updating an interview
export const updateInterview = createAsyncThunk(
  'jobs/updateInterview',
  async ({ id, updateInterviewDto }: { id: string; updateInterviewDto: UpdateInterviewDto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/interviews/${id}`, updateInterviewDto);
      return { interview: response.data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Thunk for deleting an interview
export const deleteInterview = createAsyncThunk(
  'jobs/deleteInterview',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/interviews/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


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
      .addCase(deleteJob.fulfilled, (state, action) => {
        const jobId = action.payload;
        state.jobs = state.jobs.filter(job => job.id !== jobId);
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
