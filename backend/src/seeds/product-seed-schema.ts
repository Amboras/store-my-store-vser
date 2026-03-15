/**
 * MEDUSA PRODUCT SEED SCHEMA
 *
 * This file defines the TypeScript interfaces and schema for seeding products into Medusa v2.
 * AI agents should use these types to understand the structure and create product data.
 *
 * IMPORTANT: This is a SCHEMA file, not data. Actual product data should be created
 * separately using these types as a template.
 *
 * @see https://docs.medusajs.com/resources/medusa-admin-api/products
 */

import { MedusaContainer } from "@medusajs/framework/types"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Product Option Definition
 *
 * Options define the characteristics that can vary between product variants.
 * For example: Size, Color, Material, Style, etc.
 *
 * @example
 * // Single option (Color)
 * { title: "Color", values: ["Red", "Blue", "Green"] }
 *
 * @example
 * // Multiple options (Size + Color)
 * [
 *   { title: "Size", values: ["S", "M", "L", "XL"] },
 *   { title: "Color", values: ["Black", "White"] }
 * ]
 */
export interface ProductOption {
  /**
   * The name of the option (e.g., "Size", "Color", "Material")
   * This will be displayed to customers
   */
  title: string

  /**
   * All possible values for this option
   * Each variant must have exactly one value from this list
   *
   * @example ["Small", "Medium", "Large"]
   * @example ["Black", "White", "Red", "Blue"]
   */
  values: string[]
}

/**
 * Price Definition
 *
 * Each variant can have multiple prices in different currencies.
 * Amounts are in the smallest currency unit (cents for USD, pence for GBP, etc.)
 *
 * @example
 * // $29.99 USD
 * { amount: 2999, currency_code: "usd" }
 *
 * @example
 * // €24.99 EUR
 * { amount: 2499, currency_code: "eur" }
 */
export interface ProductPrice {
  /**
   * Price amount in smallest currency unit (cents, pence, etc.)
   *
   * Examples:
   * - $19.99 = 1999
   * - $100.00 = 10000
   * - €29.50 = 2950
   *
   * NEVER use decimal points. Always multiply by 100.
   */
  amount: number

  /**
   * ISO 4217 currency code (lowercase)
   *
   * Common codes:
   * - "usd" - US Dollar
   * - "eur" - Euro
   * - "gbp" - British Pound
   * - "cad" - Canadian Dollar
   * - "aud" - Australian Dollar
   * - "jpy" - Japanese Yen (no cents, so ¥1000 = 1000)
   *
   * @see https://en.wikipedia.org/wiki/ISO_4217
   */
  currency_code: string
}

/**
 * Product Variant Definition
 *
 * A variant represents a specific combination of options (e.g., "Large Red T-Shirt").
 * Each variant has its own SKU, price, and inventory.
 *
 * @example
 * // Simple variant (no options)
 * {
 *   title: "Default",
 *   sku: "PRODUCT-001",
 *   manage_inventory: true,
 *   prices: [{ amount: 2999, currency_code: "usd" }],
 *   inventory_quantity: 100
 * }
 *
 * @example
 * // Variant with options
 * {
 *   title: "Large / Red",
 *   sku: "TSHIRT-L-RED",
 *   manage_inventory: true,
 *   prices: [
 *     { amount: 2999, currency_code: "usd" },
 *     { amount: 2499, currency_code: "eur" }
 *   ],
 *   options: { Size: "Large", Color: "Red" },
 *   inventory_quantity: 50
 * }
 */
export interface ProductVariant {
  /**
   * Human-readable title for the variant
   *
   * Best practices:
   * - For single variants: use "Default"
   * - For multi-option variants: combine options (e.g., "Large / Red", "Small / Blue")
   * - Keep it descriptive and customer-friendly
   */
  title: string

