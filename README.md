# AI_Study_Planner

AI_Study_Planner is an AI-powered academic productivity platform designed to help students plan their studies, track progress, stay focused, and improve exam readiness through intelligent recommendations and learning analytics.

The project combines the organizational capabilities of modern productivity tools with AI-driven learning assistance to create a personalized study experience.

---

## Problem Statement

Students often struggle with:

* Managing multiple subjects and deadlines
* Creating realistic study schedules
* Maintaining study consistency
* Identifying weak areas before exams
* Staying focused during study sessions
* Effectively revising large amounts of study material

Most existing tools provide task management but lack personalized academic guidance and adaptive planning.

AI_Study_Planner aims to solve these challenges through intelligent scheduling, progress tracking, focus monitoring, and AI-assisted learning.

---

## Project Objectives

* Generate personalized study plans
* Help students manage academic goals
* Track study progress and productivity
* Provide AI-powered learning assistance
* Improve focus during study sessions
* Evaluate exam readiness using data-driven insights
* Generate quizzes and revision materials automatically

---

## Core Features

### Planning & Organization

* Subject Management
* Goal Management
* Task Management
* Academic Calendar
* Study Planner Dashboard

### AI Study Planner

* Personalized Study Schedule Generation
* Smart Task Prioritization
* Dynamic Schedule Updates
* AI Recommendations

### Learning Assistant

* Notes Upload (PDF, PPT, DOCX)
* AI-Powered Question Answering
* Automatic Summaries
* Flashcard Generation
* Important Topic Extraction

### Focus & Productivity

* Focus Mode
* Pomodoro Timer
* Focus Session Tracking
* Focus Score Calculation

### Assessment & Analytics

* Progress Tracking
* Weekend Quiz Generator
* Quiz Evaluation
* Exam Readiness Score
* Productivity Analytics Dashboard

---

## Technology Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* ShadCN UI

### Backend

* AWS Lambda
* Amazon API Gateway

### Database

* Amazon DynamoDB

### Authentication

* Amazon Cognito

### Storage

* Amazon S3

### Artificial Intelligence

* Amazon Bedrock

### Visualization

* Recharts

---

## Proposed AWS Architecture

User
↓
Next.js Frontend
↓
Amazon API Gateway
↓
AWS Lambda
↓
Amazon DynamoDB

Authentication
↓
Amazon Cognito

File Uploads
↓
Amazon S3

AI Services
↓
Amazon Bedrock

---

## Project Workflow

1. User creates an account.
2. User adds subjects, goals, deadlines, and available study hours.
3. AI generates a personalized study plan.
4. User tracks completed tasks and study sessions.
5. Notes and study materials can be uploaded for AI-assisted learning.
6. Weekend quizzes are generated automatically.
7. Readiness scores and analytics are updated based on progress and performance.

---

## Current Development Status

### Completed

* Problem Statement Definition
* Feature Planning
* Competitor Research
* AWS Service Selection
* System Architecture Design
* Development Roadmap

### In Progress

* User Flow Design
* UI/UX Wireframes
* Frontend Development
* AWS Integration

### Planned

* AI Study Planner
* Learning Assistant
* Focus Mode
* Quiz Generator
* Readiness Analytics

---

## Repository Structure

AI_Study_Planner/

├── frontend/

├── backend/

├── docs/

│   ├── research/

│   ├── architecture/

│   ├── wireframes/

│   └── user-flow/

├── screenshots/

├── README.md

└── progress-log.md

---

## Future Scope

* Chrome Extension for Study Assistance
* Google Calendar Integration
* Advanced Learning Analytics
* Collaborative Study Groups
* Mobile Application
* Voice-Based AI Tutor

---

## Team

Developed as part of the AWS Summer Builder Cohort 2026.

---

## License

This project is currently under development and intended for educational and research purposes.
