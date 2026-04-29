import { Router } from 'express'
import { nonHumanSignalHandler } from './nonHumanSignalHandler.js'
import { qaHandler } from './qaHandler.js'
import { summarizeHandler } from './summarizeHandler.js'

const router = Router()

router.post('/summarize', summarizeHandler)
router.post('/qa', qaHandler)
router.post('/nonhuman/simulate', nonHumanSignalHandler)

export default router
