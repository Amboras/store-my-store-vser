/**
 * EXAMPLE: How to Use the Product Seed Schema
 *
 * This file demonstrates practical usage patterns for AI agents.
 * Copy and modify these examples to create your own product seeds.
 */

import { MedusaContainer } from "@medusajs/framework/types"
import {
  ProductSeedData,
  seedProducts,
  generateVariantCombinations,
  dollarsToCents,
  generateSKU,
  generateHandle
} from "./product-seed-schema"

// ============================================================================
// EXAMPLE 1: Creating a Simple Product Programmatically
// ============================================================================

/**
 * Simple product with helper functions
 */
function createSimpleProduct(
  name: string,
  description: string,
  priceUSD: number,
  imageUrl: string,
  stockQuantity: number = 100
): ProductSeedData {
  return {
    title: name,
    description,
    handle: generateHandle(name),
    is_giftcard: false,
    status: "published",
    thumbnail: imageUrl,
    variants: [
      {
        title: "Default",
        sku: generateSKU(name.split(" ")[0], "001"),
        manage_inventory: true,
        prices: [{ amount: dollarsToCents(priceUSD), currency_code: "usd" }],
        inventory_quantity: stockQuantity
      }
    ],
    images: [{ url: imageUrl }]
  }
}

// Usage:
const coffeeGrinder = createSimpleProduct(
  "Burr Coffee Grinder",
  "Professional-grade burr coffee grinder with 15 grind settings for perfect coffee every time.",
  89.99,
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e",
  50
)

// ============================================================================
// EXAMPLE 2: Creating Products with Single Option (e.g., Color)
// ============================================================================

/**
 * Product with color variations
 */
function createColorVariantProduct(
  name: string,
  description: string,
  basePrice: number,
  colors: string[],
  stockPerColor: number = 50
): ProductSeedData {
  return {
    title: name,
    description,
    handle: generateHandle(name),
    is_giftcard: false,
    status: "published",

    options: [
      { title: "Color", values: colors }
    ],

    variants: colors.map(color => ({
      title: color,
      sku: generateSKU(name.split(" ")[0], color),
      manage_inventory: true,
      prices: [{ amount: dollarsToCents(basePrice), currency_code: "usd" }],
      options: { Color: color },
      inventory_quantity: stockPerColor
    })),

    images: [
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" }
    ]
  }
}

// Usage:
const waterBottle = createColorVariantProduct(
  "Insulated Water Bottle",
  "Keep your drinks cold for 24 hours or hot for 12 hours with this double-walled stainless steel water bottle.",
  24.99,
  ["Black", "White", "Blue", "Pink", "Green"],
  75
)

// ============================================================================
// EXAMPLE 3: Creating Products with Multiple Options (Size + Color)
// ============================================================================

/**
 * Product with size and color variations (like clothing)
 */
function createClothingProduct(
  name: string,
  description: string,
  sizes: string[],
  colors: string[],
  basePriceUSD: number,
  xlPremium: number = 3.00
): ProductSeedData {
  const options = [
    { title: "Size", values: sizes },
    { title: "Color", values: colors }
  ]

  // Generate all combinations
  const combinations = generateVariantCombinations(options)

  const variants = combinations.map(optionValues => {
    // Add price premium for XL/XXL sizes
    const isXL = optionValues.Size === "XL" || optionValues.Size === "XXL"
    const price = isXL ? basePriceUSD + xlPremium : basePriceUSD

    return {
      title: `${optionValues.Size} / ${optionValues.Color}`,
      sku: generateSKU(name.split(" ")[0], optionValues.Size, optionValues.Color),
      manage_inventory: true,
      prices: [{ amount: dollarsToCents(price), currency_code: "usd" }],
      options: optionValues,
      inventory_quantity: 30 // Adjust based on popularity
    }
  })

  return {
    title: name,
    description,
    handle: generateHandle(name),
    is_giftcard: false,
    status: "published",
    options,
    variants,
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" }
    ],
    metadata: {
      category: "Apparel",
      material: "Cotton",
      care: "Machine wash cold"
    }
  }
}

// Usage:
const hoodie = createClothingProduct(
  "Premium Cotton Hoodie",
  "Ultra-soft cotton blend hoodie with kangaroo pocket and adjustable drawstring hood. Perfect for layering or casual wear.",
  ["S", "M", "L", "XL"],
  ["Black", "Gray", "Navy"],
  49.99,
  5.00 // $5 premium for XL
)

