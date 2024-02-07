import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/axios"; // path to your axios.ts file
import { CreateJobDto, UpdateJobDto } from "./dto/job.dto";
import { RootState } from "./store";
import { CreateInterviewDto, UpdateInterviewDto } from "./dto/interview.dto";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const signup = async (firstName: string, lastName: string, email: string, password: string) => {
  const response = await axiosInstance.post("/auth/signup", { firstName, lastName, email, password });
  return response.data;
};

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
  "jobs/deleteJob",
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
