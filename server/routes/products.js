import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { readCollection, writeCollection } from '../store.js'

const router = Router()

// Fields a client is allowed to set/change. Everything else is ignored.
const ALLOWED_FIELDS = [
  'category',
  'title',
  'description',
  'image',
  'learnMoreUrl',
  'price',
  'compareAtPrice',
  'currency',
  'variants',
]

function pick(body) {
  const out = {}
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) out[key] = body[key]
  }
  return out
}

// GET /api/products?category=cameras
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query
    let products = await readCollection('products')
    if (category) products = products.filter((p) => p.category === category)
    res.json(products)
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const products = await readCollection('products')
    const product = products.find((p) => p.id === req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const payload = pick(req.body ?? {})
    if (!payload.title || !payload.category || typeof payload.price !== 'number') {
      return res
        .status(400)
        .json({ error: 'title, category and a numeric price are required' })
    }

    const products = await readCollection('products')
    const product = { id: randomUUID(), currency: 'USD', variants: [], ...payload }
    products.push(product)
    await writeCollection('products', products)
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
})

// PUT /api/products/:id  (partial update)
router.put('/:id', async (req, res, next) => {
  try {
    const products = await readCollection('products')
    const index = products.findIndex((p) => p.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Product not found' })

    const updated = { ...products[index], ...pick(req.body ?? {}), id: req.params.id }
    products[index] = updated
    await writeCollection('products', products)
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const products = await readCollection('products')
    const index = products.findIndex((p) => p.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Product not found' })

    const [removed] = products.splice(index, 1)
    await writeCollection('products', products)
    res.json(removed)
  } catch (err) {
    next(err)
  }
})

export default router
