import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Map of supported entrance animations → literal Tailwind classes so the JIT
// compiler always includes them (dynamic `animate-${x}` would be purged).
const ANIM = {
  'fade-up': 'animate-fade-up',
  'fade-in': 'animate-fade-in',
  'fade-down': 'animate-fade-down',
  'scale-in': 'animate-scale-in',
  'slide-in-right': 'animate-slide-in-right',
};

/**
 * Reveal — animates its children into view the first time they scroll into the
 * viewport (IntersectionObserver, no dependencies). Falls back to visible when
 * IntersectionObserver is unavailable. Respects prefers-reduced-motion via the
 * global CSS guard (animations collapse to ~0ms there).
 *
 * Props:
 *   animation: one of ANIM keys (default 'fade-up')
 *   delay:     ms to stagger the entrance (for grids/lists)
 *   as:        element/tag to render (default 'div')
 *   once:      animate only once (default true)
 */
export function Reveal({ children, className, animation = 'fade-up', delay = 0, as: Tag = 'div', once = true, ...props }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(shown ? ANIM[animation] || ANIM['fade-up'] : 'opacity-0', className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
