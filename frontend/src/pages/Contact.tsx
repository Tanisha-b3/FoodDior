import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle,
  User, MessageSquare, Smartphone, ArrowRight, Heart,
  Sparkles, Shield, Award, Users, Globe, Camera,
  ChevronRight, Quote, Zap
} from 'lucide-react';
import type { ContactMessage } from '../types';
import { Link } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa6';
import { BsInstagram, BsTwitterX } from 'react-icons/bs';
import { LiaLinkedin } from 'react-icons/lia';
import { API_ENDPOINTS } from '../lib/api';

/* ─── design tokens ──────────────────────────────────── */
const T = {
  clay:    '#8D6E63',
  clayDk:  '#6E554D',
  clayLt:  '#C8A89E',
  sage:    '#9CCC65',
  sageDk:  '#7CB342',
  cream:   '#FAF7F2',
  paper:   '#F3EDE4',
  ink:     '#2D1F1A',
  muted:   '#8C7B75',
  accent:  '#E8763A',
  success: '#16a34a',
  error:   '#C53030',
};

/* ─── tiny helpers ───────────────────────────────────── */
const Badge = ({ icon: Icon, children, color = T.sage }: any) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
    style={{ background: color + '1a', color, border: `1px solid ${color}30` }}>
    <Icon className="w-3.5 h-3.5" />{children}
  </span>
);

