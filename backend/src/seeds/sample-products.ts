import {
  MedusaContainer,
} from "@medusajs/framework/types"

export default async function seedSampleProducts(container: MedusaContainer): Promise<void> {
  const logger = container.resolve("logger") as any

  logger.info("🌱 Seeding sample products...")

  // Sample products for an ecommerce store
  const sampleProducts = [
    {
      title: "Premium Wireless Headphones",
      subtitle: "Noise-cancelling over-ear headphones",
      description: "Experience premium sound quality with active noise cancellation, 30-hour battery life, and comfortable design perfect for all-day listening.",
      handle: "premium-wireless-headphones",
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      options: [
        {
          title: "Color",
          values: ["Black", "Silver", "Blue"]
        }
      ],
      variants: [
        {
          title: "Black",
          sku: "HEADPHONES-BLK",
          manage_inventory: true,
          prices: [
            {
              amount: 29999,
              currency_code: "usd"
            },
            {
              amount: 27999,
              currency_code: "eur"
            }
          ],
          options: {
            Color: "Black"
          },
          inventory_quantity: 100
        },
        {
          title: "Silver",
          sku: "HEADPHONES-SLV",
          manage_inventory: true,
          prices: [
            {
              amount: 29999,
              currency_code: "usd"
            },
            {
              amount: 27999,
              currency_code: "eur"
            }
          ],
          options: {
            Color: "Silver"
          },
          inventory_quantity: 75
        },
        {
          title: "Blue",
          sku: "HEADPHONES-BLU",
          manage_inventory: true,
          prices: [
            {
              amount: 29999,
              currency_code: "usd"
            },
            {
              amount: 27999,
              currency_code: "eur"
            }
          ],
          options: {
            Color: "Blue"
          },
          inventory_quantity: 50
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"
        }
      ]
    },
    {
      title: "Smart Watch Pro",
      subtitle: "Fitness tracking and notifications",
      description: "Stay connected and track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and 5-day battery life.",
      handle: "smart-watch-pro",
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      options: [
        {
          title: "Size",
          values: ["40mm", "44mm"]
        },
        {
          title: "Band",
          values: ["Sport", "Leather", "Metal"]
        }
      ],
      variants: [
        {
          title: "40mm / Sport Band",
          sku: "WATCH-40-SPORT",
          manage_inventory: true,
          prices: [
            {
              amount: 39999,
              currency_code: "usd"
            }
          ],
          options: {
            Size: "40mm",
            Band: "Sport"
          },
          inventory_quantity: 80
        },
        {
          title: "44mm / Sport Band",
          sku: "WATCH-44-SPORT",
          manage_inventory: true,
          prices: [
            {
              amount: 42999,
              currency_code: "usd"
            }
          ],
          options: {
            Size: "44mm",
            Band: "Sport"
          },
          inventory_quantity: 60
        },
        {
          title: "40mm / Leather Band",
          sku: "WATCH-40-LEATHER",
          manage_inventory: true,
          prices: [
            {
              amount: 44999,
              currency_code: "usd"
            }
          ],
          options: {
            Size: "40mm",
            Band: "Leather"
          },
          inventory_quantity: 40
        },
        {
          title: "44mm / Metal Band",
          sku: "WATCH-44-METAL",
          manage_inventory: true,
          prices: [
            {
              amount: 49999,
              currency_code: "usd"
            }
          ],
          options: {
            Size: "44mm",
            Band: "Metal"
          },
          inventory_quantity: 30
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop"
        }
      ]
    },
    {
      title: "Minimalist Backpack",
      subtitle: "Water-resistant laptop backpack",
      description: "A sleek, durable backpack with dedicated laptop compartment, water-resistant material, and ergonomic design for daily commuting.",
      handle: "minimalist-backpack",
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
      options: [
        {
          title: "Color",
          values: ["Black", "Gray", "Navy"]
        }
      ],
      variants: [
        {
          title: "Black",
          sku: "BACKPACK-BLK",
          manage_inventory: true,
          prices: [
            {
              amount: 8999,
              currency_code: "usd"
            }
          ],
          options: {
            Color: "Black"
          },
          inventory_quantity: 120
        },
        {
          title: "Gray",
          sku: "BACKPACK-GRY",
          manage_inventory: true,
          prices: [
            {
              amount: 8999,
              currency_code: "usd"
            }
          ],
          options: {
            Color: "Gray"
          },
          inventory_quantity: 90
        },
        {
          title: "Navy",
          sku: "BACKPACK-NVY",
          manage_inventory: true,
          prices: [
            {
              amount: 8999,
              currency_code: "usd"
            }
          ],
          options: {
            Color: "Navy"
          },
          inventory_quantity: 70
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"
        }
      ]
    },
    {
      title: "Portable Bluetooth Speaker",
      subtitle: "Waterproof wireless speaker",
      description: "Take your music anywhere with this compact, waterproof Bluetooth speaker featuring 360° sound and 12-hour battery life.",
      handle: "portable-bluetooth-speaker",
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
      variants: [
        {
          title: "Default",
          sku: "SPEAKER-001",
          manage_inventory: true,
          prices: [
            {
              amount: 7999,
              currency_code: "usd"
            }
          ],
          inventory_quantity: 150
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop"
        }
      ]
    },
    {
      title: "Ergonomic Wireless Mouse",
      subtitle: "Precision gaming mouse",
      description: "High-precision wireless mouse with customizable buttons, RGB lighting, and ergonomic design for extended comfort.",
      handle: "ergonomic-wireless-mouse",
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop",
      variants: [
        {
          title: "Default",
          sku: "MOUSE-001",
          manage_inventory: true,
          prices: [
            {
              amount: 5999,
              currency_code: "usd"
            }
          ],
          inventory_quantity: 200
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop"
        }
      ]
    },
    {
      title: "USB-C Hub Adapter",
      subtitle: "7-in-1 multiport adapter",
      description: "Expand your connectivity with this compact USB-C hub featuring HDMI, USB 3.0, SD card reader, and more.",
      handle: "usb-c-hub-adapter",
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop",
      variants: [
        {
          title: "Default",
          sku: "HUB-001",
          manage_inventory: true,
          prices: [
            {
              amount: 4999,
              currency_code: "usd"
            }
          ],
          inventory_quantity: 180
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop"
        }
      ]
    },
    {
      title: "Mechanical Keyboard",
      subtitle: "RGB backlit gaming keyboard",
      description: "Premium mechanical keyboard with customizable RGB backlighting, programmable keys, and tactile switches for the ultimate typing experience.",
      handle: "mechanical-keyboard",
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop",
      options: [
        {
          title: "Switch Type",
          values: ["Blue", "Brown", "Red"]
        }
      ],
      variants: [
        {
          title: "Blue Switches",
          sku: "KB-BLUE",
          manage_inventory: true,
          prices: [
            {
              amount: 12999,
              currency_code: "usd"
            }
          ],
          options: {
            "Switch Type": "Blue"
          },
          inventory_quantity: 60
        },
        {
          title: "Brown Switches",
          sku: "KB-BROWN",
          manage_inventory: true,
          prices: [
            {
              amount: 12999,
              currency_code: "usd"
            }
          ],
          options: {
            "Switch Type": "Brown"
          },
          inventory_quantity: 70
        },
        {
          title: "Red Switches",
          sku: "KB-RED",
          manage_inventory: true,
          prices: [
            {
              amount: 12999,
              currency_code: "usd"
            }
          ],
          options: {
            "Switch Type": "Red"
          },
          inventory_quantity: 50
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop"
        }
      ]
    },
    {
      title: "Wireless Charging Pad",
      subtitle: "Fast wireless charger",
      description: "Charge your devices wirelessly with this sleek charging pad featuring fast charging support and LED indicator.",
      handle: "wireless-charging-pad",
      is_giftcard: false,
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1591290619762-d9c7a672e3e0?w=800&h=800&fit=crop",
      variants: [
        {
          title: "Default",
          sku: "CHARGER-001",
          manage_inventory: true,
          prices: [
            {
              amount: 2999,
              currency_code: "usd"
            }
          ],
          inventory_quantity: 250
        }
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1591290619762-d9c7a672e3e0?w=800&h=800&fit=crop"
        }
      ]
    }
  ]

  try {
    const productModuleService = container.resolve("productModuleService") as any

    for (const productData of sampleProducts) {
      try {
        // Check if product already exists
        const existing = await productModuleService.listProducts({
          handle: productData.handle
        })

        if (existing && existing.length > 0) {
          logger.info(`Product ${productData.handle} already exists, skipping...`)
          continue
        }

        // Create the product
        await productModuleService.createProducts(productData)
        logger.info(`✅ Created product: ${productData.title}`)
      } catch (error) {
        logger.error(`Error creating product ${productData.title}:`, error)
      }
    }

    logger.info("🎉 Sample products seeded successfully!")
  } catch (error) {
    logger.error("Error seeding products:", error)
    throw error
  }
}
