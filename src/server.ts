import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { initDatabase, checkDatabaseExists } from '@/database/connection.js'
import { errorHandler } from '@/middleware/validation.middleware.js'
import apiTestRouter from '@/routes/test.routes.js'
import authRouter from '@/routes/auth.routes.js'
import platformRouter from '@/routes/platform.routes.js'
import storageRouter from '@/routes/storage.routes.js'

const app = express()
const PORT = process.env.PORT || 3006

// Check if database exists and initialize if it does
const databaseExists = checkDatabaseExists()
if (databaseExists) {
  initDatabase()
} else {
  console.log('Database not found. Setup required.')
}

// Middleware
app.use(helmet())
app.use(cors({
  origin: 'http://localhost:3005',
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Use modular router for /api/test-data
app.use('/api/test-data', apiTestRouter)

// Use auth router
app.use('/api/auth', authRouter)

// Use platform router
app.use('/api/platform', platformRouter)

// Use storage router
app.use('/api/storage', storageRouter)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from CloudyVerse Backend! 🌩️',
    timestamp: new Date().toISOString(),
    server: 'Express.js with TypeScript',
    environment: process.env.NODE_ENV || 'development'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Error handler
app.use(errorHandler)

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

export const viteNodeApp = app 