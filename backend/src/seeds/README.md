# Product Seed Schema Guide

This directory contains schema definitions and utilities for seeding products into Medusa v2.

## Files

- **`product-seed-schema.ts`** - Complete TypeScript schema with interfaces, examples, and helper utilities
- **`sample-products.ts`** - Example implementation with hardcoded sample products

## For AI Agents

The `product-seed-schema.ts` file is your complete reference for creating product seed scripts. It contains:

### 1. Type Definitions
- `ProductSeedData` - Main product interface
- `ProductVariant` - Variant interface with pricing and inventory
- `ProductOption` - Options for creating variants
- `ProductPrice` - Multi-currency pricing
- `ProductImage` - Product images

### 2. Schema Examples
Three complete examples showing different product patterns:

- **`SIMPLE_PRODUCT_SCHEMA_EXAMPLE`** - Single variant, no options
- **`SINGLE_OPTION_PRODUCT_SCHEMA_EXAMPLE`** - Multiple variants with one option (e.g., color)
- **`MULTI_OPTION_PRODUCT_SCHEMA_EXAMPLE`** - Complex variants with multiple options (e.g., size + color)

### 3. Seed Function Template
A ready-to-use `seedProducts()` function with:
- Duplicate checking (by handle)
- Error handling
- Progress logging
- Summary statistics

### 4. Helper Utilities
- `generateVariantCombinations()` - Generate all option combinations
- `dollarsToCents()` - Convert prices to cents
- `generateSKU()` - Create SKU codes
- `generateHandle()` - Generate URL-friendly handles

## Quick Start

### Step 1: Import the Schema

```typescript
import {
  ProductSeedData,
  SIMPLE_PRODUCT_SCHEMA_EXAMPLE,
  dollarsToCents,
  generateSKU
} from "./product-seed-schema"
```

### Step 2: Define Your Products

Use one of the schema examples as a template:

```typescript
const myProducts: ProductSeedData[] = [
  {
    title: "My Product",
    description: "Product description",
    handle: "my-product",
    is_giftcard: false,
    status: "published",
    variants: [
      {
        title: "Default",
        sku: generateSKU("MYPRODUCT", "001"),
        manage_inventory: true,
        prices: [{ amount: dollarsToCents(29.99), currency_code: "usd" }],
        inventory_quantity: 100
      }
    ]
  }
]
```

### Step 3: Create Seed File

Create a new file (e.g., `my-store-products.ts`):

```typescript
import { MedusaContainer } from "@medusajs/framework/types"
import { ProductSeedData, seedProducts } from "./product-seed-schema"

export default async function seedMyStoreProducts(container: MedusaContainer) {
  const products: ProductSeedData[] = [
    // Your products here
  ]

  await seedProducts(container)
}
```

### Step 4: Run the Seed

```bash
npm run seed
```

## Product Patterns

### Pattern 1: Simple Product (No Variants)

Perfect for: Single items, digital products, services

```typescript
{
  title: "Coffee Mug",
  description: "Ceramic coffee mug",
  handle: "coffee-mug",
  is_giftcard: false,
  status: "published",
  variants: [
    {
      title: "Default",
      sku: "MUG-001",
      manage_inventory: true,
      prices: [{ amount: 1499, currency_code: "usd" }],
      inventory_quantity: 100
    }
  ]
}
```

### Pattern 2: Single Option (e.g., Color Only)

Perfect for: Products with one type of variation

```typescript
{
  title: "Water Bottle",
  handle: "water-bottle",
  options: [
    { title: "Color", values: ["Blue", "Green", "Red"] }
  ],
  variants: [
    {
      title: "Blue",
      sku: "BOTTLE-BLU",
      options: { Color: "Blue" },
      prices: [{ amount: 1999, currency_code: "usd" }],
      manage_inventory: true,
      inventory_quantity: 50
    },
    // ... repeat for Green and Red
  ]
}
```

### Pattern 3: Multiple Options (e.g., Size + Color)

