import mongoose from 'mongoose'
import User from './models/User.js'
import dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'

await mongoose.connect(MONGO_URI)

const existing = await User.findOne({ username: 'admin' })
if (existing) {
    console.log('Admin already exists')
} else {
    await User.create({ username: 'admin', password: 'admin123', role: 'admin' })
    console.log('✅ Admin created: username=admin password=admin123')
}

await mongoose.disconnect()
