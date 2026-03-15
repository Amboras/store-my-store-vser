# Product Seed Schema - Quick Reference Card

## Essential Files

| File | Purpose |
|------|---------|
| `product-seed-schema.ts` | Complete schema with types, examples, helpers |
| `README.md` | Detailed documentation and guide |
| `example-usage.ts` | Practical examples and helper functions |
| `sample-products.ts` | Working example with hardcoded data |

## Quick Start (30 seconds)

```typescript
import { ProductSeedData, dollarsToCents, generateSKU } from "./product-seed-schema"

const product: ProductSeedData = {
  title: "My Product",
  description: "Product description here",
  handle: "my-product",
  is_giftcard: false,
  status: "published",
  variants: [{
    title: "Default",
    sku: generateSKU("MYPRODUCT", "001"),
    manage_inventory: true,
    prices: [{ amount: dollarsToCents(29.99), currency_code: "usd" }],
    inventory_quantity: 100
  }]
}
```

## Three Product Patterns

### 1. Simple (No Options)
```typescript
// One variant, no variations
variants: [{ title: "Default", sku: "PROD-001", ... }]
```

### 2. Single Option (e.g., Color)
```typescript
options: [{ title: "Color", values: ["Red", "Blue"] }]
variants: [
  { title: "Red", options: { Color: "Red" }, ... },
  { title: "Blue", options: { Color: "Blue" }, ... }
]
```

### 3. Multiple Options (Size + Color)
```typescript
options: [
  { title: "Size", values: ["S", "M", "L"] },
  { title: "Color", values: ["Red", "Blue"] }
]
// 6 variants: S/Red, S/Blue, M/Red, M/Blue, L/Red, L/Blue
```

## Helper Functions

| Function | Use Case | Example |
|----------|----------|---------|
| `dollarsToCents(29.99)` | Convert dollars to cents | `2999` |
| `generateSKU("SHIRT", "L", "BLK")` | Create SKU code | `"SHIRT-L-BLK"` |
| `generateHandle("Cool T-Shirt")` | URL-friendly slug | `"cool-t-shirt"` |
| `generateVariantCombinations(options)` | All option combos | `[{Size:"S",Color:"Red"}, ...]` |

## Price Format (IMPORTANT!)

```typescript
// ✅ CORRECT - Prices in cents
{ amount: 2999, currency_code: "usd" }  // $29.99

// ❌ WRONG - Don't use decimals
{ amount: 29.99, currency_code: "usd" } // This is $0.30!

// 💡 USE HELPER
{ amount: dollarsToCents(29.99), currency_code: "usd" }
```

## Common Currency Codes

- `"usd"` - US Dollar
- `"eur"` - Euro
- `"gbp"` - British Pound
- `"cad"` - Canadian Dollar
- `"aud"` - Australian Dollar
- `"jpy"` - Japanese Yen

## Required Fields

### Product
- ✅ `title` - Product name
- ✅ `description` - Description
- ✅ `handle` - URL slug (unique!)
- ✅ `status` - "published" | "draft" | "proposed"
- ✅ `variants` - At least one variant

### Variant
- ✅ `title` - Variant name
- ✅ `sku` - Stock keeping unit
- ✅ `manage_inventory` - true/false
- ✅ `prices` - At least one price

## Optional but Recommended

- `subtitle` - Short tagline
- `thumbnail` - Main image URL
- `images` - Array of product images
- `options` - For products with variants
- `inventory_quantity` - Starting stock
- `metadata` - Custom key-value data
- `tags` - For filtering

## Handle Rules

```typescript
// ✅ GOOD
"premium-cotton-tshirt"
"wireless-headphones"
"coffee-mug"

// ❌ BAD
"Premium T-Shirt"      // Not lowercase
"wireless_headphones"  // Use -, not _
"coffee mug"           // No spaces
```

## Multi-Variant Checklist

When creating products with options:

1. ✅ Define `options` array with title and values
2. ✅ Create variant for EVERY combination
3. ✅ Each variant has `options` object matching all option titles
4. ✅ Option values in variants match option.values array
5. ✅ Use `generateVariantCombinations()` for many combos

## Example: Generating Variants

```typescript
const options = [
  { title: "Size", values: ["S", "M", "L"] },
  { title: "Color", values: ["Black", "White"] }
]

// Generates 6 combinations automatically
const combos = generateVariantCombinations(options)

const variants = combos.map(opts => ({
  title: `${opts.Size} / ${opts.Color}`,
  sku: generateSKU("TSHIRT", opts.Size, opts.Color),
  options: opts,
  prices: [{ amount: dollarsToCents(29.99), currency_code: "usd" }],
  manage_inventory: true,
  inventory_quantity: 30
}))
```

## Seed Function Features

The `seedProducts()` function automatically:
- ✅ Checks if product exists (by handle)
- ✅ Skips duplicates
- ✅ Logs progress
- ✅ Handles errors gracefully
- ✅ Shows summary stats

```
🌱 Starting product seed...
✅ Created product: "Coffee Mug" (coffee-mug)
⏭️  Product "T-Shirt" already exists, skipping...

📊 Seed Summary:
   ✅ Created: 1
   ⏭️  Skipped: 1
   ❌ Failed: 0
   📦 Total: 2
```

## Common Mistakes to Avoid

| ❌ Mistake | ✅ Fix |
|-----------|-------|
| Prices in dollars (29.99) | Use cents (2999) or `dollarsToCents(29.99)` |
| Handles with spaces | Use hyphens: "my-product" |
| Missing variant options | Every variant needs all options defined |
| Non-unique handles | Each product needs unique handle |
| Forgetting manage_inventory | Set to `true` for physical products |
| Empty variants array | Must have at least one variant |

## Testing Workflow

1. Create 1 test product
2. Run `npm run seed`
3. Check Medusa admin (http://localhost:9000/app)
4. Verify product appears correctly
5. Test adding to cart
6. Add more products

## File Structure Template

```typescript
// your-products.ts
import { MedusaContainer } from "@medusajs/framework/types"
import { ProductSeedData, seedProducts, dollarsToCents } from "./product-seed-schema"

export default async function seedYourProducts(container: MedusaContainer) {
  const products: ProductSeedData[] = [
    // Your products here
  ]

  await seedProducts(container)
}
```

## Resources

- **Full Schema**: `product-seed-schema.ts`
- **Documentation**: `README.md`
- **Examples**: `example-usage.ts`
- **Working Seed**: `sample-products.ts`

## Need Help?

1. Check the schema examples in `product-seed-schema.ts`
2. Review practical examples in `example-usage.ts`
3. Read detailed docs in `README.md`
4. Look at working code in `sample-products.ts`

---

**Pro Tips:**

💡 Use helper functions to avoid typos
💡 Start simple, add complexity later
💡 Test with one product first
💡 Use realistic data for testing
💡 Check admin after each seed
💡 Keep SKUs consistent
💡 Add metadata for flexibility
💡 Include multiple images

**Remember:** Prices in CENTS, handles with HYPHENS, variants need OPTIONS!
