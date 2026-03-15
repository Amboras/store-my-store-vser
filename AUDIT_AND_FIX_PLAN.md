# Ecommerce Template - Complete Audit & Fix Plan

**Date**: 2026-03-15
**Status**: Pre-Implementation Audit

---

## 🔍 Current State Audit

### ✅ What's Working

**1. Infrastructure**
- ✅ Medusa backend setup (PostgreSQL, Redis via Docker)
- ✅ Next.js 15 + React 19 storefront
- ✅ Tailwind CSS configured
- ✅ `@medusajs/js-sdk` installed
- ✅ `@tanstack/react-query` for data fetching
- ✅ Medusa client configured (`storefront/lib/medusa-client.ts`)
- ✅ `make dev` runs both backend + storefront
- ✅ `make type-check` now passes (after cleanup)

**2. Project Structure**
```
ecom-starter-template/
├── backend/              ✅ Medusa v2 configured
│   ├── medusa-config.ts  ✅ Working
│   ├── docker-compose.yml ✅ PostgreSQL + Redis
│   └── src/              ✅ Basic structure
├── storefront/           ✅ Next.js 15
│   ├── app/
│   │   ├── layout.tsx    ✅ Root layout
│   │   ├── page.tsx      ✅ Homepage (minimal)
│   │   └── providers.tsx ✅ TanStack Query provider
│   └── lib/
│       └── medusa-client.ts ✅ Properly configured
├── .claude/              ✅ Commands & agents defined
└── Makefile              ✅ Dev commands working
```

---

### ❌ Critical Issues

**1. No Product Data Flow**
- ❌ Backend has NO products in database (empty Medusa)
- ❌ No seed data script
- ❌ Storefront homepage shows static text only
- ❌ No components to display products
- ❌ No hooks to fetch from Medusa

**2. Missing Core Functionality**
- ❌ No ProductGrid component
- ❌ No ProductCard component
- ❌ No product detail pages
- ❌ No cart functionality
- ❌ No checkout flow
- ❌ No data fetching hooks (`useProducts`, `useCart`)

**3. Broken `/implement-plan` Workflow**
The current agents will:
- ❌ Try to create pages that won't connect to Medusa
- ❌ May create hardcoded mock data
- ❌ Won't verify the implementation works end-to-end
- ❌ No automated testing after implementation

**4. No Verification After Implementation**
Current `/implement-plan` doesn't:
- ❌ Run `make type-check` to verify
- ❌ Test API connections
- ❌ Check if products load
- ❌ Iterate and fix issues
- ❌ Verify cart works

---

## 🎯 What a Proper Implementation Should Do

### **Phase 1: Backend Setup (medusa-configurator agent)**

**1. Create Seed Data Script**
```typescript
// backend/src/seeds/sample-products.ts
export default async function seedSampleProducts() {
  const productService = container.resolve("productService")

  const products = [
    {
      title: "Sample Product 1",
      description: "This is a sample product",
      handle: "sample-product-1",
      variants: [{
        title: "Default",
        prices: [{ amount: 2999, currency_code: "usd" }],
        inventory_quantity: 100
      }]
    },
    // ... more products
  ]

  for (const product of products) {
    await productService.create(product)
  }
}
```

**2. Configure Regions**
```typescript
// backend/medusa-config.ts
{
  regions: [
    {
      name: "United States",
      currency_code: "usd",
      countries: ["us"],
      payment_providers: ["stripe"]
    }
  ]
}
```

**3. Run Migrations & Seeds**
```bash
cd backend
npm run migrate
npm run seed
```

---

### **Phase 2: Storefront Data Layer (storefront-generator agent)**

**1. Create Data Fetching Hooks**

**`storefront/hooks/use-products.ts`:**
```typescript
'use client'
import { useQuery } from '@tanstack/react-query'
import { medusaClient } from '@/lib/medusa-client'

export function useProducts(limit?: number) {
  return useQuery({
    queryKey: ['products', limit],
    queryFn: async () => {
      const { products } = await medusaClient.store.product.list({
        limit: limit || 100
      })
      return products
    }
  })
}
```