Perfect for: Clothing, shoes, complex products

```typescript
{
  title: "T-Shirt",
  handle: "t-shirt",
  options: [
    { title: "Size", values: ["S", "M", "L"] },
    { title: "Color", values: ["Black", "White"] }
  ],
  variants: [
    {
      title: "S / Black",
      sku: "TSHIRT-S-BLK",
      options: { Size: "S", Color: "Black" },
      prices: [{ amount: 2999, currency_code: "usd" }],
      manage_inventory: true,
      inventory_quantity: 25
    },
    // ... 5 more variants (S/White, M/Black, M/White, L/Black, L/White)
  ]
}
```

## Generating Variants Programmatically

For products with many option combinations, use the helper:

```typescript
import { generateVariantCombinations, generateSKU } from "./product-seed-schema"

const options = [
  { title: "Size", values: ["S", "M", "L", "XL"] },
  { title: "Color", values: ["Black", "White", "Navy"] }
]

const combinations = generateVariantCombinations(options)
// Returns 12 combinations (4 sizes × 3 colors)

const variants = combinations.map((options, index) => ({
  title: `${options.Size} / ${options.Color}`,
  sku: generateSKU("TSHIRT", options.Size, options.Color),
  options,
  manage_inventory: true,
  prices: [{ amount: 2999, currency_code: "usd" }],
  inventory_quantity: 30
}))
```

## Common Fields Reference

### Required Fields
- `title` - Product name
- `handle` - URL slug (must be unique)
- `description` - Product description
- `status` - "published", "draft", or "proposed"
- `variants` - Array of at least one variant

### Variant Required Fields
- `title` - Variant name
- `sku` - Stock keeping unit (should be unique)
- `manage_inventory` - true/false
- `prices` - Array of at least one price

### Optional but Recommended
- `subtitle` - Short tagline
- `thumbnail` - Main image URL
- `images` - Array of product images
- `options` - For products with variants
- `metadata` - Custom key-value data
- `tags` - For filtering and search

## Price Format

**IMPORTANT**: Prices are in the smallest currency unit (cents for USD)

```typescript
// ✅ Correct
prices: [{ amount: 2999, currency_code: "usd" }]  // $29.99

// ❌ Wrong
prices: [{ amount: 29.99, currency_code: "usd" }] // This is $0.2999!

// Use helper
prices: [{ amount: dollarsToCents(29.99), currency_code: "usd" }]
```

### Multi-Currency Pricing

```typescript
prices: [
  { amount: 2999, currency_code: "usd" },  // $29.99
  { amount: 2499, currency_code: "eur" },  // €24.99
  { amount: 2399, currency_code: "gbp" },  // £23.99
]
```

## Handle Format

Handles must be:
- Lowercase
- Only letters, numbers, and hyphens
- No spaces or special characters
- Unique across all products

```typescript
// ✅ Good handles
"premium-cotton-tshirt"
"wireless-headphones-pro"
"coffee-mug-ceramic"

// ❌ Bad handles
"Premium T-Shirt"           // Not lowercase
"wireless_headphones"       // Use hyphens, not underscores
"coffee mug"                // No spaces
"t-shirt@home"             // No special characters
```

Use the helper:
```typescript
generateHandle("Premium Cotton T-Shirt") // Returns "premium-cotton-tshirt"
```

## Validation Checklist

Before running your seed:

- [ ] All products have unique handles
- [ ] All prices are in cents (not dollars)
- [ ] All variants have SKUs
- [ ] Products with options have matching variant options
- [ ] All option values match the defined option.values array
- [ ] Images use HTTPS URLs
- [ ] At least one variant per product
- [ ] `manage_inventory: true` for physical products
- [ ] Inventory quantities are set

## Error Handling

