import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectIsAuthenticated, selectUser, clearUser } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/api/authApi';
import { useGetCartQuery } from '@/api/cartApi';
import { useGetWishlistQuery } from '@/api/wishlistApi';
import { BRAND_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function StorefrontLayout() {
  const [open, setOpen] = useState(false);
  const isAuth = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const { data: cart } = useGetCartQuery(undefined, { skip: !isAuth });
  const { data: wl } = useGetWishlistQuery(undefined, { skip: !isAuth });
  const cartCount = cart?.data?.itemCount || 0;
  const wlCount = wl?.data?.itemCount || 0;

  // My Orders + Track Order appear in the navbar only for signed-in customers.
  const navItems = isAuth
    ? [...NAV, { to: '/orders', label: 'My Orders' }, { to: '/track', label: 'Track Order' }]
    : NAV;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {/* ignore */}
    localStorage.removeItem('riwaya_token');
    dispatch(clearUser());
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="dark sticky top-0 z-30 border-b bg-background/85 text-foreground backdrop-blur">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-primary truncate min-w-0">
            {BRAND_NAME}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="relative text-sm font-medium transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link to="/products" className="p-2 rounded-md transition-colors hover:bg-accent/30" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
            <Link to="/wishlist" className="p-2 rounded-md transition-colors hover:bg-accent/30 relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wlCount > 0 && (
                <span key={wlCount} className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-scale-in">
                  {wlCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 rounded-md transition-colors hover:bg-accent/30 relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span key={cartCount} className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuth ? (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link to="/profile" className="p-2 rounded-md transition-colors hover:bg-accent/30 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-md transition-colors hover:bg-accent/30" aria-label="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-accent/30"
              >
                Sign in
              </Link>
            )}
            <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} aria-controls="mobile-nav">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div id="mobile-nav" className={cn('md:hidden border-t', open ? 'block animate-fade-down' : 'hidden')}>
          <div className="container py-3 flex flex-col gap-2">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
            {isAuth ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="py-2 text-sm font-medium transition-colors hover:text-primary">
                  Profile
                </Link>
                <button onClick={handleLogout} className="py-2 text-sm font-medium text-left transition-colors hover:text-primary">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-sm font-medium transition-colors hover:text-primary">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="dark bg-background text-foreground border-t mt-16">
        <div className="container py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="font-serif text-2xl text-primary">{BRAND_NAME}</div>
            <p className="text-sm text-muted-foreground mt-2">Premium Pakistani clothing — bridal, formal & embroidered.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="transition-colors hover:text-primary">All Products</Link></li>
              <li><Link to="/products?featured=true" className="transition-colors hover:text-primary">Featured</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/profile" className="transition-colors hover:text-primary">My Profile</Link></li>
              <li><Link to="/orders" className="transition-colors hover:text-primary">My Orders</Link></li>
              <li><Link to="/track" className="transition-colors hover:text-primary">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="transition-colors hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