  /**
   * Stock Keeping Unit - unique identifier for inventory tracking
   *
   * Best practices:
   * - Use uppercase letters and hyphens
   * - Include product code + variant identifiers
   * - Keep it short but descriptive
   *
   * @example "TSHIRT-L-BLK" (T-shirt, Large, Black)
   * @example "HEADPHONES-NC-BLK" (Headphones, Noise-Cancelling, Black)
   * @example "MUG-001" (Simple product)
   */
  sku: string

  /**
   * Whether Medusa should track inventory for this variant
   *
   * - true: Track inventory, prevent overselling
   * - false: Allow unlimited purchases (digital products, made-to-order)
   *
   * Recommended: true for physical products
   */
  manage_inventory: boolean

  /**
   * Array of prices in different currencies
   *
   * You can specify the same variant at different prices for different regions.
   * At minimum, include one price in your primary currency.
   */
  prices: ProductPrice[]

  /**
   * Option values for this variant
   *
   * IMPORTANT:
   * - Keys must match option titles exactly (case-sensitive)
   * - Values must be from the corresponding option's values array
   * - Must include ALL options defined at the product level
   *
   * @example
   * // Product has options: [{ title: "Size", values: [...] }, { title: "Color", values: [...] }]
   * // Variant must specify both:
   * { Size: "Large", Color: "Red" }
   */
  options?: Record<string, string>

  /**
   * Initial inventory quantity
   *
   * Only used if manage_inventory is true.
   * Can be updated later through the admin or API.
   *
   * @example 100 - Start with 100 units in stock
   * @example 0 - Out of stock (can still be created)
   */
  inventory_quantity?: number

  /**
   * Barcode/UPC/EAN for the variant (optional)
   * Used for scanning and inventory management
   */
  barcode?: string

  /**
   * Weight in grams (optional, but recommended for shipping)
   * Used for calculating shipping costs
   *
   * @example 250 - 250 grams (0.25 kg)
   * @example 1000 - 1 kilogram
   */
  weight?: number

  /**
   * Length in millimeters (optional)
   * Used for shipping calculations
   */
  length?: number

  /**
   * Width in millimeters (optional)
   */
  width?: number

  /**
   * Height in millimeters (optional)
   */
  height?: number
}

/**
 * Product Image Definition
 *
 * Images for the product. First image is typically the main/featured image.
 */
export interface ProductImage {
  /**
   * Full URL to the image
   *
   * Can be:
   * - External URL (Unsplash, your CDN, etc.)
   * - Local path after uploading to Medusa
   *
   * Best practices:
   * - Use high-quality images (at least 800x800px)
   * - Use square aspect ratio for consistency
   * - Optimize file size (use WebP if possible)
   * - Use HTTPS URLs
   *
   * @example "https://cdn.example.com/products/tshirt-black.jpg"
   * @example "https://images.unsplash.com/photo-xyz?w=800&h=800"
   */
  url: string

  /**
   * Alt text for accessibility (optional but recommended)
   * Describe what's in the image for screen readers
   *
   * @example "Black cotton t-shirt on white background"
   */
  alt?: string
}

/**
 * Complete Product Definition
 *
 * This is the main product object that represents a product in your catalog.
 *
 * @example
 * // Simple product (no variants)
 * {
 *   title: "Coffee Mug",
 *   description: "Ceramic coffee mug",
 *   handle: "coffee-mug",
 *   status: "published",
 *   variants: [
 *     {
 *       title: "Default",
 *       sku: "MUG-001",
 *       prices: [{ amount: 1499, currency_code: "usd" }],
 *       manage_inventory: true,
 *       inventory_quantity: 100
 *     }
 *   ]
 * }
 *
 * @example
 * // Product with variants (see T_SHIRT_SCHEMA_EXAMPLE below)
 */
export interface ProductSeedData {
  /**
   * Product title - main name displayed to customers
   *
   * Best practices:
   * - Keep it concise but descriptive
   * - Don't include variant details (those go in variant titles)
   * - Use proper capitalization
   *
   * @example "Premium Cotton T-Shirt"
   * @example "Wireless Noise-Cancelling Headphones"
   * @example "Organic Coffee Blend"
   */
  title: string

