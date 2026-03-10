# Tech Factors Inc. Auditing System

A modern, web-based auditing and asset management system designed for Tech Factors Inc. This application provides comprehensive features for asset tracking, audit management, user administration, and real-time alerts.

## Features

- **Asset Management**: Track and manage company assets with detailed information and history
- **Audit Management**: Create, schedule, and manage audit processes with digital checklists
- **User Administration**: Manage user accounts, roles, and permissions
- **Real-time Alerts**: Receive notifications for asset issues, audit failures, and system events
- **QR Code Scanning**: Utilize device cameras to scan QR codes for quick asset access
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Switch between dark and light modes for better user experience
- **Firebase Integration**: Real-time database, authentication, and analytics powered by Firebase

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Lucide React (icons), Motion (animations)
- **QR Scanning**: ZXing Library
- **Database & Auth**: Firebase (Firestore, Authentication)
- **AI Integration**: Google Gemini API
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Google Cloud API Key (for Gemini AI)
- Firebase Project (for authentication and database)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TechFactorsInc_Auditing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example`
   - Replace the placeholder values with your actual API keys and configuration

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Sidebar, Topbar)
│   ├── Scanner/        # Scanner components (CameraViewport, ScanHistory, ScanResult)
│   └── UI/             # Basic UI elements (Badge, DataTable, Modal, etc.)
├── context/            # React contexts (Auth, Theme)
├── firebase/           # Firebase configuration
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # Service layer for API calls
├── styles/             # Global styles
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and constants
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint to check for errors
- `npm run preview`: Preview production build locally

## Environment Variables

The following environment variables are required:

- `GEMINI_API_KEY`: Your Google Cloud API key for accessing the Gemini AI API
- `APP_URL`: The URL where the application is hosted (used for self-referential links)

## Firebase Configuration

Firebase configuration is set in `src/firebase/config.ts`. You can replace the default values with your own Firebase project credentials.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact the Tech Factors Inc. development team.