// ============================================================================
// EXAMPLE 4: Creating Product Bundles or Sets
// ============================================================================

/**
 * Product set with quantity-based pricing
 */
function createProductSet(
  name: string,
  description: string,
  quantities: number[],
  pricePerQuantity: { [key: number]: number }
): ProductSeedData {
  return {
    title: name,
    description,
    handle: generateHandle(name),
    is_giftcard: false,
    status: "published",

    options: [
      { title: "Quantity", values: quantities.map(q => `${q} Pack`) }
    ],

    variants: quantities.map(qty => ({
      title: `${qty} Pack`,
      sku: generateSKU(name.split(" ")[0], `${qty}PACK`),
      manage_inventory: true,
      prices: [{ amount: dollarsToCents(pricePerQuantity[qty]), currency_code: "usd" }],
      options: { Quantity: `${qty} Pack` },
      inventory_quantity: 100
    })),

    images: [
      { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae" }
    ]
  }
}

// Usage:
const notebookSet = createProductSet(
  "Hardcover Notebook",
  "Premium hardcover notebooks with thick, bleed-resistant paper. Perfect for journaling, sketching, or note-taking.",
  [1, 3, 6],
  {
    1: 12.99,
    3: 34.99,  // Save $4
    6: 64.99   // Save $13
  }
)

// ============================================================================
// EXAMPLE 5: Product with Advanced Options (Size, Color, Material)
// ============================================================================

/**
 * Complex product with three options
 */
function createComplexProduct(
  name: string,
  description: string
): ProductSeedData {
  const options = [
    { title: "Size", values: ["S", "M", "L"] },
    { title: "Color", values: ["Black", "Navy"] },
    { title: "Material", values: ["Cotton", "Polyester"] }
  ]

  const combinations = generateVariantCombinations(options)

  const variants = combinations.map(opts => {
    // Different pricing based on material
    const basePrice = opts.Material === "Cotton" ? 39.99 : 34.99
    const xlPrice = opts.Size === "XL" ? basePrice + 5 : basePrice

    return {
      title: `${opts.Size} / ${opts.Color} / ${opts.Material}`,
      sku: generateSKU(
        name.split(" ")[0],
        opts.Size,
        opts.Color.substring(0, 3),
        opts.Material.substring(0, 3)
      ),
      manage_inventory: true,
      prices: [{ amount: dollarsToCents(xlPrice), currency_code: "usd" }],
      options: opts,
      inventory_quantity: 20
    }
  })

  return {
    title: name,
    description,
    handle: generateHandle(name),
    is_giftcard: false,
    status: "published",
    options,
    variants,
    images: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7" }
    ]
  }
}

// Usage:
const performanceShirt = createComplexProduct(
  "Performance Athletic Shirt",
  "High-performance athletic shirt with moisture-wicking technology. Available in premium cotton or quick-dry polyester."
)

// ============================================================================
// EXAMPLE 6: Seasonal or Limited Edition Products
// ============================================================================

/**
 * Limited edition product with metadata
 */