  /**
   * Subtitle - additional context (optional)
   *
   * Short phrase that adds context without cluttering the main title
   *
   * @example "100% Organic Cotton"
   * @example "Active Noise Cancellation"
   * @example "Dark Roast, Fair Trade"
   */
  subtitle?: string

  /**
   * Detailed product description
   *
   * This is where you sell the product! Include:
   * - Key features and benefits
   * - Materials and construction
   * - Use cases
   * - Care instructions
   *
   * Can include basic HTML or Markdown (check your storefront's support)
   *
   * @example
   * "Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton,
   * this versatile piece features a relaxed fit and reinforced seams for durability. Perfect for
   * everyday wear or layering."
   */
  description: string

  /**
   * URL-friendly unique identifier
   *
   * Used in product URLs: yourstore.com/products/{handle}
   *
   * Requirements:
   * - Must be unique across all products
   * - Lowercase letters, numbers, hyphens only
   * - No spaces or special characters
   * - Keep it readable and SEO-friendly
   *
   * @example "premium-cotton-tshirt"
   * @example "wireless-headphones-pro"
   * @example "organic-coffee-dark-roast"
   */
  handle: string

  /**
   * Whether this product is a gift card
   *
   * - false: Regular product (most cases)
   * - true: Digital gift card (special handling)
   */
  is_giftcard: boolean

  /**
   * Publication status
   *
   * - "published": Visible to customers, can be purchased
   * - "draft": Hidden from customers, visible in admin only
   * - "proposed": Awaiting approval (if using workflows)
   *
   * Use "draft" for products you're still setting up
   */
  status: "published" | "draft" | "proposed"

  /**
   * Main product image URL (optional)
   *
   * This is the primary image shown in product listings.
   * Should also be included in the images array as the first item.
   *
   * @example "https://cdn.example.com/products/tshirt-main.jpg"
   */
  thumbnail?: string

  /**
   * Product options (for creating variants)
   *
   * Define this ONLY if your product has variants.
   * Each option creates a dimension of variation.
   *
   * Examples:
   * - Clothing: Size, Color, Material
   * - Electronics: Storage, Color, Connectivity
   * - Books: Format (Hardcover, Paperback, eBook)
   *
   * IMPORTANT:
   * - Don't create options if there are no variants (e.g., one-size-fits-all)
   * - Each variant must specify a value for EVERY option
   * - Option titles must be unique
   *
   * @example [{ title: "Size", values: ["S", "M", "L", "XL"] }]
   */
  options?: ProductOption[]

  /**
   * Product variants
   *
   * REQUIRED: Every product must have at least one variant.
   *
   * For simple products:
   * - Create one variant with title "Default"
   *
   * For products with options:
   * - Create one variant for each combination
   * - Example: 4 sizes × 3 colors = 12 variants
   *
   * Each variant can have different prices, SKUs, and inventory
   */
  variants: ProductVariant[]

  /**
   * Product images
   *
   * Array of image URLs. First image is the main product image.
   *
   * Best practices:
   * - Include at least one image
   * - First image should be the thumbnail
   * - Add multiple angles for clothing
   * - Show product in use
   * - Include detail shots
   *
   * @example
   * [
   *   { url: "https://cdn.example.com/product-front.jpg" },
   *   { url: "https://cdn.example.com/product-back.jpg" },
   *   { url: "https://cdn.example.com/product-detail.jpg" }
   * ]
   */
  images?: ProductImage[]

  /**
   * Product metadata (optional)
   *
   * Custom key-value pairs for additional data.
   * Can be used for filtering, analytics, or custom features.
   *
   * @example
   * {
   *   material: "cotton",
   *   care_instructions: "Machine wash cold",
   *   country_of_origin: "USA",
   *   eco_friendly: "true"
   * }
   */
  metadata?: Record<string, any>

  /**
   * SEO title (optional)
   * Override the default title for search engines
   *
   * @example "Buy Premium Cotton T-Shirts | YourStore"
   */
  seo_title?: string

