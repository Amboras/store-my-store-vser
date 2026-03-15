# Ecommerce Starter Template - Architecture & Development Guide

## Project Overview

This is an AI-powered ecommerce store builder that combines battle-tested commerce infrastructure with intelligent composition. Rather than generating stores from scratch, it leverages proven patterns and components to create production-ready online stores.

### What This Is

A monorepo starter template for building ecommerce stores with:
- Pre-configured Medusa v2 backend with cart, checkout, payments, and order management
- Next.js 15 storefront templates optimized for different use cases
- Reusable component library for common commerce patterns
- Claude-powered commands for intelligent store composition

### Tech Stack

- **Backend**: Medusa v2 (TypeScript/Node.js)
- **Frontend**: Next.js 15 with React 19
- **Database**: PostgreSQL
- **Cache & Events**: Redis
- **Payments**: Stripe (built-in)
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS
- **AI**: Claude Code for intelligent composition

### Architecture Philosophy

**Composition > Generation**

- 80% Reusable: Medusa handles cart, checkout, payments, inventory, orders
- 20% Custom: AI composes stores from templates and components
- Select and configure proven patterns rather than generating from scratch
- Type-safe throughout with shared TypeScript definitions
- Production-ready with battle-tested best practices

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Ecommerce Store Builder                  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
    ┌─────────▼─────────┐         ┌──────────▼──────────┐
    │   Medusa v2       │         │   Next.js 15        │
    │   Backend         │◄────────┤   Storefront        │
    │   (Port 9000)     │  API    │   (Port 3000)       │
    └─────────┬─────────┘         └──────────┬──────────┘
              │                               │
    ┌─────────▼─────────┐         ┌──────────▼──────────┐
    │   PostgreSQL      │         │   Component         │
    │   Database        │         │   Library           │
    └───────────────────┘         └─────────────────────┘
              │
    ┌─────────▼─────────┐
    │   Redis           │
    │   Cache & Events  │
    └───────────────────┘
```

### Core Components

1. **Medusa Backend** - Headless commerce engine
   - Product catalog management
   - Cart and checkout flows
   - Payment processing (Stripe)
   - Order management
   - Inventory tracking
   - Customer authentication
   - Admin dashboard

2. **Storefront Templates** - Pre-built Next.js stores
   - Minimal: Clean, fast, essential features
   - Bold: Modern, vibrant, feature-rich (planned)
   - Luxury: Premium, elegant, high-end (planned)

3. **Component Library** - Reusable commerce components
   - Product cards and grids
   - Cart UI components
   - Checkout forms
   - Search and filters (planned)

4. **Claude Commands** - AI-powered composition
   - Store planning and architecture
   - Component selection and configuration
   - Code generation from templates
   - Deployment guidance

---

## Project Structure

```
ecom-starter-template/
│
├── backend/                      # Medusa v2 Backend
│   ├── src/
│   │   ├── api/                 # Custom API routes
│   │   ├── modules/             # Custom Medusa modules
│   │   ├── workflows/           # Custom workflows
│   │   └── subscribers/         # Event subscribers
│   ├── medusa-config.ts         # Medusa configuration
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── tsconfig.json
│
├── storefront-templates/         # Next.js Storefronts
│   ├── minimal/                 # Minimal template
│   │   ├── app/                # Next.js App Router
│   │   ├── lib/                # Utilities & API client
│   │   ├── components/         # Template-specific components
│   │   ├── .env.local.example
│   │   ├── next.config.mjs
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   ├── bold/                   # Bold template (planned)
│   └── luxury/                 # Luxury template (planned)
│
├── component-library/           # Shared Components (planned)
│   ├── src/
│   │   ├── products/           # Product components
│   │   ├── cart/              # Cart components
│   │   ├── checkout/          # Checkout components
│   │   └── common/            # Common UI components
│   └── package.json
│
├── .claude/                    # Claude Code Integration (planned)
│   ├── commands/              # Slash commands
│   │   ├── create-store-plan/
│   │   ├── implement-store/
│   │   ├── edit-store/
│   │   └── deploy-store/
│   ├── agents/               # Specialized agents
│   │   ├── store-planner/
│   │   ├── store-builder/
│   │   └── component-generator/
│   └── settings.json         # Claude permissions
│
├── generated-stores/          # Output directory for generated stores
│
├── Makefile                  # Development commands
├── package.json             # Root workspace config
├── README.md               # Quick start guide
└── CLAUDE.md              # This file
```

---

## Development Commands

### Quick Reference

```bash
make install           # Install all dependencies
make dev              # Start backend + storefront
make dev-backend      # Start Medusa backend only (port 9000)
make dev-storefront   # Start Next.js storefront only (port 3000)
make build            # Build all workspaces
make type-check       # TypeScript type checking
make clean            # Remove node_modules
```

### Service URLs

- **Backend API**: http://localhost:9000
- **Admin Dashboard**: http://localhost:9000/app
- **Storefront**: http://localhost:3000

### Detailed Commands

#### Installation

```bash
# Install all dependencies across monorepo
make install

