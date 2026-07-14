import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import portfolioRoutes from './routes/portfolioRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'

app.use(cors())
app.use(express.json())

// Routes
app.use('/api', portfolioRoutes)

app.get('/', (req, res) => res.json({ message: 'Portfolio API running ✅' }))

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected')
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
    })
    .catch(err => {
        console.error('❌ MongoDB error:', err.message)
        // Still start server so frontend proxy doesn't hard-fail
        app.listen(PORT, () => console.log(`⚠️  Server running without DB on port ${PORT}`))
    })
