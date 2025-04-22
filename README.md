# 🎙️ Voice AI Interview Platform

An AI-powered voice interview platform where recruiters can create job posts, generate AI-based interview questions, and allow candidates to take interviews via a voice AI agent. The agent evaluates candidate responses in real-time and provides a detailed performance report to the recruiter.

---

## 🚀 Features

- 🔐 Google Auth powered by Supabase
- 📄 Create job posts easily
- 🤖 Auto-generate interview Q/A using LLM (Large Language Model) based on job description
- 📎 Shareable AI interview link for candidates
- 🗣️ Voice AI agent conducts interview and evaluates performance
- 📊 Post-interview feedback report for recruiters
- ☁️ Supabase used for data storage and authentication

---

## 🏗️ Tech Stack

- **Frontend**: Next.js / React.js
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Voice AI**: Vapi
- **LLM**: OpenAI GPT or similar
- **Auth**: Google OAuth via Supabase

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Irshad-Ahmaed/AI-V-Recruiter
cd AI-V-Recruiter
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=

- OPEN_ROUTER_API_KEY=

- NEXT_PUBLIC_SUPABASE_REDIRECT_URL=''

- NEXT_PUBLIC_HOST_URL='http://localhost:3000/interview/'

- NEXT_PUBLIC_VAPI_PUBLIC_KEY=

### 4. Run locally
```sh
npm run dev
```

### App runs at: http://localhost:3000