'use client'

import { useQuery } from '@tanstack/react-query'
import { medusaClient } from '@/lib/medusa-client'

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      try {
        const response = await medusaClient.store.product.list({
          handle,
        })

        const product = response.products?.[0]

        if (!product) {
          throw new Error('Product not found')
        }

        return product
      } catch (error) {
        console.error(`Error fetching product ${handle}:`, error)
        throw error
      }
    },
    enabled: !!handle,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
