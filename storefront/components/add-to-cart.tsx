'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'

interface AddToCartProps {
  variant: any
  showQuantity?: boolean
}

export default function AddToCart({ variant, showQuantity = true }: AddToCartProps) {
  const { addItem, isAddingItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const price = variant.calculated_price
  const formattedPrice = price && price.calculated_amount != null
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency_code?.toUpperCase() || 'USD',
      }).format(price.calculated_amount / 100)
    : ''

  const handleAddToCart = () => {
    addItem(
      { variantId: variant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          setTimeout(() => setJustAdded(false), 2000)
        },
      }
    )
  }

  const isOutOfStock = variant.inventory_quantity != null && variant.inventory_quantity <= 0

  return (
    <div className="space-y-4">
      {showQuantity && !isOutOfStock && (
        <div className="flex items-center gap-4">
          <label htmlFor="quantity" className="font-semibold text-gray-900">
            Quantity:
          </label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 border-x border-gray-300 px-3 py-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isAddingItem || isOutOfStock}
        className="w-full rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isAddingItem ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Adding...
          </span>
        ) : justAdded ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added to Cart!
          </span>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : (
          `Add to Cart${formattedPrice ? ` - ${formattedPrice}` : ''}`
        )}
      </button>

      {variant.inventory_quantity != null && variant.inventory_quantity > 0 && variant.inventory_quantity < 10 && (
        <p className="text-sm text-amber-600">
          Only {variant.inventory_quantity} left in stock
        </p>
      )}
    </div>
  )
}
