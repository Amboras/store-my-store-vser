// Type definitions for Medusa SDK responses
// Using the actual response types from the SDK

export type Product = {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  handle: string
  thumbnail?: string | null
  variants?: ProductVariant[]
  images?: ProductImage[]
  options?: ProductOption[]
  created_at: string
  updated_at: string
}

export type ProductVariant = {
  id: string
  title: string
  sku?: string | null
  inventory_quantity?: number
  manage_inventory: boolean
  prices?: ProductVariantPrice[]
  options?: Record<string, string>
  product_id: string
  created_at: string
  updated_at: string
}

export type ProductVariantPrice = {
  id: string
  amount: number
  currency_code: string
  variant_id: string
}

export type ProductImage = {
  id: string
  url: string
  created_at: string
  updated_at: string
}

export type ProductOption = {
  id: string
  title: string
  values: string[]
  product_id: string
}

export type Cart = {
  id: string
  items: LineItem[]
  subtotal: number
  total: number
  region_id?: string
  created_at: string
  updated_at: string
}

export type LineItem = {
  id: string
  title: string
  subtitle?: string
  thumbnail?: string | null
  quantity: number
  unit_price: number
  total: number
  variant_id: string
  variant?: ProductVariant
  cart_id: string
  created_at: string
  updated_at: string
}
