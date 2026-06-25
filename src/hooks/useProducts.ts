import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateProduct,
  type NewProduct,
} from '../api/products'

const PRODUCTS_KEY = ['products']
const CATEGORIES_KEY = ['categories']

export function useProducts(category?: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, category ?? 'all'],
    queryFn: () => fetchProducts(category),
  })
}

export function useCategories() {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: fetchCategories })
}

/** Refresh product lists after any create/update/delete. */
function useRefreshProducts() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
}

export function useCreateProduct() {
  const refresh = useRefreshProducts()
  return useMutation({
    mutationFn: (input: NewProduct) => createProduct(input),
    onSuccess: refresh,
  })
}

export function useUpdateProduct() {
  const refresh = useRefreshProducts()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<NewProduct> }) =>
      updateProduct(id, patch),
    onSuccess: refresh,
  })
}

export function useDeleteProduct() {
  const refresh = useRefreshProducts()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: refresh,
  })
}