  /**
   * SEO description (optional)
   * Meta description for search engines (150-160 characters ideal)
   *
   * @example "Shop our premium cotton t-shirts in multiple colors and sizes. Free shipping on orders over $50."
   */
  seo_description?: string

  /**
   * Product tags (optional)
   * For categorization and filtering
   *
   * @example ["summer", "casual", "bestseller"]
   */
  tags?: string[]

  /**
   * Product type (optional)
   * Broad category for organization
   *
   * @example "Apparel"
   * @example "Electronics"
   * @example "Home & Garden"
   */
  type?: string

  /**
   * Collection IDs (optional)
   * Associate product with collections
   *
   * Note: Collections must be created first
   *
   * @example ["col_summer2024", "col_bestsellers"]
   */
  collection_id?: string

  /**
   * Product weight (optional, grams)
   * Default weight if not specified on variant
   */
  weight?: number

  /**
   * Length (optional, millimeters)
   */
  length?: number

  /**
   * Width (optional, millimeters)
   */
  width?: number

  /**
   * Height (optional, millimeters)
   */
  height?: number
}

// ============================================================================
// SCHEMA EXAMPLES FOR AI AGENTS
// ============================================================================

/**
 * EXAMPLE 1: Simple Product (No Variants)
 *
 * Use this pattern for products with no variations.
 * Example: Single coffee mug, digital download, service
 */
export const SIMPLE_PRODUCT_SCHEMA_EXAMPLE: ProductSeedData = {
  title: "Example Product Name",
  subtitle: "Short descriptive tagline",
  description: "Detailed product description explaining features, benefits, and use cases. This can be several sentences long.",
  handle: "example-product-slug",
  is_giftcard: false,
  status: "published",
  thumbnail: "https://example.com/image.jpg",

  // No options for simple products
  variants: [
    {
      title: "Default",
      sku: "PRODUCT-001",
      manage_inventory: true,
      prices: [
        {
          amount: 2999, // $29.99
          currency_code: "usd"
        }
      ],
      inventory_quantity: 100
    }
  ],

  images: [
    { url: "https://example.com/image-1.jpg" },
    { url: "https://example.com/image-2.jpg" }
  ]
}

/**
 * EXAMPLE 2: Product with Single Option (e.g., Color)
 *
 * Use this for products that vary in one dimension.
 * Example: T-shirt with different colors, book in different formats
 */
export const SINGLE_OPTION_PRODUCT_SCHEMA_EXAMPLE: ProductSeedData = {
  title: "Example T-Shirt",
  description: "Comfortable cotton t-shirt available in multiple colors",
  handle: "example-tshirt",
  is_giftcard: false,
  status: "published",

  // Define the option
  options: [
    {
      title: "Color",
      values: ["Black", "White", "Navy", "Gray"]
    }
  ],

  // Create a variant for each color
  variants: [
    {
      title: "Black",
      sku: "TSHIRT-BLK",
      manage_inventory: true,
      prices: [{ amount: 1999, currency_code: "usd" }],
      options: { Color: "Black" },
      inventory_quantity: 50
    },
    {
      title: "White",
      sku: "TSHIRT-WHT",
      manage_inventory: true,
      prices: [{ amount: 1999, currency_code: "usd" }],
      options: { Color: "White" },
      inventory_quantity: 75
    },
    {
      title: "Navy",
      sku: "TSHIRT-NVY",
      manage_inventory: true,
      prices: [{ amount: 1999, currency_code: "usd" }],
      options: { Color: "Navy" },
      inventory_quantity: 40
    },
    {
      title: "Gray",
      sku: "TSHIRT-GRY",
      manage_inventory: true,
      prices: [{ amount: 1999, currency_code: "usd" }],
      options: { Color: "Gray" },
      inventory_quantity: 60
    }
  ],

  images: [
    { url: "https://example.com/tshirt-black.jpg" },
    { url: "https://example.com/tshirt-white.jpg" }
  ]
}