# Or manually
npm install
npm run install:all
```

#### Development

```bash
# Start both backend and storefront
make dev

# Start only backend (useful for testing API)
make dev-backend

# Start only storefront (backend must be running separately)
make dev-storefront
```

#### Building

```bash
# Build all workspaces for production
make build

# Build individual workspace
cd backend && npm run build
cd storefront-templates/minimal && npm run build
```

#### Type Checking

```bash
# Check TypeScript types across all workspaces
make type-check
```

#### Cleanup

```bash
# Remove all node_modules
make clean
```

---

## Medusa Backend

### Configuration

The backend is configured via `backend/medusa-config.ts`:

```typescript
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.POSTGRES_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
    workerMode: "shared", // or "worker" | "server"
  },
  admin: {
    disable: false,
    backendUrl: "http://localhost:9000",
  },
  modules: [
    // Cache and event bus use Redis
    { resolve: "@medusajs/medusa/cache-redis" },
    { resolve: "@medusajs/medusa/event-bus-redis" },
  ],
})
```

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```bash
# Database
POSTGRES_URL=postgres://localhost:5432/medusa_store

# Redis
REDIS_URL=redis://localhost:6379

# Backend URLs
MEDUSA_ADMIN_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_URL=http://localhost:9000/app

# CORS Configuration
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000

# Security (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key
COOKIE_SECRET=your-super-secret-cookie-key

# Payment Provider
STRIPE_API_KEY=sk_test_your_stripe_api_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Worker Mode
MEDUSA_WORKER_MODE=shared

# Environment
NODE_ENV=development
```

### Custom API Routes

Add custom API endpoints in `backend/src/api/`:

```typescript
// backend/src/api/store/custom/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // Your custom logic
  res.json({ message: "Custom endpoint" })
}
```

### Custom Modules

Create custom modules in `backend/src/modules/`:

```typescript
// backend/src/modules/my-module/service.ts
import { MedusaService } from "@medusajs/framework/utils"

class MyModuleService extends MedusaService({
  // Define your service
}) {
  async customMethod() {
    // Implementation
  }
}

export default MyModuleService
```

### Workflows

Define custom workflows in `backend/src/workflows/`:

```typescript
// backend/src/workflows/custom-workflow.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

export const customWorkflow = createWorkflow(
  "custom-workflow",
  function (input) {
    // Define workflow steps
    return new WorkflowResponse(result)
  }
)
```

### Database Setup

```bash
# 1. Ensure PostgreSQL is running
psql -U postgres

# 2. Create database
CREATE DATABASE medusa_store;

# 3. Run migrations
cd backend
npm run migrate

