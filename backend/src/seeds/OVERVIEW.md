# Product Seed Schema - Complete Overview

## What This Is

A comprehensive TypeScript schema system for seeding products into Medusa v2. This is NOT hardcoded data - it's a **template and framework** that AI agents can use to create product seeds programmatically.

## Files Created

```
backend/src/seeds/
├── product-seed-schema.ts    # 1,043 lines - Complete schema with types and examples
├── example-usage.ts           # 488 lines  - Practical helper functions and patterns
├── sample-products.ts         # 457 lines  - Working example with hardcoded data
├── README.md                  # 441 lines  - Detailed documentation
├── QUICK_REFERENCE.md         # 244 lines  - Quick reference card
├── OVERVIEW.md                # This file  - High-level overview
└── index.ts                   # Exports for easy importing
```

**Total:** ~2,700+ lines of documentation, types, examples, and utilities

## Key Features

### 1. Complete Type System
- `ProductSeedData` - Main product interface
- `ProductVariant` - Variant with pricing, inventory, options
- `ProductOption` - Size, color, material variations
- `ProductPrice` - Multi-currency pricing
- `ProductImage` - Product images with alt text

### 2. Three Schema Patterns

**Simple Products** (no variants)
```typescript
const mug = SIMPLE_PRODUCT_SCHEMA_EXAMPLE
// One variant, single SKU
```

**Single Option Products** (e.g., colors)
```typescript
const bottle = SINGLE_OPTION_PRODUCT_SCHEMA_EXAMPLE
// Multiple colors, same price
```

**Multi-Option Products** (e.g., size + color)
```typescript
const tshirt = MULTI_OPTION_PRODUCT_SCHEMA_EXAMPLE
// 4 sizes × 3 colors = 12 variants
```

### 3. Helper Utilities

**Price Conversion**
```typescript
dollarsToCents(29.99) // Returns 2999
```

**SKU Generation**
```typescript
generateSKU("TSHIRT", "L", "BLK") // Returns "TSHIRT-L-BLK"
```

**Handle Generation**
```typescript
generateHandle("Premium T-Shirt") // Returns "premium-t-shirt"
```

**Variant Combinations**
```typescript
generateVariantCombinations([
  { title: "Size", values: ["S", "M", "L"] },
  { title: "Color", values: ["Red", "Blue"] }
])
// Returns 6 combinations: S/Red, S/Blue, M/Red, M/Blue, L/Red, L/Blue
```

### 4. Smart Seed Function

The `seedProducts()` function includes:
- ✅ Duplicate checking (by handle)
- ✅ Skip existing products
- ✅ Error handling per product
- ✅ Progress logging
- ✅ Summary statistics

### 5. Detailed Documentation

Every interface has:
- JSDoc comments explaining purpose
- Parameter descriptions
- Usage examples
- Best practices
- Common mistakes to avoid

### 6. Practical Examples

`example-usage.ts` provides ready-to-use helper functions:
- `createSimpleProduct()` - For basic products
- `createColorVariantProduct()` - For products with colors
- `createClothingProduct()` - For apparel with size + color
- `createProductSet()` - For quantity bundles
- `createLimitedEdition()` - For special releases
- `createGlobalProduct()` - For multi-currency products

## How AI Agents Should Use This

### Step 1: Understand the Schema
Read `product-seed-schema.ts` to understand:
- Required vs optional fields
- Price format (cents, not dollars)
- Handle format (lowercase, hyphens)
- Variant requirements

### Step 2: Choose a Pattern
- No variations? → Use `SIMPLE_PRODUCT_SCHEMA_EXAMPLE`
- One variation? → Use `SINGLE_OPTION_PRODUCT_SCHEMA_EXAMPLE`
- Multiple variations? → Use `MULTI_OPTION_PRODUCT_SCHEMA_EXAMPLE`

### Step 3: Create Product Data
```typescript
import { ProductSeedData, dollarsToCents, generateSKU } from "./seeds"

const product: ProductSeedData = {
  title: "My Product",
  description: "Product description",
  handle: "my-product",
  is_giftcard: false,
  status: "published",
  variants: [{
    title: "Default",
    sku: generateSKU("MYPRODUCT"),
    manage_inventory: true,
    prices: [{ amount: dollarsToCents(29.99), currency_code: "usd" }],
    inventory_quantity: 100
  }]
}
```

### Step 4: Use Helper Functions
Don't reinvent the wheel - use the provided helpers from `example-usage.ts`:
```typescript
import { createSimpleProduct } from "./example-usage"

const mug = createSimpleProduct(
  "Coffee Mug",
  "Ceramic mug perfect for coffee",
  12.99,
  "https://example.com/mug.jpg",
  100
)
```

