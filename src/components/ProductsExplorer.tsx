import { useCategories, useProducts } from '../hooks/useProducts'
import { ProductCard } from './ProductCard'
import './products.css'

/**
 * Lists products grouped by category. Each category becomes one step of the
 * multi-step accordion later; for now every group is simply rendered open.
 */
export function ProductsExplorer() {
  const categoriesQuery = useCategories()
  const productsQuery = useProducts()

  if (categoriesQuery.isLoading || productsQuery.isLoading) {
    return <p className="products-status">Loading products…</p>
  }
  if (categoriesQuery.isError || productsQuery.isError) {
    return (
      <p className="products-status products-error">
        Failed to load products. Is the API server running on port 4000?
      </p>
    )
  }

  const categories = [...(categoriesQuery.data ?? [])].sort((a, b) => a.step - b.step)
  const products = productsQuery.data ?? []

  return (
    <div className="products-explorer">
      {categories.map((category) => {
        const items = products.filter((p) => p.category === category.id)
        if (items.length === 0) return null
        return (
          <section key={category.id} className="category-group">
            <h2 className="category-heading">
              <span className="category-step">Step {category.step}</span>
              {category.name}
            </h2>
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