# 4. Seed data (optional)
npm run seed
```

---

## Storefront Templates

### Available Templates

#### Minimal Template
- Location: `storefront-templates/minimal/`
- Style: Clean, fast, essential features
- Use case: Getting started, MVP, simple stores

#### Bold Template (Planned)
- Style: Modern, vibrant, feature-rich
- Use case: Fashion, lifestyle, youth brands

#### Luxury Template (Planned)
- Style: Premium, elegant, sophisticated
- Use case: High-end brands, jewelry, luxury goods

### Customizing Templates

#### Environment Configuration

Copy `.env.local.example` to `.env.local`:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

#### Medusa Client Setup

The Medusa JS SDK is configured in `lib/medusa.ts`:

```typescript
import Medusa from "@medusajs/js-sdk"

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

#### TanStack Query Pattern

All API calls use TanStack Query for caching and state management:

```typescript
import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { products } = await medusa.store.product.list()
      return products
    },
  })
}
```

#### Component Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Homepage
├── products/
│   ├── page.tsx          # Product listing
│   └── [id]/
│       └── page.tsx      # Product detail
├── cart/
│   └── page.tsx          # Cart page
└── checkout/
    └── page.tsx          # Checkout page

components/
├── product-card.tsx      # Product card component
├── header.tsx           # Site header
└── footer.tsx          # Site footer

lib/
├── medusa.ts           # Medusa client
├── queries.ts          # TanStack Query hooks
└── utils.ts           # Utility functions
```

---

## Claude Commands Usage

### /create-store-plan

Creates a detailed plan for a new ecommerce store based on user requirements.

**Usage:**
```bash
/create-store-plan
```

**What it does:**
1. Asks questions about your store requirements
2. Analyzes your needs (products, features, style)
3. Recommends template and components
4. Creates detailed implementation plan
5. Saves plan to `generated-stores/{store-name}/plan.json`

**Output:**
- Store architecture document
- Component selection
- Feature requirements
- Timeline estimate

### /implement-store

Generates a complete store from a created plan.

**Usage:**
```bash
/implement-store
```

**What it does:**
1. Reads the store plan
2. Copies appropriate template
3. Configures components
4. Sets up environment variables
5. Generates custom components as needed
6. Creates README with setup instructions
7. **CRITICAL: Automated Verification & Testing** ⚠️
   - Run `make dev` to start backend + storefront
   - Check logs for startup errors
   - Test all API endpoints:
     - GET `/store/products` → verify products load
     - POST `/store/cart` → verify cart creation
     - POST `/store/cart/line-items` → verify add to cart
   - Hit the storefront at `localhost:3000`:
     - Verify homepage loads
     - Verify product pages show prices
     - Verify add to cart works
   - If ANY test fails:
     - Diagnose the root cause
     - Fix the issue automatically
     - Re-run tests
     - Iterate until ALL tests pass
   - Only report "Implementation complete" after all verification passes

**Output:**
- Complete store in `generated-stores/{store-name}/`
- Environment configuration
- Setup documentation
- **Verified working state** (all APIs tested and functional)

**Why This Matters:**
Without automated testing, issues like wrong module paths, missing API keys, incorrect SDK usage, or missing region setup go undetected until the user manually tests. This wastes time and breaks trust. The implementation MUST verify itself before claiming success.

### /edit-store

Makes iterative changes to an existing generated store.

**Usage:**
```bash
/edit-store
```

**What it does:**
1. Analyzes existing store
2. Understands requested changes
3. Modifies components and configuration
4. Maintains type safety
5. Updates documentation

**Use cases:**
- Add new features
- Modify styling
- Update components
- Fix issues

### /deploy-store

Provides deployment guidance and automation.

**Usage:**
```bash
/deploy-store
```

**What it does:**
1. Checks deployment readiness
2. Recommends hosting platform
3. Configures deployment settings
4. Sets up environment variables
5. Provides deployment commands

**Supports:**
- Backend: Railway, Medusa Cloud, AWS
- Storefront: Vercel, Netlify

---

## Code Style and Best Practices

### TypeScript Standards

1. **Strict Mode**: Always enabled
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true
     }
   }
   ```

2. **Type Everything**: No implicit `any` types
   ```typescript
   // Good
   function getProduct(id: string): Promise<Product> { }

   // Bad
   function getProduct(id) { }
   ```

