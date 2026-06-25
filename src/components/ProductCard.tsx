import { useState } from 'react'
import type { Product } from '../api/products'
import './products.css'

interface ProductCardProps {
  product: Product
  /** Notified when the user changes variant or quantity (for the future cart/preview). */
  onSelectionChange?: (selection: {
    productId: string
    variantId: string
    quantity: number
  }) => void
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return null
  return Math.round((1 - price / compareAt) * 100)
}

export function ProductCard({ product, onSelectionChange }: ProductCardProps) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)

  const savePercent = discountPercent(product.price, product.compareAtPrice)

  function update(next: { variantId?: string; quantity?: number }) {
    const variant = next.variantId ?? variantId
    const qty = next.quantity ?? quantity
    if (next.variantId !== undefined) setVariantId(next.variantId)
    if (next.quantity !== undefined) setQuantity(next.quantity)
    onSelectionChange?.({ productId: product.id, variantId: variant, quantity: qty })
  }

  return (
    <article className="product-card">
      <div className="product-media">
        {savePercent !== null && (
          <span className="discount-badge">Save {savePercent}%</span>
        )}
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="product-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <a
          className="product-learn-more"
          href={product.learnMoreUrl}
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>

        <div className="product-controls">
          {product.variants.length > 1 && (
            <label className="variant-selector">
              <span>Variant</span>
              <select
                value={variantId}
                onChange={(e) => update({ variantId: e.target.value })}
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="quantity-stepper" role="group" aria-label="Quantity">
            <button
              type="button"
              onClick={() => update({ quantity: Math.max(1, quantity - 1) })}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => update({ quantity: quantity + 1 })}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="product-pricing">
          {product.compareAtPrice && (
            <span className="compare-at-price">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
          <span className="active-price">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
      </div>
    </article>
  )
}