**`storefront/hooks/use-product.ts`:**
```typescript
'use client'
import { useQuery } from '@tanstack/react-query'
import { medusaClient } from '@/lib/medusa-client'

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const { products } = await medusaClient.store.product.list({ handle })
      return products?.[0]
    },
    enabled: !!handle
  })
}
```

**`storefront/hooks/use-cart.ts`:**
```typescript
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { medusaClient } from '@/lib/medusa-client'

export function useCart() {
  const queryClient = useQueryClient()

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cartId = localStorage.getItem('cart_id')

      if (cartId) {
        try {
          const { cart } = await medusaClient.store.cart.retrieve(cartId)
          return cart
        } catch {
          // Cart not found
        }
      }

      const { cart } = await medusaClient.store.cart.create()
      localStorage.setItem('cart_id', cart.id)
      return cart
    }
  })

  const addItem = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      if (!cart) throw new Error('No cart')
      const { cart: updated } = await medusaClient.store.cart.addLineItem(cart.id, {
        variant_id: variantId,
        quantity
      })
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })

  return { cart, isLoading, addItem: addItem.mutate }
}
```

**2. Create Components**

**`storefront/components/product-grid.tsx`:**
```typescript
'use client'
import { useProducts } from '@/hooks/use-products'
import ProductCard from './product-card'

export default function ProductGrid({ limit = 8 }: { limit?: number }) {
  const { data: products, isLoading, error } = useProducts(limit)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error loading products</div>
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products available yet. Add products in the Medusa admin dashboard.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

**`storefront/components/product-card.tsx`:**
```typescript
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@medusajs/client-types'

export default function ProductCard({ product }: { product: Product }) {
  const price = product.variants[0]?.prices[0]

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="relative aspect-square mb-4 overflow-hidden rounded bg-gray-100">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>
      <h3 className="font-semibold mb-1">{product.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.subtitle}</p>
      {price && (
        <p className="font-bold text-primary">
          ${(price.amount / 100).toFixed(2)}
        </p>
      )}
    </Link>
  )
}
```

**`storefront/components/add-to-cart.tsx`:**
```typescript
'use client'
import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import type { ProductVariant } from '@medusajs/client-types'

export default function AddToCart({ variant }: { variant: ProductVariant }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({ variantId: variant.id, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const price = variant.prices[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="border rounded px-3 py-2 w-20"
        />
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-primary text-white px-6 py-3 rounded font-semibold hover:bg-primary-dark transition"
      >
        {added ? '✓ Added to Cart!' : `Add to Cart - $${(price.amount / 100).toFixed(2)}`}
      </button>
    </div>
  )
}
```

**3. Update Homepage**

**`storefront/app/page.tsx`:**
```typescript
import ProductGrid from '@/components/product-grid'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Your Store
        </h1>
        <p className="text-xl text-gray-600">
          Powered by Medusa - Ready to customize
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <ProductGrid limit={8} />
      </section>
    </main>
  )
}
```

**4. Create Product Detail Page**

**`storefront/app/products/[handle]/page.tsx`:**
```typescript
import { notFound } from 'next/navigation'
import { medusaClient } from '@/lib/medusa-client'
import Image from 'next/image'
import AddToCart from '@/components/add-to-cart'

async function getProduct(handle: string) {
  try {
    const { products } = await medusaClient.store.product.list({ handle })
    return products?.[0]
  } catch {
    return null
  }
}

