import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/app/axios'; // path to your axios.ts file
import { CreateJobDto, Job, UpdateJobDto } from '../dto/job.dto';
import { CreateInterviewDto, Interview, StartInterviewDto, UpdateInterviewDto } from '../dto/interview.dto';
import { Question } from '../dto/question.dto';

export const fetchJobs = createAsyncThunk<Job[], undefined>(
  'jobs/fetchJobs',
  async (_, { getState, rejectWithValue }) => {
    const { jobs, fetched } = getState() as JobState; // Adjust RootState if the path is different
    if (fetched) {
      return jobs;
    } else {
      try {
        const response = await axiosInstance.get('/jobs');
        return response.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  },
);

export const fetchJobDetails = createAsyncThunk<Job, string>(
  'jobs/fetchJobDetails',
  async (id: string, { getState, rejectWithValue }) => {
    const existingJob = (getState() as JobState).jobs.find((job) => job.id === id);

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
  },
);

export const createJob = createAsyncThunk<Job, CreateJobDto>(
  'jobs/addJob',
  async (createJobDto: CreateJobDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/jobs', createJobDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const startInterview = createAsyncThunk<StartInterviewDto, StartInterviewDto>(
  'jobs/startInterview',
  async (startInterviewDto: StartInterviewDto) => {
    return startInterviewDto;
  },
);

// Thunk for updating a job
export const editJob = createAsyncThunk<Job, { id: string; updateJobDto: UpdateJobDto }>(
  'jobs/updateJob',
  async ({ id, updateJobDto }: { id: string; updateJobDto: UpdateJobDto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/jobs/${id}`, updateJobDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for deleting a job
export const deleteJob = createAsyncThunk<Job, string>(
  'jobs/deleteJob',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for fetching interview details
// export const fetchInterviews = createAsyncThunk<Interview[], string>(
//   'jobs/fetchInterviews',
//   async (jobId: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/interviews/${jobId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   },
// );

export const fetchInterview = createAsyncThunk<Interview, string>(
  'jobs/fetchInterview',
  async (interviewId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/interviews/${interviewId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for adding an interview
export const addInterview = createAsyncThunk<Interview, { jobId: string; createInterviewDto: CreateInterviewDto }>(
  'jobs/addInterview',
  async (
    { jobId, createInterviewDto }: { jobId: string; createInterviewDto: UpdateInterviewDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post(`/interviews/${jobId}`, createInterviewDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateInterview = createAsyncThunk<Interview, { id: string; updateInterviewDto: UpdateInterviewDto }>(
  'jobs/updateInterview',
  async (
    { id, updateInterviewDto }: { id: string; updateInterviewDto: UpdateInterviewDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put(`/interviews/${id}`, updateInterviewDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for deleting an interview
export const deleteInterview = createAsyncThunk<Interview, string>(
  'jobs/deleteInterview',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/interviews/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for fetching questions for a specific interview
export const fetchQuestions = createAsyncThunk<Question[], string>(
  'jobs/fetchQuestions',
  async (interviewId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/questions/${interviewId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for adding a question
export const addQuestion = createAsyncThunk<Question, { interviewId: string; content: string }>(
  'jobs/addQuestion',
  async ({ interviewId, content }: { interviewId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/questions/${interviewId}`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for updating a question
export const updateQuestion = createAsyncThunk<Question, { questionId: string; content: string }>(
  'jobs/updateQuestion',
  async ({ questionId, content }: { questionId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/questions/${questionId}`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for deleting a question
export const deleteQuestion = createAsyncThunk<string, string>(
  'jobs/deleteQuestion',
  async (questionId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Thunk for answering a question
export const answerQuestion = createAsyncThunk<
  Question,
  { questionId: string; response: string; interviewId: string }
>(
  'jobs/answerQuestion',
  async (
    { questionId, response }: { questionId: string; response: string },
    // { questionId, response, interviewId }: { questionId: string; response: string; interviewId: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.put(`/questions/answer/${questionId}`, { response });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Define the state structure for jobs
export interface JobState {
  jobs: Job[];
  fetched: boolean;
  creatingInterview: boolean;
  loadingInterview: string | null;
  currentInterview: {
    jobId: string | null;
    interviewId: string | null;
  };
}

const initialState: JobState = {
  jobs: [],
  fetched: false,
  creatingInterview: false,
  loadingInterview: null,
  currentInterview: {
    jobId: 'b856fc93-8880-4f9b-a049-5eb96d07e33b',
    interviewId: '6a3a8b5f-251f-45f9-bb96-31513061ceb0',
  },
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    reset: () => initialState,
    // setJobs: (state, action: PayloadAction<JobState['jobs']>) => {
    //   state.jobs = action.payload;
    // },
    // addJob: (state, action: PayloadAction<JobState['jobs'][0]>) => {
    //   state.jobs.push(action.payload);
    // },
    // updateJob: (state, action: PayloadAction<JobState['jobs'][0]>) => {
    //   const index = state.jobs.findIndex((job) => job.id === action.payload.id);
    //   if (index !== -1) {
    //     state.jobs[index] = action.payload;
    //   }
    // },
    // removeJob: (state, action: PayloadAction<string>) => {
    //   state.jobs = state.jobs.filter((job) => job.id !== action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.fetched = true;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
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
        const { id } = action.payload;
        state.jobs = state.jobs.filter((job) => job.id !== id);
      })
      // .addCase(fetchInterviews.fulfilled, (state, action: PayloadAction<Interview[]>) => {
      //   if (action.payload.length > 0) {
      //       const jobId = action.payload[0].jobId; // Assuming each interview object has a jobId property
      //       const index = state.jobs.findIndex((job) => job.id === jobId);
      //       if (index !== -1) {
      //           state.jobs[index].interviews = action.payload; // Directly set the array of interviews
      //       }
      //   }
      // })
      .addCase(fetchInterview.fulfilled, (state, action: PayloadAction<Interview>) => {
        // const jobId = action.payload.jobId; // Assuming each interview object has a jobId property
        // const index = state.jobs.findIndex((job) => job.id === jobId);
        // if (index !== -1) {
        //     state.jobs[index].interviews = action.payload; // Directly set the array of interviews
        // }

        const interview = action.payload; // Now correctly accessing the interview from the payload
        const jobIndex = state.jobs.findIndex((job) =>
          job.interviews.some((interviewItem) => interviewItem.id === interview.id),
        );
        if (jobIndex !== -1) {
          const interviewIndex = state.jobs[jobIndex].interviews.findIndex(
            (interviewItem) => interviewItem.id === interview.id,
          );
          if (interviewIndex !== -1) {
            state.jobs[jobIndex].interviews[interviewIndex] = interview;
          }
        }
      })
      .addCase(addInterview.pending, (state) => {
        state.creatingInterview = true;
      })
      .addCase(addInterview.fulfilled, (state, action: PayloadAction<Interview>) => {
        const interview = action.payload;
        const index = state.jobs.findIndex((job) => job.id === interview.jobId);
        if (index !== -1) {
          if (!state.jobs[index].interviews) {
            state.jobs[index].interviews = []; // Ensure interviews array exists
          }
          state.jobs[index].interviews.push(interview);
        }
        state.creatingInterview = false;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.currentInterview.jobId = action.payload.jobId;
        state.currentInterview.interviewId = action.payload.interviewId;
      })
      .addCase(updateInterview.fulfilled, (state, action: PayloadAction<Interview>) => {
        const interview = action.payload; // Now correctly accessing the interview from the payload
        const jobIndex = state.jobs.findIndex((job) =>
          job.interviews.some((interviewItem) => interviewItem.id === interview.id),
        );
        if (jobIndex !== -1) {
          const interviewIndex = state.jobs[jobIndex].interviews.findIndex(
            (interviewItem) => interviewItem.id === interview.id,
          );
          if (interviewIndex !== -1) {
            state.jobs[jobIndex].interviews[interviewIndex] = interview;
          }
        }
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        const interview = action.payload; // Now correctly accessing the interview from the payload
        const jobIndex = state.jobs.findIndex((job) =>
          job.interviews.some((interviewItem) => interviewItem.id === interview.id),
        );
        if (jobIndex !== -1) {
          // Ensure the job was found before attempting to update
          state.jobs[jobIndex].interviews = state.jobs[jobIndex].interviews.filter(
            (interviewVar) => interviewVar.id !== interview.id,
          );
        }
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        const questions = action.payload;
        const interviewIndex = state.jobs.findIndex((job) =>
          job.interviews.some((interview) => interview.id === questions[0].interviewId),
        );
        if (interviewIndex !== -1) {
          const job = state.jobs[interviewIndex];
          const interview = job.interviews.find((interview) => interview.id === questions[0].interviewId);
          if (interview) {
            interview.questions = questions;
          }
        }
      })
      // Handle adding a question
      .addCase(addQuestion.fulfilled, (state, action) => {
        const question = action.payload;
        // Logic to find and update the specific question with the answer
        state.jobs.forEach((job) => {
          job.interviews.forEach((interview) => {
            const questionIndex = interview.questions.findIndex((question) => question.id === question.id);
            if (questionIndex !== -1) {
              interview.questions.push(question);
            }
          });
        });
        // Similar logic to fetchQuestions for finding the interview and adding the question
      })
      // Handle updating a question
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const updatedQuestion = action.payload;
        // Logic to find and update the specific question with the answer
        state.jobs.forEach((job) => {
          job.interviews.forEach((interview) => {
            const questionIndex = interview.questions.findIndex((question) => question.id === updatedQuestion.id);
            if (questionIndex !== -1) {
              interview.questions[questionIndex] = updatedQuestion;
            }
          });
        });
      })
      // Handle deleting a question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const questionId = action.payload; // Assuming this is the ID of the question to delete

        state.jobs.forEach((job) => {
          job.interviews.forEach((interview) => {
            // Correctly filter out the question by its ID within each interview
            interview.questions = interview.questions.filter((question) => question.id !== questionId);
          });
        });
      })
      // Handle answering a question
      .addCase(answerQuestion.pending, (state, action) => {
        state.loadingInterview = action.meta.arg.interviewId;
      })
      .addCase(answerQuestion.fulfilled, (state, action) => {
        const answerQuestion = action.payload;
        // Logic to find and update the specific question with the answer
        state.jobs.forEach((job) => {
          job.interviews.forEach((interview) => {
            const questionIndex = interview.questions.findIndex((question) => question.id === answerQuestion.id);
            if (questionIndex !== -1) {
              interview.questions[questionIndex] = answerQuestion;
            }
            if (questionIndex + 1 == interview.questions.length) {
              fetchInterview(interview.id);
            }
          });
        });
        state.loadingInterview = null;
      });
  },
});

// export const { setJobs, addJob, updateJob, removeJob, reset: resetJobs } = jobSlice.actions;
export const { reset: resetJobs } = jobSlice.actions;
export default jobSlice.reducer;
