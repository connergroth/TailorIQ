<p align="center">
  <img src="https://github.com/user-attachments/assets/91faa122-90c6-49a5-9798-b264758e95c2" alt="TailorAI" width="350"/>
</p>

# 🧵 TailorIQ

**TailorIQ** is an AI-powered resume builder that instantly generates clean, ATS-optimized resumes based on your experience — tailored to each job application.

---

## 🌐 Live App (Coming Soon)

Stay tuned for our live deployment!

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#-configuration)
- [🔑 API Keys](#-api-keys)
- [🚀 Running the Application](#-running-the-application)
- [📁 Project Structure](#-project-structure)

---

## ✨ Features

### 🧬 AI-Enhanced Resume Generation
- Automatically generate professional, ATS-optimized resumes.
- Tailor resumes to specific job descriptions.

### 📋 Easy Multi-Step Questionnaire
- Input work experience, education, skills, and projects.
- Add/remove entries dynamically.

### 🎨 Customization & Templates
- Choose between modern, classic, minimal, and creative templates.
- Adjust font, spacing, and layout settings.

### 🛡️ Secure User Management
- Google Authentication for safe, cross-device access.

### 📄 PDF Export
- Download polished resumes directly as PDFs.

---

## 🛠️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/>
  <img src="https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white"/>
</p>

### Frontend
- React + TypeScript
- Tailwind CSS
- Wouter (Routing)
- React Query
- React Hook Form

### Backend
- Express.js
- Puppeteer (PDF generation)
- OpenAI Integration (Resume improvements)

---

## 📦 Installation

### Prerequisites
- Node.js v16+
- Firebase account
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tailoriq.git
   cd tailoriq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## ⚙️ Configuration

Create a `.env` file at the root:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# OpenAI API
OPENAI_API_KEY=your_openai_api_key
```

---

## 🔑 API Keys

### Firebase
- Set up a Firebase project.
- Enable Authentication (Google Sign-In).
- Fill in the environment variables.

### OpenAI
- Create an API key at [OpenAI](https://platform.openai.com/).
- Add it to `.env`.

---

## 🚀 Running the Application

### Development
```bash
npm run dev
```
App will be available at [http://localhost:5000](http://localhost:5000).

### Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
TailorIQ/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # UI components 
│   │   │   ├── ui/             # shadcn/ui component library
│   │   │   └── ...             # Application-specific components
│   │   ├── contexts/           # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions & API clients
│   │   └── pages/              # Page components
│   └── index.html              # HTML entry point
├── server/                     # Backend Express server
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API route definitions
│   ├── openai.ts               # OpenAI API integration
│   ├── pdf.ts                  # PDF generation logic
│   └── storage.ts              # Data storage interface
├── shared/                     # Shared code between client & server
│   └── schema.ts               # Database and validation schemas
└── tailwind.config.ts          # Tailwind CSS configuration
```
