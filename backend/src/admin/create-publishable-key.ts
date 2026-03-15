import { Modules } from "@medusajs/framework/utils"

export default async function ({ container }: any) {
  const logger = container.resolve("logger") as any
  const apiKeyModuleService = container.resolve(Modules.API_KEY) as any

  logger.info("🔑 Creating publishable API key...")

  try {
    // Check if a publishable key already exists
    const existingKeys = await apiKeyModuleService.listApiKeys({
      type: "publishable",
    })

    if (existingKeys && existingKeys.length > 0) {
      const key = existingKeys[0]
      logger.info(`✅ Publishable key already exists: ${key.token}`)
      logger.info("")
      logger.info("📋 Add this to your storefront/.env.local:")
      logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key.token}`)
      return
    }

    // Create a new publishable API key
    const apiKey = await apiKeyModuleService.createApiKeys({
      title: "Default Store Key",
      type: "publishable",
      created_by: "system",
    })

    logger.info(`✅ Created publishable API key: ${apiKey.token}`)
    logger.info("")
    logger.info("📋 Add this to your storefront/.env.local:")
    logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`)
    logger.info("")
    logger.info("🎉 Setup complete!")
  } catch (error) {
    logger.error("❌ Error creating publishable key:", error)
    throw error
  }
}
