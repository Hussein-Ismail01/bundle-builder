import { Router } from 'express'
import { readCollection } from '../store.js'

const router = Router()

// GET /api/categories  -> read-only grouping used to organize products
// (will drive the steps of the multi-step accordion later).
router.get('/', async (_req, res, next) => {
  try {
    const categories = await readCollection('categories')
    res.json(categories)
  } catch (err) {
    next(err)
  }
})

export default router