export default async function ProductPage({
  params
}: {
  params: { handle: string }
}) {
  const product = await getProduct(params.handle)

  if (!product) notFound()

  const variant = product.variants[0]
  const price = variant.prices[0]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-gray-100 rounded">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          {product.subtitle && (
            <p className="text-xl text-gray-600 mb-6">{product.subtitle}</p>
          )}
          <p className="text-3xl font-bold text-primary mb-8">
            ${(price.amount / 100).toFixed(2)}
          </p>
          <p className="text-gray-700 mb-8">{product.description}</p>

          <AddToCart variant={variant} />
        </div>
      </div>
    </div>
  )
}
```

---

### **Phase 3: Theme Customization (theme-customizer agent)**

Apply design tokens from PLAN.md:
- Colors to Tailwind config
- Typography (Google Fonts)
- Spacing & border radius

---

### **Phase 4: Automated Verification (NEW!)**

After agents complete, automatically:

**1. Type Check**
```bash
make type-check
# MUST pass - no TypeScript errors
```

**2. Build Test**
```bash
make build
# MUST succeed
```

**3. Start Services & Test APIs**
```bash
# Start backend + storefront
make dev (in background)

# Wait for startup (10 seconds)
sleep 10

# Test Backend API
curl http://localhost:9000/health
curl http://localhost:9000/store/products

# Test Storefront
curl http://localhost:3000

# Check logs for errors
make tail-log | grep -i error
```

**4. Verify Data Flow**
- Check products load from Medusa
- Verify no hardcoded data
- Test cart API endpoints
- Ensure proper error handling

**5. If Issues Found - Auto-Fix**
- Read error logs
- Identify issue
- Fix the problem
- Re-run verification
- Iterate until working

**6. Report Completion**
Only after ALL verifications pass:
```markdown
✅ Store Implementation Complete

**Verified:**
- ✅ TypeScript: No errors
- ✅ Build: Success
- ✅ Backend API: Responding
- ✅ Products: X products loaded from database
- ✅ Storefront: Rendering correctly
- ✅ Cart: Working

**Services:**
- Backend: http://localhost:9000
- Admin: http://localhost:9000/app
- Storefront: http://localhost:3000

**Next Steps:**
1. Add products in admin dashboard
2. Customize theme with /edit-store
3. Deploy with /deploy-store
```

---

## 🔧 Fixes Needed

### 1. Update Claude Agents

**`.claude/agents/storefront-generator.md`:**
- ✅ Already uses `storefront/` not `generated-stores/`
- ❌ Add verification steps
- ❌ Add "test API connection" step
- ❌ Add error handling for empty product list

**`.claude/commands/implement-store.md`:**
- ❌ Add Phase 4: Automated Verification
- ❌ Add "Start services and test" step
- ❌ Add "Iterate until working" step
- ❌ No completion message until verified

### 2. Create Seed Data Script

**`backend/src/seeds/sample-products.ts`** - Create with sample products

### 3. Update Makefile

Add verification command:
```makefile
verify:
	@echo "🔍 Verifying implementation..."
	@make type-check
	@echo "✅ Type check passed"
	@make build
	@echo "✅ Build passed"
```

### 4. Update CLAUDE.md

Document:
- Proper data flow (Medusa → API → Storefront)
- No hardcoded products allowed
- Automated verification requirements
- Best practices for hooks and components

---

## 📋 Implementation Checklist

- [ ] Fix type-check (✅ DONE - added placeholder file)
- [ ] Remove empty page directories (✅ DONE)
- [ ] Create seed data script
- [ ] Create data fetching hooks (useProducts, useProduct, useCart)
- [ ] Create core components (ProductGrid, ProductCard, AddToCart)
- [ ] Update homepage to use ProductGrid
- [ ] Create product detail page
- [ ] Update agents to include verification
- [ ] Update implement-store command workflow
- [ ] Add automated testing after implementation
- [ ] Update CLAUDE.md documentation
- [ ] Test complete flow: /create-plan → /implement-plan → working store

---

## 🎯 Success Criteria

A successful `/implement-plan` should:
1. ✅ Create proper Medusa integration (no hardcoded data)
2. ✅ Pass `make type-check` with zero errors
3. ✅ Pass `make build` successfully
4. ✅ Start services with `make dev`
5. ✅ Show products from database on storefront
6. ✅ Cart functionality works end-to-end
7. ✅ Auto-verify and fix issues
8. ✅ Report completion only when everything works

---

**Next Action**: Implement these fixes systematically, starting with seed data and core hooks/components.
