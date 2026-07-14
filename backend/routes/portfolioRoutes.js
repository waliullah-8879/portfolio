import express from 'express'
import jwt from 'jsonwebtoken'
import Project from '../models/Project.js'
import Skill from '../models/Skill.js'
import Certificate from '../models/Certificate.js'
import Overview from '../models/Overview.js'
import User from '../models/User.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()
const SECRET = process.env.JWT_SECRET || 'portfolio_secret_key'

// === PUBLIC ROUTES ===
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 })
        res.json(projects)
    } catch { res.status(500).json({ message: 'Server error' }) }
})

router.get('/skills', async (req, res) => {
    try {
        const skills = await Skill.find()
        res.json(skills)
    } catch { res.status(500).json({ message: 'Server error' }) }
})

router.get('/certificates', async (req, res) => {
    try {
        const certs = await Certificate.find()
        res.json(certs)
    } catch { res.status(500).json({ message: 'Server error' }) }
})

router.get('/overview', async (req, res) => {
    try {
        const overview = await Overview.findOne()
        res.json(overview)
    } catch { res.status(500).json({ message: 'Server error' }) }
})

// === ADMIN AUTH ===
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) return res.status(401).json({ message: 'Invalid credentials' })
        const valid = await user.comparePassword(password)
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' })
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '7d' })
        res.json({ token })
    } catch { res.status(500).json({ message: 'Server error' }) }
})

// === PROTECTED ADMIN ROUTES ===
router.post('/projects', authMiddleware, async (req, res) => {
    try {
        const project = await Project.create(req.body)
        res.status(201).json(project)
    } catch { res.status(500).json({ message: 'Server error' }) }
})

router.put('/projects/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(project)
    } catch { res.status(500).json({ message: 'Server error' }) }
})

router.delete('/projects/:id', authMiddleware, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id)
        res.json({ message: 'Deleted' })
    } catch { res.status(500).json({ message: 'Server error' }) }
})

export default router
