/**
 * Product Seed Schema - Index
 *
 * This file exports all types, helpers, and examples from the product seed schema.
 * Import from here for convenience.
 *
 * @example
 * import { ProductSeedData, dollarsToCents, generateSKU } from "./seeds"
 */

// Export all types
export type {
  ProductSeedData,
  ProductVariant,
  ProductOption,
  ProductPrice,
  ProductImage
} from "./product-seed-schema"

// Export helper functions
export {
  generateVariantCombinations,
  dollarsToCents,
  generateSKU,
  generateHandle,
  seedProducts
} from "./product-seed-schema"

// Export schema examples for reference
export {
  SIMPLE_PRODUCT_SCHEMA_EXAMPLE,
  SINGLE_OPTION_PRODUCT_SCHEMA_EXAMPLE,
  MULTI_OPTION_PRODUCT_SCHEMA_EXAMPLE
} from "./product-seed-schema"

// Export default seed function from sample products
export { default as seedSampleProducts } from "./sample-products"