### Step 5: Test Incrementally
1. Create 1 product
2. Run `npm run seed`
3. Check Medusa admin
4. Verify it works
5. Add more products

## Quick Reference

### Prices (CRITICAL!)
```typescript
// ✅ CORRECT - Prices in cents
{ amount: 2999, currency_code: "usd" }  // $29.99

// ❌ WRONG
{ amount: 29.99, currency_code: "usd" } // This is $0.30!

// 💡 USE HELPER
{ amount: dollarsToCents(29.99), currency_code: "usd" }
```

### Handles
```typescript
// ✅ CORRECT
"premium-cotton-tshirt"
"wireless-headphones-pro"

// ❌ WRONG
"Premium T-Shirt"      // Not lowercase
"wireless_headphones"  // Use hyphens
"coffee mug"           // No spaces
```

### Required Fields
**Product:**
- `title`, `description`, `handle`, `status`, `variants`

**Variant:**
- `title`, `sku`, `manage_inventory`, `prices`

### Multi-Variant Rules
1. Define `options` array
2. Create variant for EVERY combination
3. Each variant must have ALL options
4. Use `generateVariantCombinations()` for many combos

## File Guide

| File | Use When |
|------|----------|
| `QUICK_REFERENCE.md` | Need a quick lookup |
| `README.md` | Learning how to use the system |
| `product-seed-schema.ts` | Creating products, need type definitions |
| `example-usage.ts` | Want helper functions or examples |
| `sample-products.ts` | Need a working example to reference |

## Common Tasks

### Task: Create a simple product
→ Use `createSimpleProduct()` from `example-usage.ts`

### Task: Create a t-shirt with sizes and colors
→ Use `createClothingProduct()` from `example-usage.ts`

### Task: Create product with custom options
→ Copy `MULTI_OPTION_PRODUCT_SCHEMA_EXAMPLE`, modify options

### Task: Generate many variants automatically
→ Use `generateVariantCombinations()` helper

### Task: Add multi-currency pricing
→ Add multiple price objects to `prices` array

### Task: Create limited edition product
→ Use `createLimitedEdition()` from `example-usage.ts`

## Validation Checklist

Before running your seed, verify:

- [ ] All products have unique handles
- [ ] Prices are in cents (2999, not 29.99)
- [ ] Handles are lowercase with hyphens
- [ ] SKUs are unique per variant
- [ ] Products with options have matching variant options
- [ ] All variants specify ALL defined options
- [ ] `manage_inventory: true` for physical products
- [ ] At least one variant per product
- [ ] Images use HTTPS URLs

## Error Messages You Might See

**"Product already exists, skipping"**
→ Normal. Product with that handle already in database.

**"Invalid handle"**
→ Handle has spaces or special characters. Use `generateHandle()`.

**"Missing required field"**
→ Check that all required fields are present.

**"Option value not found"**
→ Variant's option value doesn't match option.values array.

## Best Practices

1. **Use Helper Functions** - Avoid manual SKU/handle generation
2. **Start Simple** - Create basic products first
3. **Test Incrementally** - One product at a time
4. **Realistic Data** - Use actual product descriptions and images
5. **Consistent Naming** - Keep SKU format consistent
6. **Add Metadata** - Use for filtering and custom features
7. **Multiple Images** - Include various product angles
8. **Proper Inventory** - Set realistic stock quantities

## Resources

- **Medusa Docs:** https://docs.medusajs.com
- **Product API:** https://docs.medusajs.com/resources/medusa-admin-api/products
- **Currency Codes:** https://en.wikipedia.org/wiki/ISO_4217

## Support for AI Agents

This schema system is designed to be AI-friendly:
- Extensive JSDoc comments
- Multiple complete examples
- Helper utilities for common tasks
- Clear error messages
- Step-by-step guides
- Validation checklists

The goal is to make it easy for AI agents to:
1. Understand the structure
2. Create valid product data
3. Avoid common mistakes
4. Generate realistic test data
5. Scale from simple to complex products

## Version

**Created:** March 15, 2026
**Lines of Code:** ~2,700+
**Files:** 7
**Examples:** 10+
**Helper Functions:** 5

---

**Next Steps:**
1. Read `QUICK_REFERENCE.md` for syntax quick lookup
2. Review `README.md` for detailed documentation
3. Study examples in `product-seed-schema.ts`
4. Use helpers from `example-usage.ts`
5. Create your first product!
