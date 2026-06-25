import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.js'
import categoriesRouter from './routes/categories.js'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(cors())
app.use(express.json())

// Simple request log so you can see CRUD calls land while reviewing.
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`)
  next()
})

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)

// 404 for unknown API routes
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
