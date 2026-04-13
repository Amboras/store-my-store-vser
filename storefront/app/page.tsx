'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Truck, Shield, RotateCcw, Star } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'
import { HERO_PLACEHOLDER, LIFESTYLE_PLACEHOLDER } from '@/lib/utils/placeholder-images'

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsletterEmail.trim()) {
      return
    }

    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />

        <div className="container-custom grid lg:grid-cols-2 gap-8 items-center py-section lg:py-32">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-accent">
              🐾 New Arrivals Just Dropped!
            </span>
            <h1 className="text-display font-heading font-black text-balance leading-tight">
              Your Pet Deserves the{' '}
              <span className="text-accent">Very Best</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              From tail-wagging toys to cosy beds and yummy treats — everything your furry, feathery, or scaly best friend needs, all in one happy place. 🐶🐱🐹
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-200 transition-all hover:opacity-90 hover:shadow-orange-300 hover:-translate-y-0.5"
                prefetch={true}
              >
                Shop for Pets
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border-2 border-accent px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-accent transition-all hover:bg-accent hover:text-white"
                prefetch={true}
              >
                Our Story 🐾
              </Link>
            </div>
            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-1">
                {['🐶', '🐱', '🐰'].map((emoji, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-base ring-2 ring-amber-50"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">10,000+</span> happy pet families
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-orange-100 animate-fade-in">
            <Image
              src={HERO_PLACEHOLDER}
              alt="Happy pets with their favourite products"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* Floating badge */}
            <div className="absolute top-4 right-4 rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-2 shadow-lg">
              <p className="text-xs font-bold text-accent uppercase tracking-wide">🎉 Free Shipping</p>
              <p className="text-xs text-muted-foreground">On orders over $50</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Category Pills */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { emoji: '🐶', label: 'Dogs', href: '/products?category=dogs' },
              { emoji: '🐱', label: 'Cats', href: '/products?category=cats' },
              { emoji: '🐰', label: 'Small Pets', href: '/products?category=small-pets' },
              { emoji: '🐦', label: 'Birds', href: '/products?category=birds' },
              { emoji: '🐠', label: 'Fish', href: '/products?category=fish' },
              { emoji: '🦎', label: 'Reptiles', href: '/products?category=reptiles' },
            ].map((pet) => (
              <Link
                key={pet.label}
                href={pet.href}
                className="flex items-center gap-2 rounded-full border-2 border-border px-5 py-2 text-sm font-semibold transition-all hover:border-accent hover:text-accent hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-lg">{pet.emoji}</span>
                {pet.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* Why Pet Owners Love Us */}
      <section className="py-section bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container-custom">
          <div className="text-center mb-12 space-y-3">
            <span className="text-3xl">🐾</span>
            <h2 className="text-h2 font-heading font-black">
              Why Pet Parents Love PawShop
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re obsessed with pets just as much as you are. Here&apos;s what makes us tail-waggingly different.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🧪',
                title: 'Vet Approved',
                desc: 'Every product is reviewed for safety and quality — so you can shop worry-free.',
              },
              {
                emoji: '🌿',
                title: 'Pet-Safe & Natural',
                desc: 'We prioritise natural, non-toxic materials because your pets are family.',
              },
              {
                emoji: '💛',
                title: 'Made with Love',
                desc: 'Our team of passionate pet owners hand-picks every single item in our store.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 text-center shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="mb-4 text-5xl">{item.emoji}</div>
                <h3 className="text-h4 font-heading font-black mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial / Brand Story Section */}
      <section className="py-section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[4/5] bg-muted rounded-3xl overflow-hidden relative shadow-xl">
              <Image
                src={LIFESTYLE_PLACEHOLDER}
                alt="Happy pet with their owner"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 lg:max-w-md">
              <span className="text-3xl">💛</span>
              <h2 className="text-h2 font-heading font-black">
                A Store Built by Pet Lovers, for Pet Lovers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                PawShop was born from a simple idea: pets deserve the best, and finding great products shouldn&apos;t be hard. We curate everything with love, fun, and your pet&apos;s happiness in mind.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From playful toys that survive even the most energetic pups, to cosy beds your cat will never leave — we&apos;ve got you covered.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                prefetch={true}
              >
                Meet the Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Features Bar */}
      <section className="py-section-sm border-y bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
              <span className="text-3xl">🚚</span>
              <div>
                <p className="text-sm font-bold">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On all orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <span className="text-3xl">🔄</span>
              <div>
                <p className="text-sm font-bold">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day hassle-free returns</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end text-center md:text-right">
              <span className="text-3xl">🔒</span>
              <div>
                <p className="text-sm font-bold">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-section bg-gradient-to-br from-orange-400 to-amber-400">
        <div className="container-custom max-w-xl text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="text-h2 font-heading font-black text-white">Join the PawShop Pack!</h2>
          <p className="mt-3 text-white/80">
            Get exclusive pet care tips, new arrivals, and members-only deals delivered straight to your inbox.
          </p>
          <form className="mt-8 flex gap-2" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 rounded-full border-0 bg-white/90 px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:bg-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
            />
            <button
              type="submit"
              className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Join the Pack 🐾
            </button>
          </form>
          <p className="mt-3 text-xs text-white/60">No spam, ever. Unsubscribe any time.</p>
        </div>
      </section>
    </>
  )
}
