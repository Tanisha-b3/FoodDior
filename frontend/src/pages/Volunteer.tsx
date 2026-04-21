import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../lib/api';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  skills: string;
  availability: string;
  createdAt: string;
}

export default function VolunteerPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', state: '', skills: '', availability: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const loadVolunteers = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.volunteerApplications);
        setVolunteers(
          response.data
            .filter((item: any) => item.status === 'approved')
            .map((item: any) => ({ ...item, id: item._id }))
        );
      } catch (error) {
        console.error('Failed to load volunteer applications:', error);
      }
    };

    loadVolunteers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ENDPOINTS.volunteerApplications, formData);
      const newVolunteer: Volunteer = {
        ...response.data,
        id: response.data._id,
      };
      setVolunteers((current) => [newVolunteer, ...current]);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', city: '', state: '', skills: '', availability: '' });
    } catch (error) {
      console.error('Failed to submit volunteer application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const field = (key: string) => ({
    onFocus: () => setFocused(key),
    onBlur: () => setFocused(null),
  });

  const inputStyle = (key: string): React.CSSProperties => ({
    width: '100%',
    padding: '14px 16px',
    border: focused === key ? '1.5px solid #9CCC65' : '1.5px solid #e2ddd8',
    borderRadius: '10px',
    fontSize: '15px',
    background: focused === key ? '#fafff5' : '#faf9f7',
    outline: 'none',
    transition: 'all 0.2s',
    color: '#2d1f1a',
    boxSizing: 'border-box',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#7a6660',
    marginBottom: '7px',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#faf9f7', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
        .vol-hero-badge { animation: fadeIn 0.6s ease both; }
        .vol-card { animation: slideUp 0.5s ease both; }
        .vol-card:nth-child(2) { animation-delay: 0.07s; }
        .vol-card:nth-child(3) { animation-delay: 0.14s; }
        .vol-card:nth-child(4) { animation-delay: 0.21s; }
        .vol-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
        .submit-btn:hover { background: #8db854 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(156,204,101,0.4) !important; }
        .submit-btn:active { transform: scale(0.98); }
        select option { background: white; }
      `}</style>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #3d2b24 0%, #6b4c3b 40%, #8a6e5a 70%, #9CCC65 100%)',
        padding: '80px 24px 100px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'rgba(156,204,101,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div className="vol-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 40, padding: '6px 16px', marginBottom: 24 }}>
          <span style={{ fontSize: 14, color: '#d4f19a', fontWeight: 500, letterSpacing: '0.05em' }}>🌱 Make a Real Difference</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 6vw, 62px)', color: '#fff', margin: '0 0 16px', lineHeight: 1.1, fontWeight: 800 }}>
          Become a Volunteer
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', margin: '0 auto', maxWidth: 480, lineHeight: 1.6, fontWeight: 300 }}>
          Helping Hands — Together We Can Make a Difference
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
          {[['500+', 'Active Volunteers'], ['10k+', 'Meals Served'], ['50+', 'Partner Orgs']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: '#9CCC65' }}>{val}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '0 24px 80px', marginTop: -40, position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 20px 80px rgba(0,0,0,0.12)', overflow: 'hidden' }}>

            {/* Form header */}
            <div style={{ padding: '32px 40px 0', borderBottom: '1px solid #f0ece6' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#2d1f1a', margin: '0 0 4px', fontWeight: 700 }}>Join Our Team</h2>
              <p style={{ color: '#9e8b84', fontSize: 15, margin: '0 0 28px' }}>Fill in your details and we'll reach out with next steps</p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '32px 40px 40px' }}>
              {/* Success toast */}
              {submitted && (
                <div style={{ background: '#f0f9e4', border: '1.5px solid #9CCC65', borderRadius: 12, padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeIn 0.3s ease' }}>
                  <span style={{ fontSize: 20 }}>✓</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#3d6e1b', fontSize: 15 }}>Thank you for volunteering!</div>
                    <div style={{ color: '#5a9a28', fontSize: 13 }}>We'll contact you soon.</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input type="text" required value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Priya" style={inputStyle('firstName')} {...field('firstName')} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input type="text" required value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Sharma" style={inputStyle('lastName')} {...field('lastName')} />
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number *</label>
                  <input type="tel" required value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210" style={inputStyle('phone')} {...field('phone')} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" required value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@email.com" style={inputStyle('email')} {...field('email')} />
                </div>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input type="text" required value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bhopal" style={inputStyle('city')} {...field('city')} />
                </div>
                <div>
                  <label style={labelStyle}>State *</label>
                  <select required value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    style={inputStyle('state')} {...field('state')}>
                    <option value="">Select your state</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Skills / Experience</label>
                <textarea value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Driving, cooking, logistics, communication..."
                  rows={3} style={{ ...inputStyle('skills'), resize: 'none' as const }} {...field('skills')} />
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Availability</label>
                <textarea value={formData.availability}
                  onChange={e => setFormData({ ...formData, availability: e.target.value })}
                  placeholder="Weekends, evenings, or specific dates..."
                  rows={2} style={{ ...inputStyle('availability'), resize: 'none' as const }} {...field('availability')} />
              </div>

              <button type="submit" className="submit-btn" style={{
                width: '100%', marginTop: 32, padding: '16px',
                background: '#9CCC65', color: '#1e3a0a', border: 'none',
                borderRadius: 12, fontSize: 16, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.03em',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <span>Submit Application</span>
                <span style={{ fontSize: 18 }}>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section style={{ background: '#2d1f1a', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: 72, color: '#9CCC65', lineHeight: 0.6, marginBottom: 24, fontFamily: 'Georgia, serif' }}>"</div>
          <blockquote style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(20px, 3vw, 28px)', color: '#f5ede8', margin: 0, lineHeight: 1.5, fontWeight: 400, fontStyle: 'italic' }}>
            If you want to eliminate hunger, everybody has to be involved.
          </blockquote>
          <p style={{ color: '#9CCC65', fontWeight: 600, marginTop: 20, letterSpacing: '0.1em', fontSize: 14, textTransform: 'uppercase' }}>— Bono</p>
        </div>
      </section>

      {/* Volunteers Grid */}
      <section style={{ padding: '80px 24px', background: '#faf9f7' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: '#2d1f1a', margin: '0 0 8px', fontWeight: 700 }}>Our Volunteers</h2>
            <p style={{ color: '#9e8b84', fontSize: 16 }}>The amazing people behind our mission</p>
          </div>

          {volunteers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: 20, border: '2px dashed #e0d8d0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
              <p style={{ color: '#b0a098', fontSize: 16 }}>No volunteers yet — be the first to join!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {volunteers.map((v, i) => {
                const initials = `${v.firstName[0]}${v.lastName[0]}`.toUpperCase();
                const colors = [['#f0f9e4', '#5a9a28'], ['#fef3e2', '#c47f17'], ['#fce8e8', '#c0392b'], ['#e8f4fd', '#2980b9']];
                const [bg, fg] = colors[i % colors.length];
                return (
                  <div key={v.id} className="vol-card" style={{ background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.25s', cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: fg, flexShrink: 0 }}>{initials}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#2d1f1a' }}>{v.firstName} {v.lastName}</div>
                        <div style={{ fontSize: 13, color: '#9e8b84' }}>{v.city}, {v.state}</div>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #f0ece6', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 13, color: '#7a6660', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>📞</span> {v.phone}
                      </div>
                      <div style={{ fontSize: 13, color: '#7a6660', display: 'flex', alignItems: 'center', gap: 8, wordBreak: 'break-all' as const }}>
                        <span>✉️</span> {v.email}
                      </div>
                      {v.skills && (
                        <div style={{ marginTop: 8, background: '#f7f5f2', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#7a6660', lineHeight: 1.5 }}>
                          <strong style={{ color: '#5a4a44' }}>Skills:</strong> {v.skills}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
