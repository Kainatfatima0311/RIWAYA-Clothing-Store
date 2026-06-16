import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Scissors, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BRAND_NAME } from '@/lib/constants';
// Imported so Vite content-hashes them → deployment-safe on Vercel.
import about1 from '@/assets/about/about1.jpeg';
import about2 from '@/assets/about/about2.jpeg';
import about3 from '@/assets/about/about3.jpeg';
import about4 from '@/assets/about/about4.jpeg';
import about5 from '@/assets/about/about5.jpeg';

const VALUES = [
  { icon: Scissors, title: 'Heritage craftsmanship', desc: 'Hand-stitched embroidery and detailing by skilled Pakistani artisans, passed down through generations.' },
  { icon: ShieldCheck, title: 'Premium fabrics', desc: 'Lawn, silk, chiffon and velvet — carefully sourced for comfort, drape and lasting elegance.' },
  { icon: Sparkles, title: 'Timeless design', desc: 'Traditional motifs reimagined in contemporary silhouettes for the modern wardrobe.' },
  { icon: Heart, title: 'Made with love', desc: 'Every piece is finished with the care we would give to our own family’s celebrations.' },
];

const PILLARS = [
  { k: 'Handcrafted', v: 'Every piece' },
  { k: 'Nationwide', v: 'Delivery' },
  { k: 'Secure', v: 'Payments & COD' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-neutral-900 py-28 md:py-40">
        <img src={about1} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/40" />
        <div className="container text-center max-w-3xl text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-4">Our Story</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight text-balance drop-shadow-lg">
            Woven from tradition,<br />
            <span className="text-accent">made for today.</span>
          </h1>
          <p className="mt-6 text-white/85">
            {BRAND_NAME} was born from a love of Pakistan’s timeless textile heritage. Every thread, every motif
            tells a story — and we’re here to keep that story alive for the next generation.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-muted-foreground order-2 md:order-1">
          <h2 className="font-serif text-3xl text-foreground">From the artisan’s hands to yours</h2>
          <p>
            What began as a small studio of embroiderers has grown into a house of bridal, formal and everyday wear.
            We work directly with karigars who treat every kameez, sharara and dupatta as a canvas.
          </p>
          <p>
            From hand-stitched zardozi to flowing chiffon drapes, our pieces blend traditional craftsmanship with
            contemporary silhouettes — so you feel rooted and effortlessly modern at once.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {PILLARS.map((p) => (
              <div key={p.k} className="rounded-xl border bg-card p-4 text-center">
                <div className="font-serif text-xl text-primary">{p.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.v}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/products"><Button>Shop the collection</Button></Link>
            <Link to="/contact"><Button variant="outline">Talk to us</Button></Link>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <img src={about3} alt="RIWAYA craftsmanship" className="w-full rounded-2xl object-cover aspect-[4/3] shadow-sm" />
        </div>
      </section>

      {/* Values */}
      <section className="border-t">
        <div className="container py-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl">What we stand for</h2>
            <p className="text-muted-foreground mt-2">The promises behind every {BRAND_NAME} piece.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border bg-card p-6">
                <div className="rounded-full bg-primary/10 p-3 w-fit text-primary mb-4">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier gallery */}
      <section className="border-t">
        <div className="container py-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl">Inside our atelier</h2>
            <p className="text-muted-foreground mt-2">A glimpse of the people and craft behind the collection.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img src={about4} alt="RIWAYA atelier" className="w-full rounded-2xl object-cover aspect-[16/10] shadow-sm" />
            <img src={about5} alt="RIWAYA detailing" className="w-full rounded-2xl object-cover aspect-[16/10] shadow-sm" />
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative isolate overflow-hidden bg-neutral-900">
        <img src={about2} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/55 to-black/45" />
        <div className="container py-20 text-center max-w-2xl text-white">
          <h2 className="font-serif text-3xl md:text-4xl drop-shadow">Find your next favourite</h2>
          <p className="text-white/85 mt-3">
            Explore our latest bridal, formal and embroidered collections — handpicked for the season.
          </p>
          <Link to="/products" className="inline-block mt-6">
            <Button size="lg">Browse products <ArrowRight className="h-4 w-4 ml-2" /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