3. **Use Type Inference**: Let TypeScript infer when obvious
   ```typescript
   // Good
   const products = await medusa.store.product.list()

   // Unnecessary
   const products: Product[] = await medusa.store.product.list()
   ```

### Component Patterns

1. **Composition Over Generation**
   - Reuse existing components
   - Extend with props, not duplication
   - Create variants with Tailwind classes

2. **Keep Components Small and Focused**
   ```typescript
   // Good: Single responsibility
   function ProductCard({ product }: { product: Product }) { }
   function ProductGrid({ products }: { products: Product[] }) { }

   // Bad: Too many responsibilities
   function ProductSection() { /* fetching, filtering, rendering */ }
   ```

3. **Server Components by Default**
   ```typescript
   // Use "use client" only when needed
   // (interactivity, browser APIs, context)
   "use client"
   import { useState } from "react"
   ```

### Styling Guidelines

1. **Tailwind Utility Classes**
   ```typescript
   // Good
   <div className="flex items-center gap-4 p-4 bg-white rounded-lg">

   // Avoid inline styles
   <div style={{ display: "flex", padding: "16px" }}>
   ```

2. **Consistent Spacing**: Use Tailwind's spacing scale
   - `gap-4`, `p-4`, `mt-8` instead of arbitrary values

3. **Responsive Design**: Mobile-first
   ```typescript
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
   ```

### API and Data Fetching

1. **Use TanStack Query for Client-Side**
   ```typescript
   const { data, isLoading, error } = useQuery({
     queryKey: ["products"],
     queryFn: () => medusa.store.product.list(),
   })
   ```

2. **Server Components for Static Data**
   ```typescript
   export default async function ProductsPage() {
     const { products } = await medusa.store.product.list()
     return <ProductGrid products={products} />
   }
   ```

3. **Error Handling**: Always handle errors
   ```typescript
   if (error) return <ErrorMessage error={error} />
   if (isLoading) return <LoadingSkeleton />
   ```

### General Best Practices

1. **Run Type Check Before Committing**
   ```bash
   make type-check
   ```

2. **Test Locally Before Deploying**
   ```bash
   make build
   npm run start # Test production build
   ```

3. **Environment Variables**
   - Never commit `.env` files
   - Always provide `.env.example`
   - Use `NEXT_PUBLIC_` prefix for client-side vars

4. **Documentation**
   - Document custom modules and workflows
   - Add JSDoc comments to complex functions
   - Update README when adding features

5. **Dependencies**
   - Keep dependencies up to date
   - Use exact versions in production
   - Audit regularly for security

6. **Git Practices**
   - Commit message format: `type: description`
   - Types: feat, fix, docs, refactor, test, chore
   - Keep commits focused and atomic

---

## Database

### PostgreSQL Setup

#### Local Development

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb medusa_store

# Or via psql
psql postgres
CREATE DATABASE medusa_store;
\q
```

#### Configuration

Connection string format:
```
postgres://username:password@host:port/database
```

Development example:
```
POSTGRES_URL=postgres://localhost:5432/medusa_store
```

### Schema Management

Medusa handles schema migrations automatically:

```bash
# Run pending migrations
npm run migrate

# Generate migration (after model changes)
medusa migrations generate
```

### Medusa Entities

Core entities managed by Medusa:
- **Product**: Product catalog
- **Variant**: Product variations (size, color, etc.)
- **Cart**: Shopping carts
- **Order**: Completed orders
- **Customer**: Customer accounts
- **Region**: Geographic regions and currencies
- **Payment**: Payment transactions
- **Fulfillment**: Shipping and fulfillment

### Custom Data Models

Create custom entities in `backend/src/models/`:

```typescript
import { model } from "@medusajs/framework/utils"

const CustomEntity = model.define("custom_entity", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  created_at: model.dateTime().default(new Date()),
})