/**
 * EXAMPLE 3: Product with Multiple Options (Size + Color)
 *
 * Use this for products that vary in multiple dimensions.
 * Example: Clothing with sizes and colors, electronics with storage and color
 *
 * IMPORTANT: You need a variant for EVERY combination of options.
 * 4 sizes × 3 colors = 12 variants
 */
export const MULTI_OPTION_PRODUCT_SCHEMA_EXAMPLE: ProductSeedData = {
  title: "Premium Cotton T-Shirt",
  subtitle: "Comfortable everyday essential",
  description: "Made from 100% organic cotton with a relaxed fit and durable construction. Perfect for casual wear or as a versatile layering piece.",
  handle: "premium-cotton-tshirt",
  is_giftcard: false,
  status: "published",
  thumbnail: "https://example.com/tshirt-main.jpg",

  // Define BOTH options
  options: [
    {
      title: "Size",
      values: ["S", "M", "L", "XL"]
    },
    {
      title: "Color",
      values: ["Black", "White", "Navy"]
    }
  ],

  // Create variants for each combination (4 sizes × 3 colors = 12 variants)
  // TIP: You can generate these programmatically in your seed script
  variants: [
    // Black variants (all sizes)
    {
      title: "S / Black",
      sku: "TSHIRT-S-BLK",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "S", Color: "Black" },
      inventory_quantity: 30,
      weight: 150
    },
    {
      title: "M / Black",
      sku: "TSHIRT-M-BLK",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "M", Color: "Black" },
      inventory_quantity: 50,
      weight: 160
    },
    {
      title: "L / Black",
      sku: "TSHIRT-L-BLK",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "L", Color: "Black" },
      inventory_quantity: 45,
      weight: 170
    },
    {
      title: "XL / Black",
      sku: "TSHIRT-XL-BLK",
      manage_inventory: true,
      prices: [
        { amount: 3299, currency_code: "usd" }, // Slightly higher price for XL
        { amount: 2899, currency_code: "eur" }
      ],
      options: { Size: "XL", Color: "Black" },
      inventory_quantity: 25,
      weight: 180
    },

    // White variants (all sizes)
    {
      title: "S / White",
      sku: "TSHIRT-S-WHT",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "S", Color: "White" },
      inventory_quantity: 40,
      weight: 150
    },
    {
      title: "M / White",
      sku: "TSHIRT-M-WHT",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "M", Color: "White" },
      inventory_quantity: 60,
      weight: 160
    },
    {
      title: "L / White",
      sku: "TSHIRT-L-WHT",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "L", Color: "White" },
      inventory_quantity: 55,
      weight: 170
    },
    {
      title: "XL / White",
      sku: "TSHIRT-XL-WHT",
      manage_inventory: true,
      prices: [
        { amount: 3299, currency_code: "usd" },
        { amount: 2899, currency_code: "eur" }
      ],
      options: { Size: "XL", Color: "White" },
      inventory_quantity: 30,
      weight: 180
    },

    // Navy variants (all sizes)
    {
      title: "S / Navy",
      sku: "TSHIRT-S-NVY",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "S", Color: "Navy" },
      inventory_quantity: 20,
      weight: 150
    },
    {
      title: "M / Navy",
      sku: "TSHIRT-M-NVY",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "M", Color: "Navy" },
      inventory_quantity: 35,
      weight: 160
    },
    {
      title: "L / Navy",
      sku: "TSHIRT-L-NVY",
      manage_inventory: true,
      prices: [
        { amount: 2999, currency_code: "usd" },
        { amount: 2599, currency_code: "eur" }
      ],
      options: { Size: "L", Color: "Navy" },
      inventory_quantity: 30,
      weight: 170
    },
    {
      title: "XL / Navy",
      sku: "TSHIRT-XL-NVY",
      manage_inventory: true,
      prices: [
        { amount: 3299, currency_code: "usd" },
        { amount: 2899, currency_code: "eur" }
      ],
      options: { Size: "XL", Color: "Navy" },
      inventory_quantity: 15,
      weight: 180
    }
  ],

  images: [
    { url: "https://example.com/tshirt-black-front.jpg", alt: "Black t-shirt front view" },
    { url: "https://example.com/tshirt-white-front.jpg", alt: "White t-shirt front view" },
    { url: "https://example.com/tshirt-navy-front.jpg", alt: "Navy t-shirt front view" },
    { url: "https://example.com/tshirt-detail.jpg", alt: "Close-up of fabric texture" }
  ],

  metadata: {
    material: "100% Organic Cotton",
    care: "Machine wash cold, tumble dry low",
    fit: "Relaxed",
    made_in: "USA"
  },

  type: "Apparel",
  tags: ["t-shirt", "cotton", "casual", "basics"]
}

