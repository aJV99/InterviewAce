import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/axios"; // path to your axios.ts file
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  try {
    const response = await axiosInstance.get("/jobs");
    const getjobs = response.data;

    // Dispatch the addJob action to update the Redux state
    // dispatch(setJobs(getjobs));

    return getjobs;
  } catch (error) {
    // Handle error
    throw error;
  }
});

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (createJobDto: CreateJobDto, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/jobs", createJobDto);
      const newJob = response.data;

      // Dispatch the addJob action to update the Redux state
      // dispatch(addJob(newJob));

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

      // Dispatch the updateJob action to update the Redux state
      // dispatch(updateJob(updatedJob));

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

      // Dispatch the removeJob action to update the Redux state
      // dispatch(removeJob(id));

      return id;
    } catch (error) {
      // Handle error
      throw error;
    }
  },
);