const SectionHeading = ({ eyebrow, icon: Icon, title, accent, sub }: any) => (
  <div className="text-center mb-16">
    <Badge icon={Icon} color={T.clay}>{eyebrow}</Badge>
    <h2 className="mt-6 text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight" 
      style={{ color: T.ink, fontFamily: "'Playfair Display', Georgia, serif" }}>
      {title} <span style={{ color: T.accent }}>{accent}</span>
    </h2>
    {sub && <p className="mt-4 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: T.muted }}>{sub}</p>}
    <p className="mt-3 text-xs font-bold uppercase tracking-widest" style={{ color: T.clay }}>Impact-led conversations</p>
  </div>
);

export default function Contact() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitStatus, setSubmitStatus]   = useState<'idle' | 'success'>('idle');
  const [focusedField, setFocusedField]   = useState<string | null>(null);
  const [activeFaq, setActiveFaq]         = useState<number | null>(null);
  const [visible, setVisible]             = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const k = e.target.getAttribute('data-reveal') || '';
          setVisible(prev => new Set([...prev, k]));
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.contactMessages);
        setMessages(response.data.map((item: any) => ({ ...item, id: item._id })));
      } catch (error) {
        console.error('Failed to load contact messages:', error);
      }
    };

    loadMessages();
  }, []);

  const reveal = (key: string, delay = 0): React.CSSProperties => ({
    opacity:   visible.has(key) ? 1 : 0,
    transform: visible.has(key) ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(API_ENDPOINTS.contactMessages, formData);
      const msg: ContactMessage = {
        ...response.data,
        id: response.data._id,
      };
      setMessages((current) => [msg, ...current]);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 3500);
    } catch (error) {
      console.error('Failed to send contact message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── data ─────────────────────────────────────────── */
  const contactCards = [
    {
      icon: MapPin, label: 'Visit Us',
      lines: ['Bhopal, MadhyaPradesh — 462021'],
      cta: 'Get Directions', href: 'https://maps.google.com',
      accent: '#E8763A',
    },
    {
      icon: Phone, label: 'Call Us',
      lines: ['+91 7913630631', 'Mon–Fri  9 AM – 6 PM', 'Emergency: 24/7'],
      cta: 'Call Now', href: 'tel:+917913630631',
      accent: '#3A9E6A',
    },
    {
      icon: Mail, label: 'Email Us',
      lines: ['fooddior@gmail.com', 'Reply within 24 hours'],
      cta: 'Send Email', href: 'mailto:fooddior@gmail.com',
      accent: '#3A73C9',
    },
    {
      icon: Clock, label: 'Office Hours',
      lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 2:00 PM', 'Sunday: Closed'],
      cta: 'Schedule Meeting', href: '#',
      accent: '#9B5CCC',
    },
  ];

  const stats = [
    { icon: Award,  value: '5+',   label: 'Years of Service',   color: '#E8A020' },
    { icon: Users,  value: '500+', label: 'Active Volunteers',   color: '#3A9E6A' },
    { icon: Heart,  value: '50K+', label: 'Lives Impacted',      color: '#D94F4F' },
    { icon: Globe,  value: '100+', label: 'Partner Locations',   color: '#3A73C9' },
  ];

  const faqs = [
    { q: 'How can I donate food?', a: 'Fill out our donation form on the Donate page. We\'ll contact you within 24 hours to arrange pickup. All food donations are tax-deductible and we accept both fresh and packaged items.' },
    { q: 'What types of food do you accept?', a: 'Non-perishable items, fresh produce, cooked meals (within 2 hours of preparation), packaged foods with valid expiry dates, sealed beverages, and baby food.' },
    { q: 'How can I become a volunteer?', a: 'Visit our Volunteer page and submit the application form. We schedule an orientation and you can start helping within a week. Volunteers receive full training and certification.' },
    { q: 'Do you operate in my area?', a: 'We currently operate in Bhopal and surrounding areas — Indore, Jabalpur, and Gwalior. Contact us for specific location queries.' },
  ];

  const gallery = [
    { src: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3', title: 'Food Distribution',   tag: 'Events' },
    { src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3', title: 'Volunteer Activity',   tag: 'Volunteers' },
    { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3', title: 'Community Kitchen',    tag: 'Services' },
    { src: "./image.jpg", title: 'Awareness Campaign',  tag: 'Outreach' },
  ];

  const socials = [
    { icon: FaFacebook, href: 'https://facebook.com',  bg: '#1877F2', label: 'Facebook' },
    { icon: BsTwitterX, href: 'https://twitter.com',   bg: '#14171A', label: 'Twitter'  },
    { icon: BsInstagram,href: 'https://instagram.com', bg: '#E1306C', label: 'Instagram'},
    { icon: LiaLinkedin,href: 'https://linkedin.com',  bg: '#0077B5', label: 'LinkedIn' },
  ];

  /* ─── input field component ─────────────────────────── */
  const Field = ({ id, label, icon: Icon, type = 'text', required = false, rows = 0, ...props }: any) => {
    const isFocused = focusedField === id;
    const shared = "w-full px-5 py-3.5 rounded-xl text-sm transition-all duration-300 outline-none border-1.5 bg-white placeholder:text-gray-300 font-medium";
    const borderStyle = isFocused
      ? { borderColor: T.clay, boxShadow: `0 0 0 3px ${T.clay}15, inset 0 1px 3px rgba(0,0,0,0.05)` }
      : { borderColor: '#EDE8E3', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' };

    return (
      <div>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: isFocused ? T.clay : T.muted }}>
          <Icon className="w-4 h-4" />
          {label}{required && ' *'}
        </label>
        {rows > 0
          ? <textarea {...props} id={id} rows={rows} required={required}
              value={formData[id as keyof typeof formData]}
              onFocus={() => setFocusedField(id)}
              onBlur={() => setFocusedField(null)}
              onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              className={`${shared} resize-none focus:scale-[1.01]`} style={borderStyle} />
          : <input {...props} id={id} type={type} required={required}
              value={formData[id as keyof typeof formData]}
              onFocus={() => setFocusedField(id)}
              onBlur={() => setFocusedField(null)}
              onChange={e => setFormData({ ...formData, [id]: e.target.value })}
              className={`${shared} focus:scale-[1.01]`} style={borderStyle} />
        }
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: T.cream, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

      {/* ═══ HERO ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 600 }}>
        {/* Gradient Background */}
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(135deg, ${T.clayDk}00 0%, ${T.clayDk}20 50%, ${T.clay}40 100%), 
                       linear-gradient(to right, ${T.clay}, ${T.clayLt})` 
        }} />
        
        {/* Animated background image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1421789497144-f50500b5f8c2?ixlib=rb-4.0.3')] bg-cover bg-center opacity-[0.07] animate-pulse" />

        {/* Geometric accent shapes */}
        <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.08]" style={{ background: '#fff', transform: 'translate(35%, -35%)' }} />
        <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full blur-2xl opacity-[0.08]" style={{ background: T.sage, transform: 'translate(-40%, 40%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF7F200]" />

        <div className="relative container mx-auto px-6 py-24 lg:py-32 xl:py-40 text-center flex flex-col items-center">
          {/* Animated pill badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full mb-10 text-sm font-bold tracking-wider overflow-hidden backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.sage }} />
            Get in Touch Today
            <Zap className="w-3.5 h-3.5" style={{ color: T.sage }} />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-[1.08] tracking-tight max-w-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Let's Start a{' '}
            <span className="relative inline-block" style={{ color: T.sage }}>
              Conversation
              <svg className="absolute -bottom-3 left-0 w-full h-3" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                <path d="M4 8 Q75 2 150 8 T296 8" stroke={T.sage} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              </svg>
            </span>
          </h1>

          <p className="text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Have questions about donating, volunteering, or partnering with us?<br />
            <span style={{ color: T.sage, fontWeight: 500 }}>We'd love to hear from you and help.</span>
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              [Shield,  '100% Secure & Trusted'],
              [Clock,   '24/7 Support'],
              [Heart,   'Trusted by 500+ Orgs'],
            ].map(([Icon, text]: any, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/15"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                <Icon className="w-4 h-4" style={{ color: T.sage }} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Smooth wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      {/* ═══ STATS BAR ═════════════════════════════════════ */}
      <section className="relative py-20 lg:py-24" style={{ background: '#fff' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f9f9f9]" />
        <div className="relative container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} data-reveal={`stat-${i}`} style={reveal(`stat-${i}`, i * 0.12)}
                  className="flex flex-col items-center text-center group cursor-default transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-3 group-hover:shadow-2xl"
                    style={{ background: s.color + '12', border: `2px solid ${s.color}20`, boxShadow: `inset 0 1px 3px ${s.color}10` }}>
                    <Icon className="w-7 h-7" style={{ color: s.color }} />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold tracking-tight mb-2" style={{ color: T.ink, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color: T.muted }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT CARDS ═════════════════════════════════ */}
      <section className="py-20 lg:py-24" style={{ background: T.cream }}>
        <div className="container mx-auto px-6">
          <SectionHeading icon={MapPin} eyebrow="Get in Touch" title="Ways to" accent="Connect" 
            sub="Choose the best way to reach us. We're always here to help." />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={i}
                  href={c.href}
                  data-reveal={`card-${i}`}
                  style={{
                    ...reveal(`card-${i}`, i * 0.1),
                    background: '#fff',
                    border: '1px solid #EDE8E3',
                    textDecoration: 'none',
                  }}
                  className="group relative rounded-2xl p-6 lg:p-7 transition-all duration-500 hover:-translate-y-3 hover:shadow-xl overflow-hidden"
                >
                  
                  {/* Hover gradient backdrop */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${c.accent}08 0%, ${c.accent}03 100%)` }} />
                  
                  {/* Icon container */}
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-2"
                    style={{ background: c.accent + '12', border: `2px solid ${c.accent}25`, boxShadow: `inset 0 1px 2px ${c.accent}10` }}>
                    <Icon className="w-5 h-5" style={{ color: c.accent }} />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg mb-4 relative z-10" style={{ color: T.ink }}>{c.label}</h3>
                  {c.lines.map((l, li) => (
                    <p key={li} className="text-sm mb-1 relative z-10" style={{ color: li === 0 ? '#444' : T.muted, fontWeight: li === 0 ? 600 : 400 }}>{l}</p>
                  ))}

                  {/* CTA */}
                  <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-widest transition-all duration-300 group-hover:gap-3 relative z-10"
                    style={{ color: c.accent }}>
                    {c.cta}
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>

                  {/* Bottom accent border */}
                  <div className="absolute bottom-0 left-6 right-6 h-1 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: c.accent }} />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FORM + MAP ════════════════════════════════════ */}
      <section className="py-20 lg:py-28" style={{ background: T.paper }}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">

            {/* ── Form ── */}
            <div
              data-reveal="form"
              style={{
                ...reveal('form'),
                background: '#fff',
                border: '1.5px solid #EDE8E3',
                boxShadow: '0 20px 60px rgba(45,31,26,0.12)',
              }}
              className="rounded-2xl lg:rounded-3xl overflow-hidden backdrop-blur-sm"
            >

              {/* Form header */}
              <div className="relative px-8 lg:px-10 py-10 overflow-hidden" style={{ background: `linear-gradient(135deg, ${T.clayDk}, ${T.clay})` }}>
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 blur-2xl" style={{ background: '#fff' }} />
                <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full opacity-5 blur-2xl" style={{ background: T.sage }} />
                <div className="relative z-10">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Send us a Message</h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>We'll reply within 24 hours</p>
                  <p className="text-xs mt-2 font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {messages.length} messages received
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field id="name"  label="Full Name"  icon={User}         required placeholder="Your name" />
                  <Field id="email" label="Email"       icon={Mail}  type="email" required placeholder="your@email.com" />
                </div>
                <Field id="phone"   label="Phone Number" icon={Smartphone} type="tel" placeholder="+91 98765 43210" />
                <Field id="message" label="Your Message" icon={MessageSquare} required rows={5} placeholder="Tell us how we can help you..." />

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${T.clay}, ${T.clayDk})` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${T.sage}20, transparent)` }} />
                  {isSubmitting
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</>
                    : <><Send className="w-4 h-4" />Send Message</>
                  }
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-4 p-5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ background: '#f0fdf4', border: `1.5px solid #bbf7d0` }}>
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: T.success }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#166534' }}>Message sent successfully!</p>
                      <p className="text-xs" style={{ color: '#4ade80' }}>We'll get back to you soon.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* ── Right column ── */}
            <div className="space-y-6">

              {/* Map */}
              <div
                data-reveal="map"
                style={{
                  ...reveal('map', 0.15),
                  background: '#fff',
                  border: '1.5px solid #EDE8E3',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                }}
                className="rounded-2xl lg:rounded-3xl overflow-hidden"
              >
                <div className="px-6 py-5 border-b flex items-center gap-2" style={{ borderColor: '#EDE8E3' }}>
                  <MapPin className="w-4 h-4" style={{ color: T.accent }} />
                  <div>
                    <h3 className="font-bold text-base" style={{ color: T.ink }}>Find Us</h3>
                    <p className="text-xs" style={{ color: T.muted }}>Bhopal, India</p>
                  </div>
                </div>
                <div className="relative" style={{ height: 240 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.654467887666!2d77.43544731497298!3d23.25809528483463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c689c3f2f0d5d%3A0x6b1c6c5f8b2c3a0!2sLakshmi%20Narain%20College%20of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%" height="100%" style={{ border: 0, display: 'block' }}
                    allowFullScreen loading="lazy" title="Office Location" />
                </div>
              </div>

              {/* Emergency */}
              <div
                data-reveal="emergency"
                style={{
                  ...reveal('emergency', 0.22),
                  background: '#FFF5F5',
                  border: '1.5px solid #FED7D7',
                }}
                className="rounded-2xl lg:rounded-3xl p-6 lg:p-7 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-2"
                    style={{ background: '#FED7D7' }}>
                    <AlertCircle className="w-5 h-5" style={{ color: T.error }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: T.ink }}>Emergency Contact</h3>
                    <p className="text-xs mb-3" style={{ color: T.muted }}>For urgent matters:</p>
                    <a href="tel:+919131630631" className="text-xl font-bold tracking-tight hover:underline transition-colors duration-200" style={{ color: T.error, fontFamily: "'Playfair Display', serif" }}>
                      +91 91316 30631
                    </a>
                    <p className="text-xs mt-2" style={{ color: T.muted }}>24/7 Available</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div
                data-reveal="social"
                style={{
                  ...reveal('social', 0.28),
                  background: '#fff',
                  border: '1.5px solid #EDE8E3',
                }}
                className="rounded-2xl lg:rounded-3xl p-6 lg:p-7 group hover:shadow-lg transition-all duration-300"
              >
                <h3 className="font-bold text-sm mb-5" style={{ color: T.ink }}>Follow Our Journey</h3>
                <div className="flex gap-3 mb-4">
                  {socials.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                        className="w-11 h-11 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-125 hover:shadow-lg hover:-rotate-3"
                        style={{ background: s.bg }}>
                        <Icon className="w-4.5 h-4.5" />
                      </a>
                    );
                  })}
                </div>
                <p className="text-xs mt-4 pt-4" style={{ color: T.muted, borderTop: '1px solid #EDE8E3' }}>
                  Join us for impact stories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══════════════════════════════════════ */}
      <section className="py-20 lg:py-28" style={{ background: '#fff' }}>
        <div className="container mx-auto px-6">
          <SectionHeading icon={Camera} eyebrow="Gallery" title="Our Community in" accent="Action"
            sub="From food distribution to community outreach — every moment counts." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {gallery.map((img, i) => (
              <div
                key={i}
                data-reveal={`gal-${i}`}
                style={{
                  ...reveal(`gal-${i}`, i * 0.1),
                  aspectRatio: '3/4',
                }}
                className="group relative rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-1" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(45,31,26,0.9)] via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg self-start mb-3"
                    style={{ background: T.sage, color: '#1a3a0a' }}>{img.tag}</span>
                  <h3 className="font-bold text-white text-lg leading-tight">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══════════════════════════════════════════ */}
      <section className="py-20 lg:py-28" style={{ background: T.paper }}>
        <div className="container mx-auto px-6">
          <SectionHeading icon={Quote} eyebrow="Questions?" title="Frequently Asked" accent="Questions"
            sub="Find answers to common questions about our services." />
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => {
              const open = activeFaq === i;
              return (
                <div
                  key={i}
                  data-reveal={`faq-${i}`}
                  style={{
                    ...reveal(`faq-${i}`, i * 0.1),
                    background: '#fff',
                    border: open ? `2px solid ${T.clay}` : '1.5px solid #EDE8E3',
                    boxShadow: open ? `0 12px 40px ${T.clay}18` : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button onClick={() => setActiveFaq(open ? null : i)}
                    className="w-full px-6 lg:px-8 py-5 lg:py-6 text-left flex justify-between items-center gap-4 hover:bg-gradient-to-r hover:from-transparent hover:to-[#f9f9f9] transition-all duration-200">
                    <span className="font-semibold text-sm lg:text-base" style={{ color: T.ink }}>{faq.q}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{ background: open ? T.clay : '#F3EDE4', transform: open ? 'rotate(90deg)' : 'none' }}>
                      <ChevronRight className="w-4 h-4" style={{ color: open ? '#fff' : T.clay }} />
                    </div>
                  </button>
                  <div style={{ maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <p className="px-6 lg:px-8 pb-6 text-sm leading-relaxed" style={{ color: T.muted }}>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-14">
            <p className="text-sm mb-6" style={{ color: T.muted }}>Still have questions? We're here to help.</p>
            <Link to="/faq"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              style={{ background: `linear-gradient(135deg, ${T.clay}, ${T.clayDk})` }}>
              View Full FAQ
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ════════════════════════════════════ */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${T.clayDk} 0%, ${T.clay} 100%)` }}>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3')] bg-cover bg-center" />
        <div className="absolute right-0 top-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.06]" style={{ background: '#fff', transform: 'translate(30%,-50%)' }} />
        <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full blur-3xl opacity-[0.04]" style={{ background: T.sage, transform: 'translate(-30%, 30%)' }} />

        <div className="relative container mx-auto px-6 text-center" data-reveal="newsletter" style={reveal('newsletter')}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold tracking-widest mb-8 backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}>
            <Sparkles className="w-4 h-4" style={{ color: T.sage }} />
            Stay in the Loop
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Get Impact Updates
          </h2>
          <p className="mb-10 max-w-xl mx-auto text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Subscribe for updates on our impact stories and ways you can make a difference.
          </p>
          <div className="max-w-md mx-auto flex gap-3 flex-col sm:flex-row">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-5 py-4 rounded-xl text-sm outline-none border-2 border-transparent focus:border-white/40 transition-all focus:scale-105"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', backdropFilter: 'blur(8px)' }}
            />
            <button className="px-7 py-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-2xl group relative overflow-hidden"
              style={{ background: T.sage, color: '#1a3a0a' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle, ${T.sage}30)` }} />
              Subscribe
            </button>
          </div>
          <p className="text-xs mt-5" style={{ color: 'rgba(255,255,255,0.5)' }}>No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        [data-reveal] { will-change: opacity, transform; }
        .group { position: relative; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
