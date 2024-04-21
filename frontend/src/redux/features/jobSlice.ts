import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/app/axios';
import { CreateJobDto, Job, JobResponse, UpdateJobDto } from '@/redux/dto/job.dto';
import { CreateInterviewDto, Interview, StartInterviewDto, UpdateInterviewDto } from '@/redux/dto/interview.dto';
import { Question } from '@/redux/dto/question.dto';
import axios from 'axios';

export const fetchJobs = createAsyncThunk<JobResponse[], undefined>(
  'jobs/fetchJobs',
  async (_, { getState, rejectWithValue }) => {
    const { jobs, fetched } = getState() as JobState;
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

export const fetchJobDetails = createAsyncThunk<JobResponse, string>(
  'jobs/fetchJobDetails',
  async (id: string, { getState, rejectWithValue }) => {
    const existingJob = (getState() as JobState).jobs[id];

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

export const createJob = createAsyncThunk<JobResponse, CreateJobDto>(
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
  (startInterviewDto: StartInterviewDto) => {
    return startInterviewDto;
  },
);

export const emptyLoading = createAsyncThunk<string, string>('jobs/emptyLoading', (interviewId: string) => {
  return interviewId;
});

export const editJob = createAsyncThunk<JobResponse, { id: string; updateJobDto: UpdateJobDto }>(
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

export const deleteJob = createAsyncThunk<JobResponse, string>(
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

export const retakeInterview = createAsyncThunk<Interview, { interviewId: string; sameQuestions: boolean }>(
  'jobs/retakeInterview',
  async ({ interviewId, sameQuestions }: { interviewId: string; sameQuestions: boolean }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/interviews/retake/${interviewId}`, { sameQuestions });
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

export const deleteQuestion = createAsyncThunk<Question, string>(
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

export const answerQuestion = createAsyncThunk<
  Question,
  { questionId: string; response: string; interviewId: string }
>(
  'jobs/answerQuestion',
  async ({ questionId, response }: { questionId: string; response: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/questions/answer/${questionId}`, { response });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteData = createAsyncThunk<void>('jobs/deleteData', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.delete('/user/data');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as Error);
    } else {
      return rejectWithValue(new Error('An unknown error occurred'));
    }
  }
});

// Define the state structure for jobs
export interface JobState {
  jobs: { [key: string]: Job };
  fetched: boolean;
  creatingInterview: boolean;
  loadingInterview: string | null;
  currentInterview: StartInterviewDto;
}

const initialState: JobState = {
  jobs: {},
  fetched: false,
  creatingInterview: false,
  loadingInterview: 'hello',
  currentInterview: {
    jobId: '',
    interviewId: '',
  },
};

function convertJobResponseToJob(jobResponse: JobResponse): Job {
  const interviewsDict: { [key: string]: Interview } = jobResponse.interviews.reduce(
    (acc, interview) => {
      acc[interview.id] = interview;
      return acc;
    },
    {} as { [key: string]: Interview },
  );

  return { ...jobResponse, interviews: interviewsDict };
}

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<JobResponse[]>) => {
        const jobsDict: { [key: string]: Job } = action.payload.reduce(
          (acc, jobResponse) => {
            const job = convertJobResponseToJob(jobResponse);
            acc[job.id] = job;
            return acc;
          },
          {} as { [key: string]: Job },
        );
        state.jobs = jobsDict;
        state.fetched = true;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        const job = convertJobResponseToJob(action.payload);
        state.jobs[job.id] = job;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<JobResponse>) => {
        const job = convertJobResponseToJob(action.payload); // Convert to Job format with interviews as a dictionary
        state.jobs[job.id] = job;
      })
      .addCase(editJob.fulfilled, (state, action: PayloadAction<JobResponse>) => {
        const updatedJob = convertJobResponseToJob(action.payload); // Convert to Job format with interviews as a dictionary
        state.jobs[updatedJob.id] = updatedJob;
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        delete state.jobs[action.payload.id];
      })
      .addCase(fetchInterview.fulfilled, (state, action: PayloadAction<Interview>) => {
        const interview = action.payload;
        const job = state.jobs[interview.jobId];
        if (!job.interviews) {
          // Initialize interviews as a dictionary if it doesn't exist
          job.interviews = {};
        }
        // Update the interview within the job's interviews dictionary
        job.interviews[interview.id] = interview;
      })
      .addCase(addInterview.pending, (state) => {
        state.creatingInterview = true;
      })
      .addCase(addInterview.fulfilled, (state, action: PayloadAction<Interview>) => {
        const interview = action.payload;
        const job = state.jobs[interview.jobId];
        if (!job.interviews) {
          // Initialize interviews as a dictionary if it doesn't exist
          job.interviews = {};
        }
        // Update the interview within the job's interviews dictionary
        job.interviews[interview.id] = interview;
        state.creatingInterview = false;
      })
      .addCase(addInterview.rejected, (state) => {
        state.creatingInterview = false;
      })
      .addCase(retakeInterview.pending, (state) => {
        state.creatingInterview = true;
      })
      .addCase(retakeInterview.fulfilled, (state, action: PayloadAction<Interview>) => {
        const interview = action.payload;
        const job = state.jobs[interview.jobId];
        if (!job.interviews) {
          // Initialize interviews as a dictionary if it doesn't exist
          job.interviews = {};
        }
        // Update the interview within the job's interviews dictionary
        job.interviews[interview.id] = interview;
        state.creatingInterview = false;
      })
      .addCase(retakeInterview.rejected, (state) => {
        state.creatingInterview = false;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.currentInterview = {
          jobId: action.payload.jobId,
          interviewId: action.payload.interviewId,
        };
      })
      .addCase(emptyLoading.fulfilled, (state, action) => {
        if (action.payload === state.loadingInterview) {
          state.loadingInterview = null;
        }
      })
      .addCase(updateInterview.pending, (state, action) => {
        state.loadingInterview = action.meta.arg.id;
      })
      .addCase(updateInterview.fulfilled, (state, action: PayloadAction<Interview>) => {
        const interview = action.payload;
        const job = state.jobs[interview.jobId];
        if (!job.interviews) {
          // Initialize interviews as a dictionary if it doesn't exist
          job.interviews = {};
        }
        // Update the interview within the job's interviews dictionary
        job.interviews[interview.id] = interview;
        state.loadingInterview = null;
      })
      .addCase(updateInterview.rejected, (state) => {
        state.loadingInterview = null;
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        const interview = action.payload;
        const job = state.jobs[interview.jobId];
        delete job.interviews[interview.id];
      })
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
        // Assuming the payload contains at least one question, which includes both interviewId and jobId
        if (action.payload.length > 0) {
          const firstQuestion = action.payload[0];
          const jobId = firstQuestion.jobId;
          const interviewId = firstQuestion.interviewId;

          // Directly access the job and the interview to update its questions
          if (state.jobs[jobId] && state.jobs[jobId].interviews[interviewId]) {
            state.jobs[jobId].interviews[interviewId].questions = action.payload;
          }
        }
      })
      .addCase(addQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        const question = action.payload;
        const jobId = question.jobId;
        const interviewId = question.interviewId;

        // Directly access the job and the interview to update the questions list
        if (state.jobs[jobId] && state.jobs[jobId].interviews[interviewId]) {
          // Ensure the questions list exists
          if (!state.jobs[jobId].interviews[interviewId].questions) {
            state.jobs[jobId].interviews[interviewId].questions = [];
          }
          // Add the new question
          state.jobs[jobId].interviews[interviewId].questions.push(question);
        }
      })
      .addCase(updateQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        const updatedQuestion = action.payload;
        const jobId = updatedQuestion.jobId;
        const interviewId = updatedQuestion.interviewId;

        // Directly access the specific job and interview
        if (state.jobs[jobId] && state.jobs[jobId].interviews[interviewId]) {
          const interview = state.jobs[jobId].interviews[interviewId];
          // Check if the questions array exists and contains the question to be updated
          if (interview.questions) {
            const questionIndex = interview.questions.findIndex((question) => question.id === updatedQuestion.id);
            if (questionIndex !== -1) {
              // Update the specific question within the interview
              interview.questions[questionIndex] = updatedQuestion;
            }
          }
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        const { id: questionId, jobId, interviewId } = action.payload; // Destructure to get questionId, jobId, and interviewId directly

        // Directly access the job and the interview
        if (state.jobs[jobId] && state.jobs[jobId].interviews[interviewId]) {
          const interview = state.jobs[jobId].interviews[interviewId];
          // Filter out the question by its ID within the interview
          if (interview.questions) {
            interview.questions = interview.questions.filter((question) => question.id !== questionId);
          }
        }
      })
      .addCase(answerQuestion.fulfilled, (state, action) => {
        const updatedQuestion = action.payload;
        const jobId = updatedQuestion.jobId;
        const interviewId = updatedQuestion.interviewId;

        // Directly access the specific job and interview
        if (state.jobs[jobId] && state.jobs[jobId].interviews[interviewId]) {
          const interview = state.jobs[jobId].interviews[interviewId];
          // Check if the questions array exists and contains the question to be updated
          if (interview.questions) {
            const questionIndex = interview.questions.findIndex((question) => question.id === updatedQuestion.id);
            if (questionIndex !== -1) {
              // Update the specific question within the interview
              interview.questions[questionIndex] = updatedQuestion;
            }
          }
          if (updatedQuestion.index + 1 === interview.questions.length) {
            state.loadingInterview = interviewId;
          }
        }
      })
      .addCase(deleteData.fulfilled, (state) => {
        state.jobs = {};
      });
  },
});

export const { reset: resetJobs } = jobSlice.actions;
export default jobSlice.reducer;
