# InterviewAce

Welcome to InterviewAce - a sophisticated web-based platform designed to revolutionize job interview preparation with the power of Natural Language Processing (NLP). 

## Overview

InterviewAce leverages speech recognition and a fine-tuned GPT model to provide personalized feedback on interview responses, aiming to improve communication skills and performance in job interviews. It offers a unique feature set tailored to different job sectors and roles, enabling role-specific advice for a variety of interview types.

## Features

- **Personalized Feedback**: Utilizes NLP to analyze interview responses and provide detailed feedback.
- **Progress Tracking**: Monitors improvements over time, helping users to see their development.
- **Sector-Specific Customization**: Adjusts feedback according to different job sectors and roles for relevant advice.
- **User-Friendly Interface**: Easy-to-use platform with a simple navigation flow.

## Tech Stack

- **Frontend**: React, Next.js, Redux, Chakra UI, TypeScript
- **Backend**: NestJS, Prisma, Axios, PostgreSQL
- **NLP**: Integration with OpenAI's GPT model

## Getting Started

To start using InterviewAce, follow these commands:

```bash
# Create a PostgreSQL database on your local machine
# Put the Postgres connection string in the .env file within the backend directory
DATABASE_URL = "*connection string here*" 

# Run the setup command in the terminal from the root terminal
npm run setup

# Run the frontend  
npm run start:fe

# Start the backend on another terminal allowing them to run concurrently
npm run start:be
```

You can now access the application on [localhost:3000](http://localhost:3000/).

Alternatively, you can visit the deployed version of the application [here](https://www.interviewace.co.uk/).

## Sole Contributor

Abbas Alibhai

*InterviewAce is not just a tool; it's your ace in the hole for job interview preparation.*