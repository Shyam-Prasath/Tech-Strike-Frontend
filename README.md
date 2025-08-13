# TechStrike - Pool Management System

## 🚀 Overview

TechStrike is an innovative pool management system that leverages AI-powered insights and blockchain technology to connect consultants with opportunities while providing intelligent skill gap analysis and training recommendations. The platform features role-based access control, attendance tracking, and advanced analytics to optimize talent pool management.

## 🏗️ Architecture

The system follows a modern full-stack architecture with clear separation of concerns:

```
Frontend (React/Web3.js) → Backend (Node.js/Express) → Database (Supabase) → Blockchain (Ethereum/Metamask)
                                     ↓
                               AI Engine (Resume Parsing, Job Matching, Skills Analysis)
```

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Metamask Wallet Integration**: Secure Web3 authentication
- **Role-Based Access Control**: Separate dashboards for Admins and Consultants
- **Blockchain Verification**: Wallet address verification for enhanced security

### 👨‍💼 Admin Dashboard
- View top users and job submitters
- Upload attendance data with AI-powered statistics
- Dynamic feature usage analytics
- Job posting and skills management
- Comprehensive pool oversight

### 🎯 Consultant Dashboard
- Resume upload and AI parsing
- ATS score calculation and skill gap analysis
- AI-powered job recommendations
- Attendance tracking and insights
- Personalized training suggestions

### 🤖 AI-Powered Features
- **Resume Parsing**: Intelligent extraction of skills and experience
- **Skill Gap Analysis**: Identify areas for improvement
- **Job Matching**: Smart recommendations based on profile
- **Training Suggestions**: Personalized learning paths
- **Attendance Insights**: Pattern recognition and analytics

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **Web3.js**: Blockchain interaction
- **Metamask**: Wallet integration
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web application framework
- **RESTful API**: Clean API design
- **Session Management**: Secure user sessions

### Database
- **Supabase**: PostgreSQL-based backend-as-a-service
- **Real-time subscriptions**: Live data updates
- **Secure authentication**: Built-in auth system

### Blockchain
- **Ethereum**: Smart contract platform
- **Metamask**: Web3 wallet provider
- **Decentralized Identity**: Blockchain-based authentication

### AI/ML
- Custom AI engine for:
  - Natural Language Processing
  - Resume parsing and analysis
  - Skill matching algorithms
  - Predictive analytics

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Metamask wallet
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shyam-Prasath/Tech-Strike-Frontend
   cd Tech-Strike-Frontend
   ```

2. **Install dependencies**
   ```bash
   
   # Install frontend dependencies
   npm install
   npm run dev
   ```

3. **Environment Setup**
   ```bash
   # .env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   AI_API_KEY=your_ai_api_key
   ```

## 📱 Usage

### For Consultants
1. Connect your Metamask wallet
2. Complete profile setup and upload resume
3. View AI-generated ATS scores and skill gaps
4. Browse personalized job recommendations
5. Track attendance and training progress

### For Admins
1. Access admin dashboard after role verification
2. Monitor platform analytics and user activity
3. Upload attendance data for AI analysis
4. Post new job opportunities
5. Manage skills database and training content

## 🔌 API Endpoints

### Admin Routes
- `GET admin/profile` - Get top users
- `POST admin/agents` - Upload attendance data
- `GET admin/dashboard` - Platform analytics
- `POST admin/consultant` - Create job postings

### Consultant Routes
- `POST consultant/resume` - Upload resume
- `GET consultant/resume` - Get ATS analysis
- `GET consultant/oppoptunities` - Job recommendations
- `GET consultant/training` - Training suggestions

## 📊 System Architecture Details

### Role-Based Flow
```
User Login → Wallet Verification → Role Detection → Dashboard Routing
     ↓
[Admin] → Analytics, Job Management, User Oversight
     ↓
[Consultant] → Profile Management, Job Discovery, Skill Development
```

### Data Flow
```
Frontend User Action → API Layer → Business Logic → Database/AI Engine → Response → UI Update
```

### AI Engine Integration
The AI engine processes:
- Resume text extraction and parsing
- Skill identification and categorization
- Job matching based on requirements
- Attendance pattern analysis
- Training recommendation algorithms

## 🔒 Security Features

- Blockchain-based authentication
- Rate limiting on API endpoints
- Encrypted data storage

## 📈 Future Roadmap

- [ ] Advanced AI model training
- [ ] Mobile application development
- [ ] Integration with major job boards
- [ ] Smart contract implementation
- [ ] Multi-chain wallet support
- [ ] Advanced analytics dashboard
- [ ] Automated skill certification


**Built by the S Shyam Prasath**