// ============================================================================
// SEED FUNCTION TEMPLATE
// ============================================================================

/**
 * Template for creating a seed function
 *
 * AI Agents: Use this as a starting point for creating seed scripts.
 * Replace the `productsToSeed` array with actual product data following
 * the schema examples above.
 *
 * @param container - Medusa dependency injection container
 */
export async function seedProducts(container: MedusaContainer): Promise<void> {
  const logger = container.resolve("logger") as any
  const productModuleService = container.resolve("productModuleService") as any

  logger.info("🌱 Starting product seed...")

  // TODO: Replace this with actual product data
  // Use the schema examples above as templates
  const productsToSeed: ProductSeedData[] = [
    // Add your products here
  ]

  let created = 0
  let skipped = 0
  let failed = 0

  for (const productData of productsToSeed) {
    try {
      // Check if product already exists by handle
      const existing = await productModuleService.listProducts({
        handle: productData.handle
      })

      if (existing && existing.length > 0) {
        logger.info(`⏭️  Product "${productData.title}" (${productData.handle}) already exists, skipping...`)
        skipped++
        continue
      }

      // Create the product
      await productModuleService.createProducts(productData)
      logger.info(`✅ Created product: "${productData.title}" (${productData.handle})`)
      created++

    } catch (error) {
      logger.error(`❌ Failed to create product "${productData.title}":`, error)
      failed++
    }
  }

  // Summary
  logger.info("")
  logger.info("📊 Seed Summary:")
  logger.info(`   ✅ Created: ${created}`)
  logger.info(`   ⏭️  Skipped: ${skipped}`)
  logger.info(`   ❌ Failed: ${failed}`)
  logger.info(`   📦 Total: ${productsToSeed.length}`)
  logger.info("")

  if (created > 0) {
    logger.info("🎉 Product seeding completed successfully!")
  } else if (skipped === productsToSeed.length) {
    logger.info("✨ All products already exist, nothing to do.")
  } else {
    logger.warn("⚠️  Some products were not created. Check errors above.")
  }
}

// ============================================================================
// HELPER UTILITIES FOR AI AGENTS
// ============================================================================

/**
 * Helper: Generate all variant combinations for multiple options
 *
 * This utility generates all possible combinations of options.
 * Useful when you have many options and don't want to manually create each variant.
 *
 * @example
 * const options = [
 *   { title: "Size", values: ["S", "M", "L"] },
 *   { title: "Color", values: ["Red", "Blue"] }
 * ]
 * const combinations = generateVariantCombinations(options)
 * // Returns: [
 * //   { Size: "S", Color: "Red" },
 * //   { Size: "S", Color: "Blue" },
 * //   { Size: "M", Color: "Red" },
 * //   { Size: "M", Color: "Blue" },
 * //   { Size: "L", Color: "Red" },
 * //   { Size: "L", Color: "Blue" }
 * // ]
 */