export default CustomEntity
```

### Database Best Practices

1. **Use Transactions**: For multi-step operations
2. **Index Frequently Queried Fields**: Improve performance
3. **Backup Regularly**: Especially before migrations
4. **Monitor Query Performance**: Use PostgreSQL slow query log
5. **Use Connection Pooling**: For production deployments

---

## Testing

### Backend Testing

#### Unit Tests

```typescript
// backend/src/modules/__tests__/my-module.test.ts
import { MyModuleService } from "../service"

describe("MyModuleService", () => {
  it("should perform custom operation", async () => {
    const service = new MyModuleService()
    const result = await service.customMethod()
    expect(result).toBeDefined()
  })
})
```

#### API Tests

```typescript
// Test custom API routes
import { medusa } from "../../test-utils"

describe("GET /store/custom", () => {
  it("should return custom data", async () => {
    const response = await medusa.client.request("GET", "/store/custom")
    expect(response.status).toBe(200)
  })
})
```

### Storefront Testing

#### Component Tests

```typescript
// Using React Testing Library
import { render, screen } from "@testing-library/react"
import { ProductCard } from "@/components/product-card"

describe("ProductCard", () => {
  it("renders product information", () => {
    const product = { id: "1", title: "Test Product", price: 1000 }
    render(<ProductCard product={product} />)
    expect(screen.getByText("Test Product")).toBeInTheDocument()
  })
})
```

#### Integration Tests

Use Playwright or Cypress for end-to-end testing:

```typescript
// e2e/checkout.spec.ts
test("complete checkout flow", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await page.click('[data-testid="add-to-cart"]')
  await page.goto("/checkout")
  // Fill checkout form
  await page.click('[data-testid="place-order"]')
  await expect(page).toHaveURL(/.*\/order\/.*/)
})
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Storefront tests
cd storefront-templates/minimal
npm test

# E2E tests
npm run test:e2e
```

---

## Deployment

### Backend Deployment

#### Railway

1. **Create Railway Project**
   ```bash
   railway init
   ```

2. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

3. **Configure Environment Variables**
   ```bash
   railway variables set JWT_SECRET=your-secret
   railway variables set COOKIE_SECRET=your-secret
   railway variables set STORE_CORS=https://your-store.com
   ```

4. **Deploy**
   ```bash
   railway up
   ```

#### Medusa Cloud

1. **Install Medusa CLI**
   ```bash
   npm install -g @medusajs/cli
   ```

2. **Login and Deploy**
   ```bash
   medusa login
   medusa deploy
   ```

#### AWS (EC2 + RDS)

1. **Setup RDS PostgreSQL instance**
2. **Launch EC2 instance**
3. **Install Node.js 20+**
4. **Clone and build**
   ```bash
   git clone your-repo
   cd backend
   npm install
   npm run build
   ```
5. **Configure environment variables**
6. **Run with PM2**
   ```bash
   pm2 start npm --name "medusa" -- start
   ```

### Storefront Deployment

#### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd storefront-templates/minimal
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.com`

#### Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### Required Environment Variables

#### Backend (Production)

```bash
# Database
POSTGRES_URL=postgresql://user:pass@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379

# Backend URL
MEDUSA_ADMIN_BACKEND_URL=https://api.yourstore.com

# CORS (your storefront domain)
STORE_CORS=https://yourstore.com
ADMIN_CORS=https://admin.yourstore.com

# Security (generate strong random strings!)
JWT_SECRET=<strong-random-string>
COOKIE_SECRET=<strong-random-string>

# Payment
STRIPE_API_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_live_your_webhook

# Environment
NODE_ENV=production
```

#### Storefront (Production)

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.yourstore.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build successful locally
- [ ] CORS configured correctly
- [ ] SSL certificates installed
- [ ] Stripe webhooks configured
- [ ] Health check endpoint tested
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Backup strategy in place

---

## Troubleshooting

### Database Connection Errors

**Problem**: Cannot connect to PostgreSQL

```
Error: Connection refused at localhost:5432
```

**Solutions**:
1. Check PostgreSQL is running:
   ```bash
   brew services list  # macOS
   sudo systemctl status postgresql  # Linux
   ```

