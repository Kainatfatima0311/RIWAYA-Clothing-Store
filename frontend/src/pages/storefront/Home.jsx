import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { useStorefrontFeaturedQuery, useStorefrontCategoriesQuery } from '@/api/productApi';
import { ProductCard, ProductCardSkeleton } from '@/components/storefront/ProductCard';
// Imported (not a /public path) so Vite bundles it with a content-hashed filename —
// guaranteed to resolve on Vercel regardless of base path.
import heroImg from '@/assets/hero2.jpeg';

export default function Home() {
  const { data: featured, isLoading: loadingFeatured } = useStorefrontFeaturedQuery(8);
  const { data: categories } = useStorefrontCategoriesQuery();

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-neutral-900 min-h-[85vh] flex items-center py-20">
        {/* Hero background photo */}
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
        />
        {/* Readability overlay so the headline stays legible over the photo */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/40" />
        {/* Focused dark spotlight behind the headline so the text stays prominent */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse 72% 60% at 50% 42%, rgba(0,0,0,0.62), rgba(0,0,0,0) 72%)' }}
        />
        {/* Ambient light sweep — subtle continuous "live" motion across the hero */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen" />
        </div>
        <div className="container text-center text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-4 animate-fade-up">A timeless tradition</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-balance leading-tight drop-shadow-lg animate-fade-up" style={{ animationDelay: '80ms' }}>
            Crafted in heritage,<br />
            <span className="text-accent">worn with pride.</span>
          </h1>
          <p className="mt-6 text-white/85 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '160ms' }}>
            RIWAYA brings you the finest embroidered, bridal, and formal wear — designed with grace, made for unforgettable moments.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <Link to="/products"><Button size="lg">Shop the collection</Button></Link>
            <Link to="/about"><Button size="lg" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white hover:text-foreground transition-colors">Our story</Button></Link>
          </div>
        </div>

        {/* Live scroll cue — gentle continuous bounce */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 animate-bounce" aria-hidden="true">
          <ChevronDown className="h-6 w-6" />
        </div>
      </section>

      <section className="container py-16 grid md:grid-cols-3 gap-8">
        {[
          { icon: Sparkles, title: 'Hand-crafted embroidery', desc: 'Each piece is a labour of love by skilled artisans.' },
          { icon: ShieldCheck, title: 'Premium fabrics', desc: 'Lawn, silk, chiffon — sourced for comfort and elegance.' },
          { icon: Truck, title: 'Fast nationwide delivery', desc: 'Cash on delivery and online payment available.' },
        ].map((v, i) => (
          <Reveal key={v.title} delay={i * 60} className="text-center p-6 rounded-lg hover-lift">
            <v.icon className="h-10 w-10 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-1">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </Reveal>
        ))}
      </section>

      {categories?.data?.length > 0 && (
        <section className="container py-12 border-t">
          <Reveal animation="fade-up" className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">Shop by Category</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.data.slice(0, 8).map((cat, i) => {
              const hasImage = !!cat.image?.url;
              return (
                <Reveal key={cat._id} delay={Math.min(i * 60, 400)}>
                <Link
                  to={`/products?category=${cat._id}`}
                  className="group relative aspect-[4/5] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/30 flex items-end justify-center text-center p-4 hover-lift"
                >
                  {hasImage && (
                    <>
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      {/* Dark overlay so the title stays legible over any photo */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </>
                  )}
                  <div className="relative">
                    <div className={`font-serif text-xl ${hasImage ? 'text-white drop-shadow' : 'text-primary'}`}>{cat.name}</div>
                    <div className={`text-xs mt-1 ${hasImage ? 'text-white/80' : 'text-muted-foreground'}`}>{cat.productCount || 0} items</div>
                  </div>
                </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      <section className="container py-16 border-t">
        <Reveal animation="fade-up" className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">Featured Pieces</h2>
            <p className="text-muted-foreground mt-1">Hand-picked for the season</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:gap-2 hover:text-primary-hover transition-all">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {loadingFeatured ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : featured?.data?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.data.map((p, i) => (
              <Reveal key={p._id} delay={Math.min(i * 60, 400)}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No featured products yet. Mark some products as Featured in the admin panel.</p>
        )}
      </section>
    </div>
  );
}