function createLimitedEdition(
  name: string,
  description: string,
  price: number,
  totalStock: number,
  season: string
): ProductSeedData {
  return {
    title: `${name} - ${season} Edition`,
    subtitle: "Limited Edition",
    description: `${description}\n\nThis is a limited edition release. Only ${totalStock} units available.`,
    handle: generateHandle(`${name} ${season} edition`),
    is_giftcard: false,
    status: "published",

    variants: [
      {
        title: "Limited Edition",
        sku: generateSKU(name.split(" ")[0], season, "LTD"),
        manage_inventory: true,
        prices: [{ amount: dollarsToCents(price), currency_code: "usd" }],
        inventory_quantity: totalStock
      }
    ],

    images: [
      { url: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7" }
    ],

    metadata: {
      limited_edition: "true",
      season,
      total_units: totalStock.toString(),
      release_year: new Date().getFullYear().toString()
    },

    tags: ["limited-edition", season.toLowerCase(), "exclusive"]
  }
}

// Usage:
const limitedSneaker = createLimitedEdition(
  "Retro Running Shoe",
  "Classic design meets modern comfort in this limited edition retro running shoe.",
  149.99,
  250,
  "Summer 2026"
)

// ============================================================================
// EXAMPLE 7: Multi-Currency Product
// ============================================================================

/**
 * Product with multiple currency prices
 */
function createGlobalProduct(
  name: string,
  description: string,
  prices: { usd: number; eur?: number; gbp?: number; cad?: number }
): ProductSeedData {
  const priceArray = [
    { amount: dollarsToCents(prices.usd), currency_code: "usd" }
  ]

  if (prices.eur) {
    priceArray.push({ amount: dollarsToCents(prices.eur), currency_code: "eur" })
  }
  if (prices.gbp) {
    priceArray.push({ amount: dollarsToCents(prices.gbp), currency_code: "gbp" })
  }
  if (prices.cad) {
    priceArray.push({ amount: dollarsToCents(prices.cad), currency_code: "cad" })
  }

  return {
    title: name,
    description,
    handle: generateHandle(name),
    is_giftcard: false,
    status: "published",

    variants: [
      {
        title: "Default",
        sku: generateSKU(name.split(" ")[0]),
        manage_inventory: true,
        prices: priceArray,
        inventory_quantity: 100
      }
    ],

    images: [
      { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f" }
    ]
  }
}

// Usage:
const sunglasses = createGlobalProduct(
  "Designer Sunglasses",
  "Premium polarized sunglasses with UV protection and scratch-resistant lenses.",
  {
    usd: 129.99,
    eur: 119.99,
    gbp: 99.99,
    cad: 169.99
  }
)

// ============================================================================
// SEED FUNCTION: Putting It All Together
// ============================================================================

export default async function seedExampleProducts(container: MedusaContainer): Promise<void> {
  const logger = container.resolve("logger") as any

  logger.info("🌱 Seeding example products using helper functions...")

  // Combine all products created above
  const productsToSeed: ProductSeedData[] = [
    coffeeGrinder,
    waterBottle,
    hoodie,
    notebookSet,
    performanceShirt,
    limitedSneaker,
    sunglasses
  ]

  // Use the template seed function
  await seedProducts(container)
}

// ============================================================================
// AI AGENT TIPS
// ============================================================================

/**
 * TIPS FOR CREATING PRODUCTS PROGRAMMATICALLY:
 *
 * 1. CREATE HELPER FUNCTIONS:
 *    - Reduces code duplication
 *    - Ensures consistency
 *    - Makes it easier to update prices or structure
 *
 * 2. USE GENERATEVARIANTCOMBINATIONS:
 *    - Don't manually create every variant
 *    - Let the function generate all combinations
 *    - Example: 4 sizes × 3 colors = 12 variants (automatic!)
 *
 * 3. DYNAMIC PRICING:
 *    - Calculate prices based on options (e.g., XL costs more)
 *    - Apply bulk discounts for quantity bundles
 *    - Add material premiums (cotton vs polyester)
 *
 * 4. METADATA IS YOUR FRIEND:
 *    - Add custom fields for filtering
 *    - Track special attributes (limited edition, eco-friendly)
 *    - Store additional info for analytics
 *
 * 5. REALISTIC INVENTORY:
 *    - Popular sizes (M, L): higher stock
 *    - Less common sizes (XS, XXL): lower stock
 *    - Popular colors: more inventory
 *    - Limited editions: low total stock
 *
 * 6. SKU CONVENTIONS:
 *    - Keep them consistent
 *    - Include product code + variant identifiers
 *    - Use abbreviations for long names
 *    - Example: HOODIE-M-BLK, SHOE-9-5-RED
 *
 * 7. HANDLE GENERATION:
 *    - Always use generateHandle() for consistency
 *    - Ensures URL-friendly format
 *    - Avoids manual typos
 *
 * 8. IMAGES:
 *    - Use high-quality stock photos for testing (Unsplash)
 *    - Add multiple images for better UX
 *    - Include alt text for accessibility
 *
 * 9. TESTING:
 *    - Start with 1-2 products
 *    - Verify in admin before scaling up
 *    - Check that variants display correctly
 *    - Test adding to cart
 *
 * 10. ORGANIZATION:
 *     - Group related products together
 *     - Use clear function names
 *     - Comment complex logic
 *     - Keep helper functions at the top
 */
