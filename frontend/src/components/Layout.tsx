import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser, getCurrentUser, selectCurrentUser, selectIsAuthenticated } from '../store/slices/userSlice';
import { 
  Home, Heart, Users, Info, Mail, 
  LayoutDashboard, Leaf, Phone, MapPin, Mail as MailIcon,
  Sparkles, ArrowUp, ChevronRight, Clock, Award, 
  LogIn, LogOut, UserCircle, Settings, ShoppingBag, 
  Truck, BarChart3, Shield, ClipboardList, Package,
  HandHelping, Utensils, Gift, Zap
} from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import { CgInstagram } from 'react-icons/cg';
import { LiaLinkedinIn } from 'react-icons/lia';
import AuthDialog from '../pages/Auth';
import { useAuthDialog } from '../context/AuthDialogContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDashboardRoute = location.pathname === '/dashboard' || 
                           location.pathname.startsWith('/dashboard/');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
    setIsMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const isActive = (path: string) => location.pathname === path;

  const getNavItems = () => {
    const commonItems = [
      { path: '/', label: 'Home', icon: Home, showAlways: true },
      { path: '/about', label: 'About', icon: Info, showAlways: true },
      { path: '/contact', label: 'Contact', icon: Mail, showAlways: true },
    ];
    const roleBasedItems: Record<string, any[]> = {
      donor: [
        { path: '/donate', label: 'Donate Food', icon: Gift },
        { path: '/my-donations', label: 'My Donations', icon: Package },
        { path: '/impact', label: 'My Impact', icon: Award },
      ],
      receiver: [
        { path: '/request', label: 'Request Food', icon: Utensils },
        { path: '/my-requests', label: 'My Requests', icon: ClipboardList },
        { path: '/available-food', label: 'Available Food', icon: ShoppingBag },
      ],
      volunteer: [
        { path: '/volunteer', label: 'Dashboard', icon: HandHelping },
        { path: '/deliveries', label: 'Deliveries', icon: Truck },
        { path: '/my-tasks', label: 'My Tasks', icon: ClipboardList },
      ],
      admin: [
        { path: '/admin', label: 'Admin Dashboard', icon: Shield },
        { path: '/admin/users', label: 'Manage Users', icon: Users },
        { path: '/admin/donations', label: 'All Donations', icon: Package },
      ],
    };
    let items = [...commonItems];
    if (currentUser?.role && roleBasedItems[currentUser.role]) {
      items.push(...roleBasedItems[currentUser.role]);
    }
    if (isAuthenticated) {
      items.push({ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, showAlways: true });
    }
    return items.filter(item => item.showAlways !== false);
  };

  const navItems = getNavItems();

  const quickStats = [
    { value: '10K+', label: 'Meals Donated', icon: Award },
    { value: '500+', label: 'Volunteers', icon: Users },
    { value: '24/7', label: 'Support', icon: Clock },
  ];

  const { isOpen: showAuth, openAuth, closeAuth } = useAuthDialog();

  const getRoleBadge = () => {
    if (!currentUser?.role) return null;
    const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
      donor: { label: 'Donor', color: 'role-donor', icon: Heart },
      receiver: { label: 'Receiver', color: 'role-receiver', icon: Utensils },
      volunteer: { label: 'Volunteer', color: 'role-volunteer', icon: HandHelping },
      admin: { label: 'Admin', color: 'role-admin', icon: Shield },
    };
    const config = roleConfig[currentUser.role];
    const Icon = config.icon;
    return (
      <span className={`role-badge ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (isDashboardRoute) return <>{children}</>;

  return (
    <div className="fd-root">
      {/* ── HEADER ── */}
      <header className={`fd-header ${isScrolled ? 'fd-header--scrolled' : 'fd-header--top'}`}>
        {/* Shimmer line at top */}
        <div className="fd-header__shimmer" />

        <div className="fd-container">
          <div className="fd-header__inner">
            {/* Logo */}
            <Link to="/" className="fd-logo">
              <div className="fd-logo__icon">
                <Leaf className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="fd-logo__text">
                <span className="fd-logo__name">FOOD DOER</span>
                <span className="fd-logo__accent">!!</span>
                <span className="fd-logo__dot" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="fd-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path}
                    className={`fd-nav__item ${active ? 'fd-nav__item--active' : ''} ${isScrolled ? 'fd-nav__item--light' : 'fd-nav__item--dark'}`}>
                    <Icon className="fd-nav__icon" />
                    <span>{item.label}</span>
                    {active && <span className="fd-nav__active-bar" />}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Area */}
            <div className="fd-auth">
              {isAuthenticated && currentUser ? (
                <div className="fd-user" ref={dropdownRef}>
                  {getRoleBadge()}
                  <button className="fd-user__trigger" onClick={() => setDropdownOpen(d => !d)}>
                    <div className="fd-avatar">
                      <span>{currentUser.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="fd-user__info">
                      <span className={`fd-user__name ${isScrolled ? 'text-scrolled' : 'text-top'}`}>
                        {currentUser.name?.split(' ')[0]}
                      </span>
                      <span className={`fd-user__role ${isScrolled ? 'text-scrolled-muted' : 'text-top-muted'}`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <ChevronRight className={`fd-user__chevron ${dropdownOpen ? 'rotated' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="fd-dropdown">
                      <div className="fd-dropdown__header">
                        <div className="fd-dropdown__avatar">
                          <span>{currentUser.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="fd-dropdown__fullname">{currentUser.name}</p>
                          <p className="fd-dropdown__email">{currentUser.email}</p>
                        </div>
                      </div>
                      <div className="fd-dropdown__divider" />
                      <div className="fd-dropdown__body">
                        <Link to="/profile" className="fd-dropdown__item" onClick={() => setDropdownOpen(false)}>
                          <UserCircle className="w-4 h-4" /> My Profile
                        </Link>
                        <Link to="/settings" className="fd-dropdown__item" onClick={() => setDropdownOpen(false)}>
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        {currentUser?.role === 'admin' && (
                          <>
                            <div className="fd-dropdown__section-label">Admin</div>
                            <Link to="/admin/requests" className="fd-dropdown__item" onClick={() => setDropdownOpen(false)}>
                              <ClipboardList className="w-4 h-4" /> All Requests
                            </Link>
                            <Link to="/admin/volunteers" className="fd-dropdown__item" onClick={() => setDropdownOpen(false)}>
                              <HandHelping className="w-4 h-4" /> Manage Volunteers
                            </Link>
                            <Link to="/admin/analytics" className="fd-dropdown__item" onClick={() => setDropdownOpen(false)}>
                              <BarChart3 className="w-4 h-4" /> Analytics
                            </Link>
                          </>
                        )}
                      </div>
                      <div className="fd-dropdown__divider" />
                      <button onClick={handleLogout} className="fd-dropdown__logout">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
               <button onClick={openAuth} className="fd-signin-btn">
  <LogIn className="w-4 h-4" />
  <span>Sign In</span>
</button>

// 3. Render the dialog in the same component:

              )}
            </div>

            {/* Mobile Hamburger */}
            <button className="fd-hamburger" onClick={() => setIsMobileMenuOpen(o => !o)}>
              <span className={`fd-hamburger__bar ${isMobileMenuOpen ? 'bar1-open' : ''} ${isScrolled ? 'bar-light' : 'bar-dark'}`} />
              <span className={`fd-hamburger__bar ${isMobileMenuOpen ? 'bar2-open' : ''} ${isScrolled ? 'bar-light' : 'bar-dark'}`} />
              <span className={`fd-hamburger__bar ${isMobileMenuOpen ? 'bar3-open' : ''} ${isScrolled ? 'bar-light' : 'bar-dark'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <div className={`fd-mobile-menu ${isMobileMenuOpen ? 'fd-mobile-menu--open' : ''}`}>
        <div className="fd-mobile-menu__inner">
          {isAuthenticated && currentUser && (
            <div className="fd-mobile-user">
              <div className="fd-avatar fd-avatar--lg">
                <span>{currentUser.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="fd-mobile-user__name">{currentUser.name}</p>
                <p className="fd-mobile-user__email">{currentUser.email}</p>
                {getRoleBadge()}
              </div>
            </div>
          )}

          <nav className="fd-mobile-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`fd-mobile-nav__item ${active ? 'fd-mobile-nav__item--active' : ''}`}>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="ml-auto w-4 h-4" />}
                </Link>
              );
            })}
          </nav>

          <div className="fd-mobile-stats">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="fd-mobile-stat">
                  <div className="fd-mobile-stat__icon"><Icon className="w-4 h-4" /></div>
                  <div className="fd-mobile-stat__val">{stat.value}</div>
                  <div className="fd-mobile-stat__label">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {isAuthenticated && (
            <button onClick={handleLogout} className="fd-mobile-logout">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="fd-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ── MAIN ── */}
      <main className="fd-main">{children}</main>

      {/* ── SCROLL TOP ── */}
      <button onClick={scrollToTop} className={`fd-scroll-top ${showScrollTop ? 'fd-scroll-top--visible' : ''}`}>
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* ── FOOTER ── */}
      <footer className="fd-footer">
        <div className="fd-footer__glow fd-footer__glow--1" />
        <div className="fd-footer__glow fd-footer__glow--2" />
        <div className="fd-footer__glow fd-footer__glow--3" />

        <div className="fd-container fd-footer__inner">
          <div className="fd-footer__grid">
            {/* Brand */}
            <div className="fd-footer__brand">
              <div className="fd-logo fd-logo--footer">
                <div className="fd-logo__icon fd-logo__icon--footer">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="fd-logo__text">
                  <span className="fd-logo__name fd-logo__name--footer">FOOD DOER</span>
                  <span className="fd-logo__accent">!!</span>
                </div>
              </div>
              <p className="fd-footer__tagline">
                Nourish Lives, Not Landfills.<br />
                Join the Food Revolution — together we can eliminate hunger and reduce food waste.
              </p>
              <div className="fd-social">
                {[
                  { Icon: FaFacebook, href: '#' },
                  { Icon: BsTwitterX, href: '#' },
                  { Icon: CgInstagram, href: '#' },
                  { Icon: LiaLinkedinIn, href: '#' },
                ].map(({ Icon, href }, i) => (
                  <a key={i} href={href} className="fd-social__link">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="fd-footer__heading">
                <Sparkles className="w-4 h-4" /> Quick Links
              </h4>
              <ul className="fd-footer__links">
                {navItems.slice(0, 5).map(item => (
                  <li key={item.path}>
                    <Link to={item.path} className="fd-footer__link">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <ChevronRight className="fd-footer__link-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="fd-footer__heading">
                <MailIcon className="w-4 h-4" /> Contact Info
              </h4>
              <ul className="fd-footer__contact">
                {[
                  { icon: Phone, text: '+91 7400100112' },
                  { icon: MapPin, text: 'Food Doer HQ, Indore, MP' },
                  { icon: MailIcon, text: 'Fooddoer@gmail.com' },
                  { icon: Clock, text: 'Mon–Sat: 9AM – 8PM' },
                ].map(({ icon: Icon, text }, i) => (
                  <li key={i} className="fd-footer__contact-item">
                    <div className="fd-footer__contact-icon"><Icon className="w-4 h-4" /></div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="fd-footer__heading">
                <Zap className="w-4 h-4" /> Stay Updated
              </h4>
              <p className="fd-footer__newsletter-desc">Subscribe for impact updates & stories</p>
              <div className="fd-newsletter">
                <input type="email" placeholder="your@email.com" className="fd-newsletter__input" />
                <button className="fd-newsletter__btn">Subscribe</button>
              </div>

              <div className="fd-footer__stats">
                {quickStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="fd-footer__stat">
                      <div className="fd-footer__stat-icon"><Icon className="w-3 h-3" /></div>
                      <div className="fd-footer__stat-val">{stat.value}</div>
                      <div className="fd-footer__stat-label">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="fd-footer__bottom">
            <p>© 2024 FOOD DOER!!. All rights reserved. Made with <span className="fd-heart">❤️</span> for a better tomorrow.</p>
            <div className="fd-footer__legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/faq">FAQ</Link>
            </div>
          </div>
        </div>

        <AuthDialog isOpen={showAuth} onClose={closeAuth} />
      </footer>

      <style>{`
        /* ─── TOKENS ─── */
        :root {
          --fd-brown:       #8D6E63;
          --fd-brown-dark:  #6E554D;
          --fd-brown-deep:  #5c453d;
          --fd-green:       #9CCC65;
          --fd-green-dark:  #8db854;
          --fd-white:       #ffffff;
          --fd-gray-50:     #f9fafb;
          --fd-gray-100:    #f3f4f6;
          --fd-gray-200:    #e5e7eb;
          --fd-gray-400:    #9ca3af;
          --fd-gray-500:    #6b7280;
          --fd-gray-600:    #4b5563;
          --fd-gray-700:    #374151;
          --fd-gray-800:    #1f2937;
          --fd-gray-900:    #111827;
          --fd-red:         #ef4444;
          
          --fd-font-display: 'Poppins', 'Segoe UI', sans-serif;
          --fd-font-body:    'DM Sans', 'Segoe UI', sans-serif;
          
          --fd-radius-sm:   8px;
          --fd-radius:      12px;
          --fd-radius-lg:   16px;
          --fd-radius-full: 9999px;
          
          --fd-shadow-sm:   0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
          --fd-shadow:      0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06);
          --fd-shadow-lg:   0 12px 40px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08);
          --fd-shadow-xl:   0 24px 60px rgba(0,0,0,0.16);
          
          --fd-header-h:    4rem;
        }

        @media (min-width: 1024px) {
          :root { --fd-header-h: 5rem; }
        }

        /* Google Fonts import */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ─── RESET / BASE ─── */
        *, *::before, *::after { box-sizing: border-box; }

        .fd-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #fafafa;
          font-family: var(--fd-font-body);
        }

        .fd-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }
        @media (min-width: 640px) { .fd-container { padding: 0 1.5rem; } }
        @media (min-width: 1024px) { .fd-container { padding: 0 2rem; } }

        /* ─── HEADER ─── */
        .fd-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fd-header__shimmer {
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--fd-green), transparent);
          opacity: 0.7;
        }

        .fd-header--top {
          background: linear-gradient(135deg, var(--fd-brown) 0%, var(--fd-brown-dark) 100%);
          box-shadow: 0 4px 24px rgba(110, 85, 77, 0.3);
        }

        .fd-header--scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 var(--fd-gray-100), var(--fd-shadow);
        }

        .fd-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--fd-header-h);
          gap: 1rem;
        }

        /* ─── LOGO ─── */
        .fd-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .fd-logo__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: var(--fd-radius-sm);
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          color: white;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .fd-header--scrolled .fd-logo__icon {
          background: linear-gradient(135deg, var(--fd-brown), var(--fd-brown-dark));
        }

        .fd-logo:hover .fd-logo__icon { transform: rotate(12deg) scale(1.05); }

        .fd-logo__text {
          display: flex;
          align-items: baseline;
          gap: 0.125rem;
          position: relative;
        }

        .fd-logo__name {
          font-family: var(--fd-font-display);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: white;
          transition: color 0.3s ease;
        }

        .fd-header--scrolled .fd-logo__name { color: var(--fd-gray-800); }

        .fd-logo__accent {
          font-family: var(--fd-font-display);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--fd-green);
        }

        .fd-logo__dot {
          position: absolute;
          top: -4px;
          right: -8px;
          width: 6px;
          height: 6px;
          background: var(--fd-green);
          border-radius: 50%;
          animation: fd-ping 2s ease-in-out infinite;
        }

        /* ─── DESKTOP NAV ─── */
        .fd-nav {
          display: none;
          align-items: center;
          gap: 0.25rem;
        }

        @media (min-width: 1024px) { .fd-nav { display: flex; } }

        .fd-nav__item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border-radius: var(--fd-radius);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.25s ease;
          overflow: hidden;
        }

        .fd-nav__item--dark {
          color: rgba(255,255,255,0.9);
        }
        .fd-nav__item--dark:hover {
          background: rgba(255,255,255,0.14);
          color: white;
        }
        .fd-nav__item--dark.fd-nav__item--active {
          background: rgba(255,255,255,0.18);
          color: white;
          backdrop-filter: blur(8px);
        }

        .fd-nav__item--light {
          color: var(--fd-gray-600);
        }
        .fd-nav__item--light:hover {
          background: var(--fd-gray-100);
          color: var(--fd-brown-dark);
        }
        .fd-nav__item--light.fd-nav__item--active {
          background: linear-gradient(135deg, rgba(141,110,99,0.1), rgba(110,85,77,0.08));
          color: var(--fd-brown-dark);
        }

        .fd-nav__icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .fd-nav__item:hover .fd-nav__icon { transform: scale(1.15); }
        .fd-nav__item--active .fd-nav__icon { color: var(--fd-green); }

        .fd-nav__active-bar {
          position: absolute;
          bottom: 0; left: 12px; right: 12px;
          height: 2px;
          background: var(--fd-green);
          border-radius: 2px 2px 0 0;
          animation: fd-slide-in 0.3s ease;
        }

        /* ─── AUTH AREA ─── */
        .fd-auth {
          display: none;
          align-items: center;
          gap: 0.75rem;
        }
        @media (min-width: 1024px) { .fd-auth { display: flex; } }

        .fd-signin-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: var(--fd-green);
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: var(--fd-radius);
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 2px 12px rgba(156,204,101,0.35);
        }
        .fd-signin-btn:hover {
          background: var(--fd-green-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(156,204,101,0.45);
        }

        /* ─── ROLE BADGE ─── */
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.625rem;
          border-radius: var(--fd-radius-full);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .role-donor   { background: rgba(156,204,101,0.15); color: #5a8f2a; border: 1px solid rgba(156,204,101,0.3); }
        .role-receiver{ background: rgba(59,130,246,0.12); color: #2563eb; border: 1px solid rgba(59,130,246,0.25); }
        .role-volunteer{background: rgba(139,92,246,0.12); color: #7c3aed; border: 1px solid rgba(139,92,246,0.25); }
        .role-admin   { background: rgba(239,68,68,0.1); color: #dc2626; border: 1px solid rgba(239,68,68,0.2); }

        /* ─── USER MENU ─── */
        .fd-user { position: relative; display: flex; align-items: center; gap: 0.625rem; }

        .fd-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--fd-brown), var(--fd-brown-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          border: 2px solid rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        .fd-avatar--lg {
          width: 3rem;
          height: 3rem;
          font-size: 1.1rem;
        }

        .fd-user__trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem 0.375rem 0.375rem;
          border: none;
          border-radius: var(--fd-radius);
          background: transparent;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .fd-user__trigger:hover { background: rgba(0,0,0,0.05); }

        .fd-user__info { text-align: left; display: flex; flex-direction: column; }
        .fd-user__name { font-size: 0.875rem; font-weight: 600; line-height: 1.2; }
        .fd-user__role { font-size: 0.7rem; line-height: 1.2; text-transform: capitalize; }

        .text-scrolled { color: var(--fd-gray-800); }
        .text-top { color: white; }
        .text-scrolled-muted { color: var(--fd-gray-500); }
        .text-top-muted { color: rgba(255,255,255,0.7); }

        .fd-user__chevron {
          width: 0.875rem;
          height: 0.875rem;
          color: var(--fd-gray-400);
          transition: transform 0.25s ease;
        }
        .fd-user__chevron.rotated { transform: rotate(90deg); }

        /* ─── DROPDOWN ─── */
        .fd-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 14rem;
          background: white;
          border-radius: var(--fd-radius-lg);
          box-shadow: var(--fd-shadow-xl), 0 0 0 1px rgba(0,0,0,0.04);
          z-index: 200;
          overflow: hidden;
          animation: fd-dropdown-in 0.2s cubic-bezier(0.2, 0, 0, 1.1);
          transform-origin: top right;
        }

        .fd-dropdown__header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(141,110,99,0.06), rgba(110,85,77,0.04));
        }

        .fd-dropdown__avatar {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--fd-brown), var(--fd-brown-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .fd-dropdown__fullname { font-size: 0.875rem; font-weight: 600; color: var(--fd-gray-800); margin: 0; }
        .fd-dropdown__email { font-size: 0.7rem; color: var(--fd-gray-500); margin: 0; }

        .fd-dropdown__divider { height: 1px; background: var(--fd-gray-100); margin: 0; }

        .fd-dropdown__body { padding: 0.375rem 0; }

        .fd-dropdown__section-label {
          padding: 0.375rem 1rem 0.25rem;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--fd-gray-400);
        }

        .fd-dropdown__item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: var(--fd-gray-700);
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .fd-dropdown__item:hover { background: var(--fd-gray-50); color: var(--fd-brown-dark); }

        .fd-dropdown__logout {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--fd-red);
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
          text-align: left;
        }
        .fd-dropdown__logout:hover { background: rgba(239,68,68,0.05); }

        /* ─── HAMBURGER ─── */
        .fd-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 2.5rem;
          height: 2.5rem;
          padding: 0.375rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--fd-radius-sm);
          transition: background 0.2s ease;
        }
        .fd-hamburger:hover { background: rgba(0,0,0,0.06); }
        @media (min-width: 1024px) { .fd-hamburger { display: none; } }

        .fd-hamburger__bar {
          display: block;
          height: 2px;
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
          transform-origin: center;
        }
        .bar-dark { background: rgba(255,255,255,0.9); }
        .bar-light { background: var(--fd-gray-700); }

        /* Animated X */
        .bar1-open { transform: translateY(7px) rotate(45deg); }
        .bar2-open { opacity: 0; transform: scaleX(0); }
        .bar3-open { transform: translateY(-7px) rotate(-45deg); }

        /* ─── MOBILE MENU ─── */
        .fd-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 98;
          backdrop-filter: blur(2px);
          animation: fd-fade-in 0.2s ease;
        }

        .fd-mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(20rem, 85vw);
          background: white;
          z-index: 99;
          overflow-y: auto;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -8px 0 40px rgba(0,0,0,0.15);
        }
        .fd-mobile-menu--open { transform: translateX(0); }

        .fd-mobile-menu__inner { padding: 5rem 1.25rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; }

        .fd-mobile-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(141,110,99,0.08), rgba(110,85,77,0.04));
          border-radius: var(--fd-radius);
          border: 1px solid rgba(141,110,99,0.1);
        }
        .fd-mobile-user__name { font-size: 0.9rem; font-weight: 600; color: var(--fd-gray-800); margin-bottom: 0.125rem; }
        .fd-mobile-user__email { font-size: 0.75rem; color: var(--fd-gray-500); margin-bottom: 0.375rem; }

        .fd-mobile-nav { display: flex; flex-direction: column; gap: 0.25rem; }

        .fd-mobile-nav__item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--fd-radius);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--fd-gray-600);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .fd-mobile-nav__item:hover {
          background: var(--fd-gray-50);
          color: var(--fd-brown-dark);
          transform: translateX(4px);
        }
        .fd-mobile-nav__item--active {
          background: linear-gradient(135deg, var(--fd-brown), var(--fd-brown-dark));
          color: white;
          box-shadow: 0 4px 16px rgba(141,110,99,0.3);
        }
        .fd-mobile-nav__item--active:hover { transform: none; }

        .fd-mobile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          padding: 1rem;
          background: var(--fd-gray-50);
          border-radius: var(--fd-radius);
        }
        .fd-mobile-stat { text-align: center; }
        .fd-mobile-stat__icon {
          display: inline-flex;
          padding: 0.375rem;
          background: white;
          border-radius: var(--fd-radius-sm);
          color: var(--fd-brown);
          box-shadow: var(--fd-shadow-sm);
          margin-bottom: 0.25rem;
        }
        .fd-mobile-stat__val { font-size: 0.875rem; font-weight: 700; color: var(--fd-gray-800); }
        .fd-mobile-stat__label { font-size: 0.65rem; color: var(--fd-gray-500); }

        .fd-mobile-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          border-radius: var(--fd-radius);
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(239,68,68,0.25);
        }
        .fd-mobile-logout:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(239,68,68,0.35);
        }

        /* ─── MAIN ─── */
        .fd-main {
          flex: 1;
          padding-top: var(--fd-header-h);
        }

        /* ─── SCROLL TOP ─── */
        .fd-scroll-top {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 50;
          width: 2.75rem;
          height: 2.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--fd-brown), var(--fd-brown-dark));
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(141,110,99,0.4);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(2rem) scale(0.8);
        }
        .fd-scroll-top--visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .fd-scroll-top:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 28px rgba(141,110,99,0.5);
        }

        /* ─── FOOTER ─── */
        .fd-footer {
          position: relative;
          background: var(--fd-gray-900);
          color: var(--fd-gray-400);
          overflow: hidden;
        }

        .fd-footer__glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .fd-footer__glow--1 {
          top: -4rem; left: 10%;
          width: 20rem; height: 20rem;
          background: radial-gradient(circle, rgba(156,204,101,0.12), transparent);
          animation: fd-pulse 6s ease-in-out infinite;
        }
        .fd-footer__glow--2 {
          bottom: -4rem; right: 10%;
          width: 24rem; height: 24rem;
          background: radial-gradient(circle, rgba(141,110,99,0.1), transparent);
          animation: fd-pulse 8s ease-in-out infinite 2s;
        }
        .fd-footer__glow--3 {
          top: 30%; left: 50%;
          width: 16rem; height: 16rem;
          background: radial-gradient(circle, rgba(156,204,101,0.06), transparent);
          animation: fd-pulse 5s ease-in-out infinite 1s;
        }

        .fd-footer__inner { position: relative; padding: 3.5rem 0 0; }

        .fd-footer__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        @media (min-width: 768px) { .fd-footer__grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .fd-footer__grid { grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 3rem; } }

        /* Footer Logo */
        .fd-logo--footer { margin-bottom: 1rem; }
        .fd-logo__icon--footer {
          background: linear-gradient(135deg, var(--fd-brown), var(--fd-brown-dark));
          border: none;
        }
        .fd-logo__name--footer { color: white; }

        .fd-footer__tagline {
          font-size: 0.875rem;
          line-height: 1.7;
          color: var(--fd-gray-400);
          margin-bottom: 1.25rem;
        }

        .fd-social { display: flex; gap: 0.5rem; }
        .fd-social__link {
          width: 2.25rem;
          height: 2.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--fd-gray-800);
          color: var(--fd-gray-400);
          border-radius: var(--fd-radius-sm);
          text-decoration: none;
          transition: all 0.25s ease;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .fd-social__link:hover {
          background: var(--fd-brown-dark);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(141,110,99,0.35);
        }

        .fd-footer__heading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--fd-font-display);
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
          margin: 0 0 1.25rem;
        }
        .fd-footer__heading svg { color: var(--fd-green); }

        .fd-footer__links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.625rem; }

        .fd-footer__link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--fd-gray-400);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .fd-footer__link-arrow {
          width: 0.75rem;
          height: 0.75rem;
          margin-left: auto;
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s ease;
        }
        .fd-footer__link:hover {
          color: var(--fd-green);
          transform: translateX(4px);
        }
        .fd-footer__link:hover .fd-footer__link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .fd-footer__contact { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.875rem; }
        .fd-footer__contact-item { display: flex; align-items: flex-start; gap: 0.75rem; }
        .fd-footer__contact-icon {
          width: 2rem;
          height: 2rem;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--fd-gray-800);
          border-radius: var(--fd-radius-sm);
          color: var(--fd-green);
          border: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s ease;
        }
        .fd-footer__contact-item:hover .fd-footer__contact-icon { background: var(--fd-brown-dark); }
        .fd-footer__contact span { font-size: 0.875rem; padding-top: 0.375rem; }

        .fd-footer__newsletter-desc { font-size: 0.825rem; color: var(--fd-gray-400); margin: 0 0 0.75rem; }

        .fd-newsletter { display: flex; border-radius: var(--fd-radius); overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
        .fd-newsletter__input {
          flex: 1;
          padding: 0.625rem 0.875rem;
          background: var(--fd-gray-800);
          border: none;
          color: white;
          font-size: 0.875rem;
          outline: none;
          font-family: var(--fd-font-body);
          transition: background 0.2s ease;
        }
        .fd-newsletter__input::placeholder { color: var(--fd-gray-500); }
        .fd-newsletter__input:focus { background: rgba(31,41,55,0.9); }
        .fd-newsletter__btn {
          padding: 0.625rem 1rem;
          background: linear-gradient(135deg, var(--fd-brown), var(--fd-brown-dark));
          color: white;
          border: none;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--fd-font-body);
          white-space: nowrap;
          transition: background 0.25s ease;
        }
        .fd-newsletter__btn:hover { background: linear-gradient(135deg, var(--fd-brown-dark), var(--fd-brown-deep)); }

        .fd-footer__stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .fd-footer__stat { text-align: center; }
        .fd-footer__stat-icon {
          display: inline-flex;
          padding: 0.3rem;
          background: var(--fd-gray-800);
          border-radius: 6px;
          color: var(--fd-green);
          margin-bottom: 0.25rem;
        }
        .fd-footer__stat-val { font-size: 0.75rem; font-weight: 700; color: white; }
        .fd-footer__stat-label { font-size: 0.6rem; color: var(--fd-gray-500); }

        .fd-footer__bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 3rem;
          padding: 1.25rem 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 0.8rem;
        }
        @media (min-width: 768px) {
          .fd-footer__bottom { flex-direction: row; justify-content: space-between; }
        }

        .fd-heart { display: inline; }

        .fd-footer__legal { display: flex; gap: 1.5rem; }
        .fd-footer__legal a {
          color: var(--fd-gray-500);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .fd-footer__legal a:hover { color: var(--fd-green); }

        /* ─── SCROLLBAR ─── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(141,110,99,0.4); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--fd-brown); }

        /* ─── KEYFRAMES ─── */
        @keyframes fd-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }

        @keyframes fd-slide-in {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        @keyframes fd-dropdown-in {
          from { opacity: 0; transform: scale(0.94) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes fd-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes fd-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