export function generateVariantCombinations(
  options: ProductOption[]
): Record<string, string>[] {
  if (options.length === 0) return [{}]
  if (options.length === 1) {
    return options[0].values.map(value => ({ [options[0].title]: value }))
  }

  const [first, ...rest] = options
  const restCombinations = generateVariantCombinations(rest)
  const combinations: Record<string, string>[] = []

  for (const value of first.values) {
    for (const restCombination of restCombinations) {
      combinations.push({
        [first.title]: value,
        ...restCombination
      })
    }
  }

  return combinations
}

/**
 * Helper: Convert dollar amount to cents
 *
 * @example
 * dollarsToCents(29.99) // Returns 2999
 * dollarsToCents(100) // Returns 10000
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

/**
 * Helper: Generate SKU from components
 *
 * @example
 * generateSKU("TSHIRT", "L", "BLK") // Returns "TSHIRT-L-BLK"
 * generateSKU("SHOE", "9.5", "RED") // Returns "SHOE-9-5-RED"
 */
export function generateSKU(...parts: (string | number)[]): string {
  return parts
    .map(part => String(part).toUpperCase().replace(/[^A-Z0-9]/g, "-"))
    .join("-")
}

/**
 * Helper: Generate URL-friendly handle from title
 *
 * @example
 * generateHandle("Premium Cotton T-Shirt") // Returns "premium-cotton-t-shirt"
 * generateHandle("Nike Air Max 90") // Returns "nike-air-max-90"
 */
export function generateHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ============================================================================
// QUICK START GUIDE FOR AI AGENTS
// ============================================================================

/**
 * AI AGENT INSTRUCTIONS
 *
 * To create a product seed script:
 *
 * 1. UNDERSTAND THE PRODUCT STRUCTURE:
 *    - Read the ProductSeedData interface above
 *    - Review the schema examples (SIMPLE, SINGLE_OPTION, MULTI_OPTION)
 *    - Understand when to use options vs. simple variants
 *
 * 2. GATHER PRODUCT INFORMATION:
 *    Ask the user for:
 *    - Product name and description
 *    - Does it have variants? (sizes, colors, etc.)
 *    - Pricing (in dollars, you'll convert to cents)
 *    - Inventory quantities
 *    - Image URLs
 *
 * 3. CHOOSE THE RIGHT PATTERN:
 *    - No variations? Use SIMPLE_PRODUCT_SCHEMA_EXAMPLE
 *    - One variation (e.g., just color)? Use SINGLE_OPTION_PRODUCT_SCHEMA_EXAMPLE
 *    - Multiple variations (size + color)? Use MULTI_OPTION_PRODUCT_SCHEMA_EXAMPLE
 *
 * 4. CREATE THE PRODUCT DATA:
 *    - Copy the appropriate example
 *    - Replace placeholder values with real data
 *    - Use helper functions (dollarsToCents, generateSKU, etc.)
 *    - Ensure all required fields are filled
 *
 * 5. VALIDATE YOUR DATA:
 *    - Every product must have at least one variant
 *    - If using options, every variant must specify values for ALL options
 *    - Handles must be unique and URL-friendly
 *    - SKUs should be unique
 *    - Prices are in cents (multiply dollars by 100)
 *
 * 6. TEST THE SEED:
 *    - Create a new file: src/seeds/my-products.ts
 *    - Export a default function that calls seedProducts() with your data
 *    - Run: npm run seed
 *    - Check the Medusa admin to verify products were created
 *
 * COMMON MISTAKES TO AVOID:
 * ❌ Using decimal prices (use cents: 2999 not 29.99)
 * ❌ Creating options but no variants
 * ❌ Missing option values in variants
 * ❌ Non-unique handles
 * ❌ Forgetting to set manage_inventory: true
 * ❌ Using spaces or special characters in handles/SKUs
 *
 * BEST PRACTICES:
 * ✅ Start with simple products first
 * ✅ Use descriptive, SEO-friendly handles
 * ✅ Include multiple images per product
 * ✅ Set realistic inventory quantities
 * ✅ Test with one product before creating many
 * ✅ Use the helper functions to avoid typos
 * ✅ Add metadata for filtering and search
 */

export default seedProducts