2. Verify connection string:
   ```bash
   psql postgres://localhost:5432/medusa_store
   ```

3. Check database exists:
   ```bash
   psql -U postgres -c "\l"
   ```

4. Create database if missing:
   ```bash
   createdb medusa_store
   ```

### Port Conflicts

**Problem**: Port 9000 or 3000 already in use

```
Error: listen EADDRINUSE: address already in use :::9000
```

**Solutions**:
1. Find process using port:
   ```bash
   lsof -i :9000  # Find process
   kill -9 <PID>  # Kill process
   ```

2. Or change port:
   ```bash
   # Backend
   PORT=9001 npm run dev

   # Storefront
   npm run dev -- -p 3001
   ```

### TypeScript Errors

**Problem**: Type errors after updating dependencies

**Solutions**:
1. Clear TypeScript cache:
   ```bash
   rm -rf node_modules/.cache
   ```

2. Regenerate types:
   ```bash
   make type-check
   ```

3. Check `tsconfig.json` compatibility

4. Ensure all workspaces use same TypeScript version

### Build Errors

**Problem**: Build fails with module errors

```
Error: Cannot find module '@medusajs/medusa'
```

**Solutions**:
1. Clean install:
   ```bash
   make clean
   make install
   ```

2. Check workspace configuration:
   ```bash
   npm ls  # List dependency tree
   ```

3. Verify all peer dependencies installed

4. Clear build cache:
   ```bash
   rm -rf .next/  # Next.js
   rm -rf dist/   # Backend
   ```

### Medusa Configuration Issues

**Problem**: Medusa fails to start

**Solutions**:
1. Verify `medusa-config.ts` syntax:
   ```bash
   tsc medusa-config.ts --noEmit
   ```

2. Check environment variables loaded:
   ```typescript
   console.log(process.env.POSTGRES_URL)  // Debug
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

4. Check logs:
   ```bash
   npm run dev -- --verbose
   ```

### Redis Connection Issues

**Problem**: Redis not connecting

**Solutions**:
1. Start Redis:
   ```bash
   brew services start redis  # macOS
   sudo systemctl start redis  # Linux
   ```

2. Test connection:
   ```bash
   redis-cli ping  # Should return PONG
   ```

3. Use in-memory alternative (development only):
   ```typescript
   // Comment out Redis modules in medusa-config.ts
   modules: [
     // { resolve: "@medusajs/medusa/cache-redis" },
   ]
   ```

### CORS Errors

**Problem**: Storefront cannot connect to backend

```
Access to fetch blocked by CORS policy
```

**Solutions**:
1. Check `STORE_CORS` environment variable:
   ```bash
   echo $STORE_CORS
   ```

2. Update `medusa-config.ts`:
   ```typescript
   storeCors: "http://localhost:3000,https://yourstore.com"
   ```

3. Restart backend after CORS changes

### Next.js Hydration Errors

**Problem**: React hydration mismatch

**Solutions**:
1. Ensure server and client render same content
2. Use `useEffect` for client-only code
3. Add `suppressHydrationWarning` if intentional:
   ```typescript
   <div suppressHydrationWarning>
     {typeof window !== 'undefined' && clientOnlyContent}
   </div>
   ```

---

## Additional Resources

### Documentation

- [Medusa Documentation](https://docs.medusajs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Community

- [Medusa Discord](https://discord.gg/medusajs)
- [Next.js Discord](https://discord.gg/nextjs)

### Tools

- [Medusa Admin](http://localhost:9000/app)
- [PostgreSQL GUI: Postico](https://eggerapps.at/postico/)
- [Redis GUI: RedisInsight](https://redis.com/redis-enterprise/redis-insight/)

---

## Getting Help

1. **Check Documentation**: Start with this guide and official docs
2. **Search Issues**: Check GitHub issues for similar problems
3. **Community Discord**: Ask in Medusa or Next.js Discord
4. **Create Issue**: If you found a bug, open a GitHub issue

---

**Last Updated**: 2026-03-15
**Version**: 1.0.0
