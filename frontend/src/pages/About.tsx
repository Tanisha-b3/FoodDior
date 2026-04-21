import { Link } from 'react-router-dom';
import { Users, Heart, Target, Award, Leaf, ArrowRight, Quote, Sparkles, Globe,  CheckCircle, TrendingUp, Clock, Star, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ── intersection observer ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── counter ── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let s = 0; const step = target / 80;
    const id = setInterval(() => {
      s += step;
      if (s >= target) { setCount(target); clearInterval(id); } else setCount(Math.floor(s));
    }, 14);
    return () => clearInterval(id);
  }, [visible, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const MARQUEE = [
  '🍱 5,000+ Meals Donated','❤️ 200+ Volunteers','🌍 50+ Partner NGOs',
  '🏆 10,000+ Lives Impacted','🥗 Zero Hunger Mission','♻️ Reducing Food Waste',
  '🤝 Community First','🌱 Sustainable Future',
];

export default function About() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();
  const s4 = useInView(); const s5 = useInView(); const s6 = useInView(); const s7 = useInView();

  const stats = [
    { n: 5000, suf: '+', label: 'Meals Donated', icon: Heart, grad: 'from-rose-500 to-pink-600', textCol: '#e11d48' },
    { n: 200,  suf: '+', label: 'Volunteers',    icon: Users, grad: 'from-amber-500 to-orange-500', textCol: '#d97706' },
    { n: 50,   suf: '+', label: 'NGO Partners',  icon: Globe, grad: 'from-emerald-500 to-teal-500', textCol: '#059669' },
    { n: 10000,suf: '+', label: 'Lives Impacted',icon: Award, grad: 'from-violet-500 to-purple-600', textCol: '#7c3aed' },
  ];

  const values = [
    { title: 'Zero Hunger', desc: 'Working tirelessly so no one sleeps hungry. We bridge the gap between surplus and scarcity, one meal at a time.', icon: Target, accent: '#9CCC65', num: '01', points: ['Daily food rescue ops', 'Community kitchens', '12+ city reach'] },
    { title: 'Sustainability', desc: 'Every plate saved is a step toward a healthier planet. We transform would-be waste into nourishment that truly matters.', icon: Leaf, accent: '#8D6E63', num: '02', points: ['Zero landfill mission', 'Eco packaging', 'Carbon-neutral delivery'] },
    { title: 'Community First', desc: 'Stronger communities are built through shared resources and shared humanity. We show up because you show up.', icon: Heart, accent: '#E8A87C', num: '03', points: ['Volunteer-led network', 'Local partnerships', 'Real-time matching'] },
  ];

  const timeline = [
    { year: '2021', title: 'Founded', desc: 'Started with a single kitchen and a dream to end surplus food waste in Indore.', icon: Star },
    { year: '2022', title: '1,000 Meals', desc: 'Reached our first major milestone — 1,000 meals donated to families in need.', icon: Award },
    { year: '2023', title: 'NGO Network', desc: 'Built a network of 50+ NGO partners across Madhya Pradesh state.', icon: Globe },
    { year: '2024', title: '10K Lives', desc: 'Impacted over 10,000 lives and counting. The revolution continues.', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif", background: '#F8F6F2' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');

        /* ── reveals ── */
        .rv   { opacity:0; transform:translateY(28px);  transition:opacity .7s ease,transform .7s ease; }
        .rv.in{ opacity:1; transform:none; }
        .rv-l   { opacity:0; transform:translateX(-36px); transition:opacity .7s ease,transform .7s ease; }
        .rv-l.in{ opacity:1; transform:none; }
        .rv-r   { opacity:0; transform:translateX(36px);  transition:opacity .7s ease,transform .7s ease; }
        .rv-r.in{ opacity:1; transform:none; }
        .d1{ transition-delay:.1s!important }
        .d2{ transition-delay:.2s!important }
        .d3{ transition-delay:.3s!important }
        .d4{ transition-delay:.4s!important }

        /* ── marquee ── */
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-track { animation: marquee 28s linear infinite; }

        /* ── float ── */
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .float1 { animation: floatUp 4.5s ease-in-out infinite; }
        .float2 { animation: floatUp 5.5s ease-in-out infinite 1s; }

        /* ── spin ── */
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin-ring { animation: spin 22s linear infinite; }

        /* ── live dot ── */
        @keyframes livepulse { 0%,100%{box-shadow:0 0 0 0 rgba(156,204,101,.55)} 50%{box-shadow:0 0 0 7px rgba(156,204,101,0)} }

        /* ── hero animate in ── */
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
        .au0 { animation: fadeUp .75s ease both; }
        .au1 { animation: fadeUp .75s .1s ease both; }
        .au2 { animation: fadeUp .75s .2s ease both; }
        .au3 { animation: fadeUp .75s .32s ease both; }
        .au4 { animation: fadeUp .75s .44s ease both; }

        /* ── value card hover bar ── */
        .val-bar { transform:scaleX(0); transform-origin:left; transition:transform .4s ease; }
        .val-wrap:hover .val-bar { transform:scaleX(1); }
        .val-icon { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        .val-wrap:hover .val-icon { transform:rotate(-7deg) scale(1.1); }

        /* ── bento hover ── */
        .bc-icon { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        .bento-c:hover .bc-icon { transform:rotate(-8deg) scale(1.12); }
        .bento-bar { opacity:0; transition:opacity .3s ease; }
        .bento-c:hover .bento-bar { opacity:1; }

        /* ── gallery zoom ── */
        .gal-img { transition: transform .7s cubic-bezier(.4,0,.2,1); }
        .gal-card:hover .gal-img { transform:scale(1.06); }

        /* ── team card ── */
        .team-img { transition: transform .7s ease; }
        .team-card-w:hover .team-img { transform:scale(1.04); }

        /* ── scrollbar ── */
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:rgba(141,110,99,.35);border-radius:3px}
      `}</style>

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#1C0F0A' }}>

        {/* mesh gradients */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 15% 55%, rgba(141,110,99,.38) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 82% 25%, rgba(156,204,101,.1) 0%, transparent 55%), radial-gradient(ellipse 55% 55% at 60% 85%, rgba(90,50,35,.45) 0%, transparent 50%)' }} />

        {/* parallax bg img */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: `translateY(${scrollY * 0.18}px)`, backgroundImage: "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }} />

        {/* grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />

        {/* cursor light */}
        <div className="absolute pointer-events-none" style={{ width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(156,204,101,.055) 0%,transparent 65%)', left: mousePos.x, top: mousePos.y, transform: 'translate(-50%,-50%)', transition: 'left .7s ease,top .7s ease' }} />

        {/* organic blob decorations */}
        <svg className="absolute pointer-events-none opacity-10" style={{ top: '-5%', right: '-4%', width: '42vw', maxWidth: 560 }} viewBox="0 0 560 560" fill="none">
          <path d="M280,50 C400,45 520,130 520,280 C520,420 400,520 280,515 C160,510 40,430 40,280 C40,130 160,55 280,50Z" fill="rgba(156,204,101,1)" />
        </svg>
        <svg className="absolute pointer-events-none opacity-10" style={{ bottom: '3%', left: '-7%', width: '33vw', maxWidth: 420 }} viewBox="0 0 420 420" fill="none">
          <path d="M210,30 C310,20 415,100 415,210 C415,320 325,410 210,410 C95,410 8,330 15,210 C22,95 110,40 210,30Z" fill="rgba(141,110,99,1)" />
        </svg>

        {/* spinning ring */}
        <div className="spin-ring absolute hidden lg:block pointer-events-none" style={{ top: '12%', right: '9%', width: 110, height: 110, borderRadius: '50%', border: '1.5px dashed rgba(156,204,101,.22)' }} />
        <div className="spin-ring absolute hidden lg:block pointer-events-none" style={{ animationDuration: '35s', top: '14%', right: '11%', width: 75, height: 75, borderRadius: '50%', border: '1px dashed rgba(156,204,101,.12)' }} />
        {/* Content */}
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-16 py-32 lg:py-0 min-h-screen flex items-center">
          <div className="w-full grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="au0 mt-4 inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(156,204,101,.1)', border: '1px solid rgba(156,204,101,.28)', color: '#9CCC65', letterSpacing: '0.07em' }}>
                <Sparkles className="w-3 h-3" /> Our Story — Indore, MP
              </div>

              <h1 className="au1 text-white font-black leading-tight" style={{ fontSize: 'clamp(2.8rem,6.5vw,6rem)' }}>
                Welcome to<br />
                <span style={{ color: '#9CCC65' }}>FOOD DOER!!</span>
              </h1>

              <p className="au2 mt-5 leading-relaxed font-light" style={{ color: 'rgba(255,255,255,.6)', fontSize: '1.05rem', maxWidth: 480 }}>
                We bridge the gap between surplus and scarcity — connecting generous donors,
                dedicated volunteers, and communities in need. Every meal matters. Every action counts.
              </p>

              <div className="au3 flex flex-wrap gap-3 mt-9">
                <Link to="/donate" className="inline-flex items-center gap-2 font-bold text-sm rounded-2xl transition-all duration-300 hover:scale-105" style={{ background: '#9CCC65', color: '#1a2e0a', padding: '13px 26px', boxShadow: '0 4px 20px rgba(156,204,101,.4)' }}>
                  Donate Food <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/volunteer" className="inline-flex items-center gap-2 font-semibold text-sm rounded-2xl transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', color: 'white', padding: '13px 26px', backdropFilter: 'blur(8px)' }}>
                  <Heart className="w-4 h-4" /> Become a Volunteer
                </Link>
              </div>

              <div className="au4 flex flex-wrap items-center gap-4 mt-8">
                {[{ label: 'Live Tracking', icon: <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5" style={{ animation: 'livepulse 1.6s ease-in-out infinite', boxShadow: '0 0 0 0 rgba(156,204,101,.5)' }} /> }, { label: '12+ Communities', icon: <MapPin className="w-3 h-3 mr-1" /> }, { label: '24/7 Operations', icon: <Clock className="w-3 h-3 mr-1" /> }].map((item, i) => (
                  <span key={i} className="inline-flex items-center text-xs font-medium" style={{ color: 'rgba(255,255,255,.4)' }}>
                    {item.icon}{item.label}
                    {i < 2 && <span className="ml-4 inline-block w-px h-3" style={{ background: 'rgba(255,255,255,.12)' }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="hidden lg:flex flex-col gap-3 au3">
              {/* Big impact card */}
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.09)', backdropFilter: 'blur(16px)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" style={{ animation: 'livepulse 1.6s ease-in-out infinite' }} />
                      <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,.45)' }}>Live Impact</span>
                    </div>
                    <div className="font-black leading-none" style={{ fontSize: '3.2rem', color: '#9CCC65' }}>10,000+</div>
                    <div className="text-sm font-light mt-1" style={{ color: 'rgba(255,255,255,.4)' }}>Lives changed this year</div>
                  </div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#9CCC65,#6da832)' }}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* sparkline */}
                <svg viewBox="0 0 220 48" className="w-full" style={{ opacity: .65 }}>
                  <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9CCC65" stopOpacity=".3"/><stop offset="100%" stopColor="#9CCC65" stopOpacity="0"/></linearGradient></defs>
                  <path d="M0,44 C30,38 50,28 80,32 C110,36 130,14 160,18 C180,21 200,8 220,4 L220,48 L0,48Z" fill="url(#sg)" />
                  <path d="M0,44 C30,38 50,28 80,32 C110,36 130,14 160,18 C180,21 200,8 220,4" fill="none" stroke="#9CCC65" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              {/* Mini stat grid */}
              <div className="grid grid-cols-2 gap-3">
                {[{ v: '5K+', l: 'Meals Donated', icon: Heart }, { v: '200+', l: 'Volunteers', icon: Users }, { v: '50+', l: 'NGO Partners', icon: Globe }, { v: '24/7', l: 'Support', icon: Clock }].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <Icon className="w-4 h-4 mx-auto mb-2" style={{ color: 'rgba(255,255,255,.3)' }} />
                      <div className="font-extrabold leading-none text-white" style={{ fontSize: '1.4rem' }}>{item.v}</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.35)', fontWeight: 500 }}>{item.l}</div>
                    </div>
                  );
                })}
              </div>

              {/* Quote card */}
              <div className="rounded-2xl p-5" style={{ background: 'rgba(156,204,101,.07)', border: '1px solid rgba(156,204,101,.18)' }}>
                <Quote className="w-5 h-5 mb-3" style={{ color: '#9CCC65', opacity: .6 }} />
                <p className="text-sm leading-relaxed font-light italic" style={{ color: 'rgba(255,255,255,.75)' }}>
                  "No one should go to sleep hungry when food exists to spare. That's our north star."
                </p>
                <p className="text-xs font-bold mt-3 tracking-wider uppercase" style={{ color: '#9CCC65' }}>— Food Doer Mission</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div className="float1 mt-20 absolute bottom-0  left-6 lg:left-0  flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl" style={{ background: 'white', border: '1px solid #f0ede8' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#9CCC65,#6da832)' }}>
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: '#aaa' }}>Recognition</div>
            <div className="text-sm font-bold" style={{ color: '#1a1a1a' }}>Best Food NGO 2024</div>
          </div>
        </div>
      </section>

      {/* ════════════════ MARQUEE ════════════════ */}
      <div className="overflow-hidden py-3.5" style={{ background: '#9CCC65' }}>
        <div className="marquee-track flex w-max gap-0">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-8 text-xs font-bold whitespace-nowrap" style={{ color: '#1a2e0a', letterSpacing: '0.02em', borderRight: '1px solid rgba(26,46,10,.18)' }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════ STATS BENTO ════════════════ */}
      <section className="py-20" style={{ background: '#F8F6F2' }} ref={s1.ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className={`text-center mb-14 rv ${s1.visible ? 'in' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(156,204,101,.1)', border: '1px solid rgba(156,204,101,.3)', color: '#5a8a28' }}>
              <Sparkles className="w-3 h-3" /> By the Numbers
            </div>
            <h2 className="font-extrabold leading-tight" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: '#1a1a1a' }}>
              Our Collective <span style={{ color: '#8D6E63' }}>Impact</span>
            </h2>
            <p className="mt-3 font-light" style={{ color: '#999', maxWidth: 420, margin: '0.75rem auto 0', fontSize: '0.975rem' }}>
              Every number tells a story. Every story is a life changed.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`bento-c relative bg-white rounded-2xl p-7 border transition-all duration-300 cursor-default overflow-hidden rv d${i + 1} ${s1.visible ? 'in' : ''}`}
                  style={{ border: '1px solid #f0ede8', transition: 'transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 60px rgba(0,0,0,.09)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                  <div className={`bc-icon w-12 h-12 rounded-2xl bg-gradient-to-br ${s.grad} flex items-center justify-center mb-5 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-black leading-none" style={{ fontSize: '2.6rem', color: s.textCol }}>
                    <Counter target={s.n} suffix={s.suf} />
                  </div>
                  <div className="text-sm font-medium mt-1.5" style={{ color: '#999' }}>{s.label}</div>
                  <div className={`bento-bar absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.grad}`} />
                  <div className="absolute -bottom-1 -right-1 font-black select-none pointer-events-none" style={{ fontSize: '5.5rem', color: 'rgba(0,0,0,.025)', lineHeight: 1 }}>
                    {s.n > 999 ? Math.round(s.n / 1000) + 'K' : s.n}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ MISSION / VALUES ════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden" ref={s2.ref}>
        <div className="absolute top-4 inset-x-0 text-center select-none pointer-events-none font-black" style={{ fontSize: 'clamp(5rem,14vw,12rem)', color: 'rgba(141,110,99,.03)', lineHeight: 1 }}>
          MISSION
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-16 relative">
          <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 rv ${s2.visible ? 'in' : ''}`}>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(156,204,101,.1)', border: '1px solid rgba(156,204,101,.3)', color: '#5a8a28' }}>
                What We Stand For
              </div>
              <h2 className="font-extrabold leading-tight" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: '#1a1a1a' }}>
                Mission & <span style={{ color: '#8D6E63' }}>Vision</span>
              </h2>
            </div>
            <p className="lg:max-w-md font-light leading-relaxed" style={{ color: '#888', fontSize: '1rem' }}>
              Creating a world where no food goes to waste and no one goes hungry. Every action
              is guided by abundance and dignity going hand in hand.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className={`val-wrap relative rounded-3xl p-8 border overflow-hidden rv d${i + 1} ${s2.visible ? 'in' : ''}`}
                  style={{ background: `${v.accent}08`, border: `1px solid ${v.accent}20`, transition: 'transform .3s ease, box-shadow .3s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-7px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 32px 80px ${v.accent}18`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                  <div className="absolute top-4 right-5 font-black select-none pointer-events-none" style={{ fontSize: '5.5rem', lineHeight: 1, color: `${v.accent}10` }}>{v.num}</div>
                  <div className="val-icon w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${v.accent}18`, border: `1.5px solid ${v.accent}30` }}>
                    <Icon className="w-6 h-6" style={{ color: v.accent }} />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-3">{v.title}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#777', fontWeight: 400 }}>{v.desc}</p>
                  <div className="flex flex-col gap-2.5">
                    {v.points.map((p, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#555' }}>
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: v.accent }} />{p}
                      </div>
                    ))}
                  </div>
                  <div className="val-bar absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg,${v.accent},transparent)` }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ TIMELINE ════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#1C0F0A' }} ref={s3.ref}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(141,110,99,.18) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-16 relative">
          <div className={`text-center mb-14 rv ${s3.visible ? 'in' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(156,204,101,.1)', border: '1px solid rgba(156,204,101,.25)', color: '#9CCC65' }}>
              Our Journey
            </div>
            <h2 className="font-extrabold text-white leading-tight" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)' }}>
              How It All <span style={{ color: '#9CCC65' }}>Began</span>
            </h2>
          </div>

          <div className="relative grid md:grid-cols-4 gap-0">
            {/* horizontal connector line */}
            <div className="absolute hidden md:block" style={{ top: '2rem', left: '12.5%', right: '12.5%', height: 2, background: 'linear-gradient(90deg,rgba(156,204,101,.1),rgba(156,204,101,.45),rgba(141,110,99,.45),rgba(156,204,101,.1))' }} />

            {timeline.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`flex flex-col items-center text-center px-5 pb-8 rv d${i + 1} ${s3.visible ? 'in' : ''}`}
                  onMouseEnter={e => { const dot = e.currentTarget.querySelector('.tl-dot') as HTMLElement; if (dot) dot.style.transform = 'scale(1.18)'; }}
                  onMouseLeave={e => { const dot = e.currentTarget.querySelector('.tl-dot') as HTMLElement; if (dot) dot.style.transform = ''; }}>
                  <div className="tl-dot w-16 h-16 rounded-full flex items-center justify-center relative z-10 mb-5" style={{ background: 'linear-gradient(135deg,#9CCC65,#6da832)', boxShadow: '0 0 0 5px rgba(156,204,101,.12),0 8px 24px rgba(156,204,101,.25)', transition: 'transform .3s cubic-bezier(.34,1.56,.64,1)' }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#9CCC65', letterSpacing: '0.1em' }}>{item.year}</div>
                  <div className="font-bold text-white text-base mb-2">{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,.45)', fontWeight: 400 }}>{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ TEAM ════════════════ */}
      <section className="py-24" style={{ background: '#FDF9F3' }} ref={s4.ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`rv-l ${s4.visible ? 'in' : ''}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" style={{ background: 'rgba(156,204,101,.1)', border: '1px solid rgba(156,204,101,.3)', color: '#5a8a28' }}>
                The Team
              </div>
              <h2 className="font-extrabold leading-tight mb-5" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: '#1a1a1a' }}>
                Faces Behind<br />
                <span style={{ color: '#9CCC65' }}>the Mission</span>
              </h2>
              <p className="leading-relaxed font-light mb-8" style={{ color: '#888', fontSize: '1rem' }}>
                A passionate collective united by one truth: no plate should go unfilled while surplus food exists.
                Meet the heart of Food Doer.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex">
                  {['#e67e22','#2ecc71','#e74c3c','#3498db','#9b59b6'].map((c, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c, marginLeft: i > 0 ? -10 : 0, position: 'relative', zIndex: 5 - i, boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">200+ active volunteers</div>
                  <div className="text-xs font-normal" style={{ color: '#bbb' }}>& growing every month</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Indore Based', 'NGO Certified', '24/7 Operations', 'Volunteer-Led'].map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold" style={{ background: '#f0ede8', border: '1px solid #e8e2da', color: '#666' }}>
                    <CheckCircle className="w-3 h-3" style={{ color: '#9CCC65' }} />{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className={`rv-r ${s4.visible ? 'in' : ''} flex justify-center`}>
              <div className="relative">
                <div className="team-card-w rounded-3xl overflow-hidden shadow-2xl border" style={{ maxWidth: 370, border: '1px solid #f0ede8', background: 'white', transition: 'transform .3s ease, box-shadow .3s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 32px 80px rgba(0,0,0,.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                  <div className="overflow-hidden" style={{ aspectRatio: '4/3', background: '#f0ede8' }}>
                    <img src="/project1.jpeg" alt="Tanisha Borana" className="team-img w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=400&q=80'; }} />
                  </div>
                  <div className="p-7">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'linear-gradient(135deg,#9CCC65,#7ab330)', color: '#1a2e0a' }}>
                      <Star className="w-3 h-3" /> Community Hero 2024
                    </div>
                    <div className="text-xl font-bold text-gray-900">Tanisha Borana</div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: '#8D6E63' }}>Project Lead & Founder</div>
                    <p className="text-sm italic mt-3 leading-relaxed" style={{ color: '#888' }}>
                      "Dedicated to community welfare and making sure every surplus meal finds the mouth that needs it most."
                    </p>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="float1 absolute -top-4 -right-4 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl" style={{ background: 'white', border: '1px solid #f0ede8' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#9CCC65,#6da832)' }}>
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: '#aaa' }}>This Month</div>
                    <div className="text-sm font-bold text-gray-900">420 Meals</div>
                  </div>
                </div>

                <div className="float2 absolute -bottom-4 -left-4 rounded-xl px-4 py-3 shadow-xl" style={{ background: 'white', border: '1px solid #f0ede8' }}>
                  <div className="text-xs font-medium mb-1.5" style={{ color: '#aaa' }}>Impact Score</div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5" style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
                    <span className="text-xs font-bold text-gray-900 ml-1">5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ QUOTE ════════════════ */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1C0F0A 0%, #3D2318 55%, #6E4E3A 100%)' }} ref={s5.ref}>
        <div className="absolute top-0 left-0 select-none pointer-events-none font-black leading-none text-white" style={{ fontSize: 'clamp(10rem,22vw,20rem)', opacity: '.025', lineHeight: .85 }}>"</div>
        <div className="absolute pointer-events-none" style={{ top: '-5rem', left: '15%', width: '22rem', height: '22rem', borderRadius: '50%', background: 'radial-gradient(circle,rgba(156,204,101,.12),transparent)', filter: 'blur(60px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-4rem', right: '18%', width: '26rem', height: '26rem', borderRadius: '50%', background: 'radial-gradient(circle,rgba(141,110,99,.15),transparent)', filter: 'blur(70px)' }} />

        <div className={`max-w-4xl mx-auto px-6 text-center relative rv ${s5.visible ? 'in' : ''}`}>
          <Quote className="w-10 h-10 mx-auto mb-8" style={{ color: '#9CCC65', opacity: .5 }} />
          <p className="font-bold italic text-white leading-snug" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.9rem)' }}>
            Alone we can do so little;<br />together we can do so much.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16" style={{ background: 'rgba(156,204,101,.4)' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,.45)', letterSpacing: '0.12em' }}>Helen Keller</span>
            <div className="h-px w-16" style={{ background: 'rgba(156,204,101,.4)' }} />
          </div>
        </div>
      </section>

      {/* ════════════════ GALLERY ════════════════ */}
      <section className="py-24" style={{ background: '#F8F6F2' }} ref={s6.ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-12 rv ${s6.visible ? 'in' : ''}`}>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(156,204,101,.1)', border: '1px solid rgba(156,204,101,.3)', color: '#5a8a28' }}>
                Visual Stories
              </div>
              <h2 className="font-extrabold leading-tight" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: '#1a1a1a' }}>
                Our Impact <span style={{ color: '#8D6E63' }}>in Action</span>
              </h2>
            </div>
            <p className="lg:max-w-sm font-light leading-relaxed" style={{ color: '#888', fontSize: '0.95rem' }}>
              Witness the change we're creating together — one meal, one smile, one community at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            <div className={`md:col-span-3 gal-card relative rounded-3xl overflow-hidden shadow-xl rv d1 ${s6.visible ? 'in' : ''}`} style={{ height: 420 }}>
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3" alt="Children" className="gal-img w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.72) 0%,rgba(0,0,0,.05) 55%,transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: 'rgba(156,204,101,.18)', border: '1px solid rgba(156,204,101,.38)', color: '#9CCC65' }}>
                  <MapPin className="w-3 h-3" /> Outreach Program
                </div>
                <p className="text-white text-xl font-bold">Reaching children in need</p>
                <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,.55)' }}>Across 12+ communities in Indore, MP</p>
              </div>
            </div>

            <div className={`md:col-span-2 flex flex-col gap-4 rv d2 ${s6.visible ? 'in' : ''}`}>
              <div className="gal-card relative rounded-3xl overflow-hidden shadow-xl" style={{ height: 200 }}>
                <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3" alt="Food drives" className="gal-img w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.68),transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold mb-2" style={{ background: 'rgba(156,204,101,.18)', border: '1px solid rgba(156,204,101,.35)', color: '#9CCC65' }}>
                    Food Drives
                  </div>
                  <p className="text-white font-semibold text-sm">Organized food drives</p>
                </div>
              </div>

              <div className={`rounded-3xl p-6 flex flex-col justify-between rv d3 ${s6.visible ? 'in' : ''}`} style={{ background: 'linear-gradient(135deg,#8D6E63,#5C3D2E)', height: 200 }}>
                <Leaf className="w-7 h-7" style={{ color: '#9CCC65' }} />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,.45)', letterSpacing: '0.08em' }}>This Month</div>
                  <div className="font-black leading-none" style={{ fontSize: '3rem', color: '#9CCC65' }}>5,000+</div>
                  <div className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,.5)' }}>Meals rescued from waste</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg,#0d1f05 0%,#1e4010 50%,#2d5c18 100%)' }} ref={s7.ref}>
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
          <span className="font-black text-white" style={{ fontSize: 'clamp(5rem,15vw,14rem)', opacity: '.025', whiteSpace: 'nowrap' }}>JOIN US</span>
        </div>
        <div className="absolute pointer-events-none" style={{ top: '-6rem', right: '-4rem', width: '30rem', height: '30rem', borderRadius: '50%', background: 'radial-gradient(circle,rgba(156,204,101,.1),transparent)', filter: 'blur(80px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-4rem', left: '-4rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'radial-gradient(circle,rgba(141,110,99,.12),transparent)', filter: 'blur(70px)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-16 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`rv-l ${s7.visible ? 'in' : ''}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" style={{ background: 'rgba(156,204,101,.1)', border: '1px solid rgba(156,204,101,.25)', color: '#9CCC65' }}>
                <Leaf className="w-3 h-3" /> Take Action Today
              </div>
              <h2 className="font-extrabold text-white leading-tight mb-5" style={{ fontSize: 'clamp(2.4rem,5.5vw,4.5rem)' }}>
                Join Us in<br />
                <span style={{ color: '#9CCC65' }}>Making a</span><br />
                Difference
              </h2>
              <p className="font-light leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,.55)', fontSize: '1rem', maxWidth: 440 }}>
                Your contribution — whether time, food, or resources — creates ripples that
                reach farther than you can imagine.
              </p>

              <div className="flex flex-wrap gap-2.5 mb-8">
                {['Zero Hunger Mission', 'Eco-friendly Ops', '200+ Volunteers', '12+ Cities'].map((f, i) => (
                  <div key={i} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.8)', backdropFilter: 'blur(8px)' }}>
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9CCC65' }} />{f}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/volunteer" className="inline-flex items-center gap-2 font-bold text-sm rounded-2xl transition-all duration-300 hover:scale-105" style={{ background: '#9CCC65', color: '#1a2e0a', padding: '14px 28px', boxShadow: '0 4px 20px rgba(156,204,101,.4)' }}>
                  Become a Volunteer <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/donate" className="inline-flex items-center gap-2 font-semibold text-sm rounded-2xl transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', color: 'white', padding: '14px 28px', backdropFilter: 'blur(8px)' }}>
                  <Heart className="w-4 h-4" /> Donate Now
                </Link>
              </div>
            </div>

            {/* Impact live card */}
            <div className={`rv-r ${s7.visible ? 'in' : ''}`}>
              <div className="rounded-2xl p-7" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', backdropFilter: 'blur(16px)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#9CCC65,#6da832)' }}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Real-Time Impact</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" style={{ animation: 'livepulse 1.6s ease-in-out infinite' }} />
                      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,.4)' }}>Live</span>
                    </div>
                  </div>
                </div>

                {[
                  { label: 'Meals Donated Today', val: '142' },
                  { label: 'Active Volunteers Now', val: '38' },
                  { label: 'Families Served This Week', val: '290' },
                  { label: 'KG Food Rescued', val: '680 kg' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-4" style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,.07)' : 'none' }}>
                    <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,.5)' }}>{row.label}</span>
                    <span className="text-base font-bold text-white">{row.val}</span>
                  </div>
                ))}

                <div className="mt-5 rounded-xl p-3 text-center" style={{ background: 'rgba(156,204,101,.08)', border: '1px solid rgba(156,204,101,.18)' }}>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,.4)' }}>Updated every 5 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}