The seed function will:
- ✅ Skip products that already exist (by handle)
- ✅ Log success/failure for each product
- ✅ Show summary statistics
- ✅ Continue on errors (won't stop entire seed)

Example output:
```
🌱 Starting product seed...
✅ Created product: "Coffee Mug" (coffee-mug)
⏭️  Product "Water Bottle" (water-bottle) already exists, skipping...
❌ Failed to create product "T-Shirt": Invalid handle

📊 Seed Summary:
   ✅ Created: 1
   ⏭️  Skipped: 1
   ❌ Failed: 1
   📦 Total: 3
```

## Advanced: Metadata

Add custom data for filtering, analytics, or custom features:

```typescript
metadata: {
  material: "100% Cotton",
  care_instructions: "Machine wash cold",
  eco_friendly: "true",
  made_in: "USA",
  collection: "Summer 2024"
}
```

Access in storefront:
```typescript
const material = product.metadata?.material
```

## Tips for AI Agents

1. **Start Simple**: Begin with simple products (no variants) to test
2. **Use Helpers**: The utility functions prevent common mistakes
3. **Validate Data**: Check all required fields before running
4. **Test Incrementally**: Add one product, test, then add more
5. **Check Admin**: Verify products in Medusa admin after seeding
6. **Unique Handles**: Always check handle uniqueness
7. **Realistic Data**: Use real-looking prices, quantities, and descriptions
8. **Images**: Use Unsplash or placeholder services for testing

## Example: Complete Workflow

```typescript
import { MedusaContainer } from "@medusajs/framework/types"
import {
  ProductSeedData,
  seedProducts,
  dollarsToCents,
  generateSKU,
  generateHandle
} from "./product-seed-schema"

export default async function seedMyProducts(container: MedusaContainer) {
  const products: ProductSeedData[] = [
    {
      title: "Organic Coffee - Dark Roast",
      subtitle: "Fair Trade, Single Origin",
      description: "Rich, full-bodied dark roast coffee from Colombia. Fair trade certified and sustainably sourced.",
      handle: generateHandle("Organic Coffee - Dark Roast"),
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",

      options: [
        { title: "Size", values: ["12oz", "1lb", "2lb"] }
      ],

      variants: [
        {
          title: "12oz",
          sku: generateSKU("COFFEE", "DARK", "12OZ"),
          manage_inventory: true,
          prices: [{ amount: dollarsToCents(14.99), currency_code: "usd" }],
          options: { Size: "12oz" },
          inventory_quantity: 100,
          weight: 340 // grams
        },
        {
          title: "1lb",
          sku: generateSKU("COFFEE", "DARK", "1LB"),
          manage_inventory: true,
          prices: [{ amount: dollarsToCents(24.99), currency_code: "usd" }],
          options: { Size: "1lb" },
          inventory_quantity: 75,
          weight: 454
        },
        {
          title: "2lb",
          sku: generateSKU("COFFEE", "DARK", "2LB"),
          manage_inventory: true,
          prices: [{ amount: dollarsToCents(44.99), currency_code: "usd" }],
          options: { Size: "2lb" },
          inventory_quantity: 50,
          weight: 908
        }
      ],

      images: [
        { url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd", alt: "Coffee bag" }
      ],

      metadata: {
        origin: "Colombia",
        roast_level: "Dark",
        fair_trade: "true",
        organic: "true"
      },

      tags: ["coffee", "organic", "fair-trade", "dark-roast"]
    }
  ]

  await seedProducts(container)
}
```

## Running Seeds

```bash
# Run all seeds
npm run seed

# Run specific seed file
# (configure in medusa-config.js)
```

## Resources

- [Medusa Product Documentation](https://docs.medusajs.com/resources/references/product/models/Product)
- [Medusa Admin API](https://docs.medusajs.com/resources/medusa-admin-api/products)
- [ISO 4217 Currency Codes](https://en.wikipedia.org/wiki/ISO_4217)

---

**Need Help?**
- Check the `product-seed-schema.ts` file for detailed JSDoc comments
- Review the three schema examples for different product types
- Use the helper utilities to avoid common mistakes
- Test with one product first before creating many
