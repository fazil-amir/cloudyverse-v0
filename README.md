# 🌩️ CloudyVerse - Full Stack TypeScript Application

A modern full-stack TypeScript application built with Vite for both frontend and backend, featuring React 18, Express.js, and strict TypeScript configuration.

## 🚀 Features

- **Single Package.json**: Unified dependency management
- **TypeScript Strict Mode**: Enhanced type safety
- **Vite**: Fast development and building for both frontend and backend
- **React 18**: Modern React with hooks and concurrent features
- **Express.js**: Robust backend API
- **Modern UI**: Beautiful gradient design with glassmorphism effects
- **Hot Reload**: Instant development feedback
- **CORS Enabled**: Cross-origin requests supported
- **Security**: Helmet.js for security headers

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Mantine UI
- **Backend**: Express.js, TypeScript, Vite
- **Styling**: Mantine UI components with custom gradients
- **Development**: Concurrently for running both servers
- **Ports**: 3005 (Frontend), 3006 (Backend)

## 📦 Installation

### Prerequisites

This project requires **Node.js v22.14.0**. 

**Using nvm (Node Version Manager):**
```bash
# Install nvm if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc

# Install and use Node.js v22.14.0
nvm install 22.14.0
nvm use 22.14.0

# Verify the version
node --version  # Should show v22.14.0
```

**Using fnm (Fast Node Manager):**
```bash
# Install fnm if you haven't already
curl -fsSL https://fnm.vercel.app/install | bash

# Restart your terminal or run:
source ~/.bashrc

# Install and use Node.js v22.14.0
fnm install 22.14.0
fnm use 22.14.0

# Verify the version
node --version  # Should show v22.14.0
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloudyverse
   ```

2. **Setup Node.js version (choose one method)**
   
   **Option A: Automatic setup**
   ```bash
   npm run setup-node
   ```
   
   **Option B: Manual setup**
   ```bash
   # If using nvm, the .nvmrc file will automatically switch to v22.14.0
   nvm use
   
   # Verify the version
   node --version  # Should show v22.14.0
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 🎯 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend (port 3005)
- `npm run dev:server` - Start only the backend (port 3006)
- `npm run build` - Build both frontend and backend for production
- `npm run preview` - Preview the built frontend
- `npm run start` - Start the production server
- `npm run kill-ports` - Kill processes on ports 3005 and 3006
- `npm run type-check` - Run TypeScript type checking
- `npm run check-node-version` - Check if the correct Node.js version is being used
- `npm run setup-node` - Automatically install and switch to Node.js v22.14.0

## 🌐 API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/test` - Test API endpoint
- `GET /` - API information

## 📁 Project Structure

```
cloudyverse/
├── src/
│   ├── client.ts          # React entry point
│   ├── server.ts          # Express server entry point
│   ├── App.tsx           # Main React component
│   ├── App.css           # Component styles
│   └── index.css         # Global styles
├── index.html            # HTML entry point
├── vite.config.ts        # Frontend Vite config
├── vite.server.config.ts # Backend Vite config
├── tsconfig.json         # TypeScript config
├── tsconfig.node.json    # Node TypeScript config
└── package.json          # Dependencies and scripts
```

## 🔧 Development

The application uses:
- **Vite** for fast development and building
- **vite-plugin-react** for React support
- **vite-plugin-node** for Express.js backend
- **Concurrently** to run both servers simultaneously
- **TypeScript strict mode** for enhanced type safety

### Node.js Version Management

This project is configured to use Node.js v22.14.0. The following files ensure version consistency:

- `.nvmrc` - Specifies Node.js version for nvm users
- `.node-version` - Specifies Node.js version for other version managers
- `package.json` engines field - Enforces Node.js version requirement
- `preinstall` script - Checks Node.js version before npm install

**Automatic version switching:**
```bash
# If using nvm, automatically switch to the correct version
nvm use

# Check the current version
npm run check-node-version
```

## 🎨 UI Features

- Modern gradient background with glassmorphism effects
- Mantine UI components for consistent design
- Interactive notifications and loading states
- Responsive grid layout for tech stack
- Beautiful icons from Tabler Icons
- Smooth animations and transitions
- Interactive API testing interface with real-time feedback

## 🚀 Production

To build for production:
```bash
npm run build
npm start
```

## 📝 License

MIT License 