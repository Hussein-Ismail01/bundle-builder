import { apiClient } from './client'

export interface Variant {
  id: string
  label: string
}

export interface Product {
  id: string
  category: string
  title: string
  description: string
  image: string
  learnMoreUrl: string
  /** Active selling price. */
  price: number
  /** Optional struck-through "was" price; drives the discount badge. */
  compareAtPrice?: number
  currency: string
  variants: Variant[]
}

export interface Category {
  id: string
  name: string
  step: number
}

/** Fields a client may send when creating a product. */
export type NewProduct = Pick<Product, 'title' | 'category' | 'price'> &
  Partial<Omit<Product, 'id'>>

export async function fetchProducts(category?: string): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products', {
    params: category ? { category } : undefined,
  })
  return data
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

export async function createProduct(input: NewProduct): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', input)
  return data
}

export async function updateProduct(
  id: string,
  patch: Partial<NewProduct>,
): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/products/${id}`, patch)
  return data
}

export async function deleteProduct(id: string): Promise<Product> {
  const { data } = await apiClient.delete<Product>(`/products/${id}`)
  return data
}
