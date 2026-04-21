import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../lib/api';

type OrganizationType = 'old_age_home' | 'charity' | 'ngo' | 'household';
type RequestStatus = 'pending' | 'fulfilled' | 'cancelled';

interface FoodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  organizationType: OrganizationType;
  requiredQuantity: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  status: RequestStatus;
  createdAt: string;
}

const orgTypes: { value: OrganizationType; label: string; emoji: string; desc: string }[] = [
  { value: 'old_age_home', label: 'Old Age Home',    emoji: '🏠', desc: 'Caring for elderly citizens' },
  { value: 'charity',      label: 'Charity / Trust', emoji: '🤝', desc: 'Community welfare organizations' },
  { value: 'ngo',          label: 'NGO',              emoji: '🌍', desc: 'Non-profit organizations' },
  { value: 'household',    label: 'Needy Family',     emoji: '👨‍👩‍👧', desc: 'Families in need' },
];

const steps = [
  { n: '01', title: 'Submit Request', body: 'Fill the form with your details and food requirements.' },
  { n: '02', title: 'Get Matched',    body: 'We connect you with nearby donors who can help.' },
  { n: '03', title: 'Receive Food',   body: 'Coordinate pickup / delivery and receive the donation.' },
];

const statusMeta: Record<RequestStatus, { label: string; dot: string; pill: string }> = {
  pending:   { label: 'Pending',   dot: 'bg-amber-400',   pill: 'bg-amber-50 text-amber-700 ring-amber-200' },
  fulfilled: { label: 'Fulfilled', dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400',     pill: 'bg-red-50 text-red-700 ring-red-200' },
};

export default function Request() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);

  const empty = {
    requesterName: '', organizationType: 'old_age_home' as OrganizationType,
    phone: '', email: '', address: '', city: '', state: '', requiredQuantity: '', description: '',
  };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [ok,   setOk]   = useState(false);
  const [foc,  setFoc]  = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.communityRequests);
        setRequests(response.data.map((item: any) => ({ ...item, id: item._id })));
      } catch (error) {
        console.error('Failed to load community requests:', error);
      }
    };

    loadRequests();
  }, []);

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const response = await axios.post(API_ENDPOINTS.communityRequests, form);
      const req: FoodRequest = {
        ...response.data,
        id: response.data._id,
        requesterId: response.data._id,
      };
      setRequests((current) => [req, ...current]);
      setOk(true);
      setTimeout(() => setOk(false), 4000);
      setForm(empty);
    } catch (error) {
      console.error('Failed to submit community request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const stats = [
    { val: requests.length,                                        label: 'Total Requests', emoji: '📦' },
    { val: requests.filter(r => r.status === 'pending').length,   label: 'Pending',        emoji: '⏳' },
    { val: requests.filter(r => r.status === 'fulfilled').length, label: 'Fulfilled',      emoji: '✅' },
    { val: '24/7',                                                 label: 'Support',        emoji: '💚' },
  ];

  const ring = (k: string) =>
    foc === k
      ? 'border-[#9CCC65] ring-2 ring-[#9CCC65]/25 bg-green-50/40'
      : 'border-stone-200 bg-white hover:border-stone-300';

  const inp = `w-full px-4 py-3 rounded-xl border text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-all duration-200`;

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&display=swap');
        * { box-sizing: border-box; }
        body, .req-root { font-family: 'DM Sans', 'Segoe UI', sans-serif; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(.95); }      to { opacity:1; transform:scale(1); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ping2   { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.5);opacity:0} }
        .anim-up  { animation: fadeUp  .65s ease both; }
        .anim-in  { animation: scaleIn .5s  ease both; }
        .anim-sl  { animation: slideIn .4s  ease both; }
        .card-lift { transition: box-shadow .25s, transform .25s; }
        .card-lift:hover { transform: translateY(-3px); box-shadow: 0 20px 56px rgba(0,0,0,.09); }
        .ping2 { animation: ping2 1.8s ease-in-out infinite; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1108] via-[#3d2510] to-[#72501e]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse 70% 60% at 80% 40%,rgba(156,204,101,.14) 0%,transparent 70%),radial-gradient(ellipse 50% 50% at 10% 80%,rgba(141,110,99,.22) 0%,transparent 70%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        <div className="absolute top-[-10%] right-[-4%] w-[420px] h-[420px] rounded-full blur-[100px] bg-[#9CCC65]/10 pointer-events-none" />
        <div className="absolute bottom-[-12%] left-[-6%] w-[500px] h-[500px] rounded-full blur-[120px] bg-orange-600/5 pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-28 text-center">
          {/* live badge */}
          <div className="anim-up inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-5 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="ping2 absolute inline-flex h-full w-full rounded-full bg-[#9CCC65] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9CCC65]" />
            </span>
            <span className="text-[#c5e890] text-xs font-semibold tracking-[.1em] uppercase">Get Help Today</span>
          </div>

          <h1 className="anim-up serif text-white leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(44px,8vw,84px)', fontWeight: 700, animationDelay: '.12s' }}>
            Request Food for<br />
            <em className="text-[#9CCC65]">Your Organization</em>
          </h1>

          <p className="anim-up text-white/65 text-lg max-w-xl mx-auto leading-relaxed font-light" style={{ animationDelay: '.26s' }}>
            Connecting NGOs, old age homes &amp; charitable organizations with food donors who want to make a real difference.
          </p>

          {/* stat pills */}
          <div className="anim-up flex flex-wrap justify-center gap-4 mt-14" style={{ animationDelay: '.4s' }}>
            {stats.map(({ val, label, emoji }) => (
              <div key={label} className="bg-white/8 border border-white/15 backdrop-blur-md rounded-2xl px-6 py-4 text-center min-w-[106px]">
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="serif text-white font-bold text-xl leading-none">{val}</div>
                <div className="text-white/50 text-[10px] mt-1 tracking-wider uppercase font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* wave */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60 C360 0 1080 75 1440 20 L1440 60 Z" fill="#FAF9F7" />
        </svg>
      </section>

      {/* ── FORM ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-[.14em] uppercase text-[#9CCC65]">Food Assistance</span>
            <h2 className="serif mt-2 text-[#2d1f1a]" style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700 }}>Submit a Request</h2>
            <p className="text-stone-500 mt-2 text-[15px]">Fill in your details and we'll match you with a nearby donor</p>
          </div>

          <div className="anim-in bg-white rounded-3xl shadow-[0_12px_60px_rgba(0,0,0,.08)] overflow-hidden border border-stone-100">
            {/* card header */}
            <div className="relative px-8 py-5 flex items-center gap-3 overflow-hidden bg-gradient-to-r from-[#2d1f1a] to-[#5a3828]">
              <div className="absolute right-0 top-0 w-48 h-full bg-[#9CCC65]/12" style={{ clipPath: 'polygon(30% 0,100% 0,100% 100%,0% 100%)' }} />
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="text-white font-semibold text-lg">Request Food Donation</h3>
                <p className="text-white/55 text-xs mt-0.5">All starred fields are required</p>
              </div>
            </div>

            <form onSubmit={submit} className="px-8 py-10 space-y-10">

              {/* success toast */}
              {ok && (
                <div className="anim-sl flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <span className="text-xl mt-0.5">✅</span>
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">Request submitted!</p>
                    <p className="text-emerald-600 text-xs mt-0.5">We'll connect you with donors in your area soon.</p>
                  </div>
                </div>
              )}

              {/* ── Organisation ── */}
              <fieldset className="space-y-5">
                <legend className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-[#9CCC65]/20 flex items-center justify-center text-sm">🏢</span>
                  <span className="text-[11px] font-bold tracking-[.12em] uppercase text-stone-400">Organisation Info</span>
                </legend>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Organisation / Name *</label>
                  <input required type="text" value={form.requesterName}
                    onChange={e => upd('requesterName', e.target.value)}
                    onFocus={() => setFoc('name')} onBlur={() => setFoc(null)}
                    placeholder="Organisation name or your name"
                    className={`${inp} ${ring('name')}`} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Type *</label>
                    <select required value={form.organizationType}
                      onChange={e => upd('organizationType', e.target.value)}
                      onFocus={() => setFoc('type')} onBlur={() => setFoc(null)}
                      className={`${inp} ${ring('type')} cursor-pointer`}>
                      {orgTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <div className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">About this type</p>
                      <p className="text-sm text-stone-600">{orgTypes.find(t => t.value === form.organizationType)?.desc}</p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="border-t border-dashed border-stone-100" />

              {/* ── Contact ── */}
              <fieldset className="space-y-5">
                <legend className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-[#9CCC65]/20 flex items-center justify-center text-sm">📞</span>
                  <span className="text-[11px] font-bold tracking-[.12em] uppercase text-stone-400">Contact Details</span>
                </legend>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Phone *</label>
                    <input required type="tel" value={form.phone}
                      onChange={e => upd('phone', e.target.value)}
                      onFocus={() => setFoc('phone')} onBlur={() => setFoc(null)}
                      placeholder="+91 98765 43210"
                      className={`${inp} ${ring('phone')}`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Email</label>
                    <input type="email" value={form.email}
                      onChange={e => upd('email', e.target.value)}
                      onFocus={() => setFoc('email')} onBlur={() => setFoc(null)}
                      placeholder="your@email.com"
                      className={`${inp} ${ring('email')}`} />
                  </div>
                </div>
              </fieldset>

              <div className="border-t border-dashed border-stone-100" />

              {/* ── Location ── */}
              <fieldset className="space-y-5">
                <legend className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-[#9CCC65]/20 flex items-center justify-center text-sm">📍</span>
                  <span className="text-[11px] font-bold tracking-[.12em] uppercase text-stone-400">Delivery Location</span>
                </legend>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Full Address *</label>
                  <input required type="text" value={form.address}
                    onChange={e => upd('address', e.target.value)}
                    onFocus={() => setFoc('addr')} onBlur={() => setFoc(null)}
                    placeholder="House / building, street, area"
                    className={`${inp} ${ring('addr')}`} />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">City *</label>
                    <input required type="text" value={form.city}
                      onChange={e => upd('city', e.target.value)}
                      onFocus={() => setFoc('city')} onBlur={() => setFoc(null)}
                      placeholder="Bhopal"
                      className={`${inp} ${ring('city')}`} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">State *</label>
                    <input required type="text" value={form.state}
                      onChange={e => upd('state', e.target.value)}
                      onFocus={() => setFoc('state')} onBlur={() => setFoc(null)}
                      placeholder="Madhya Pradesh"
                      className={`${inp} ${ring('state')}`} />
                  </div>
                </div>
              </fieldset>

              <div className="border-t border-dashed border-stone-100" />

              {/* ── Food Requirements ── */}
              <fieldset className="space-y-5">
                <legend className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-[#9CCC65]/20 flex items-center justify-center text-sm">🍱</span>
                  <span className="text-[11px] font-bold tracking-[.12em] uppercase text-stone-400">Food Requirements</span>
                </legend>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Quantity Required *</label>
                  <input required type="text" value={form.requiredQuantity}
                    onChange={e => upd('requiredQuantity', e.target.value)}
                    onFocus={() => setFoc('qty')} onBlur={() => setFoc(null)}
                    placeholder="e.g. 50 meals, 20 kg rice, 10 boxes"
                    className={`${inp} ${ring('qty')}`} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2">Additional Details</label>
                  <textarea value={form.description}
                    onChange={e => upd('description', e.target.value)}
                    onFocus={() => setFoc('desc')} onBlur={() => setFoc(null)}
                    placeholder="Number of people, dietary requirements, preferred timings, etc."
                    rows={4}
                    className={`${inp} ${ring('desc')} resize-none`} />
                </div>
              </fieldset>

              {/* Submit button */}
              <button type="submit" disabled={busy}
                className="relative w-full py-4 rounded-2xl font-bold text-base overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(156,204,101,.35)]"
                style={{ background: 'linear-gradient(135deg,#3d7a14 0%,#9CCC65 60%,#8db854 100%)', color: '#0f2a04' }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {busy ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </>
                  )}
                </span>
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* ── ACTIVE REQUESTS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[.14em] uppercase text-[#9CCC65]">Live Board</span>
            <h2 className="serif mt-2 text-[#2d1f1a]" style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700 }}>Active Requests</h2>
            <p className="text-stone-400 mt-2 text-sm">Pending food requests waiting to be matched with donors</p>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-3xl">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-stone-400 text-base">No requests yet — yours could be the first!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {requests.map((req) => {
                const org  = orgTypes.find(t => t.value === req.organizationType);
                const meta = statusMeta[req.status];
                return (
                  <div key={req.id} className="card-lift bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,.05)]">
                    <div className="px-5 py-4 bg-gradient-to-r from-[#2d1f1a] to-[#5a3828] flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{org?.emoji}</span>
                        <span className="font-semibold text-white text-sm truncate">{req.requesterName}</span>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 ${meta.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="bg-[#f5fcea] border border-[#9CCC65]/25 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Quantity Needed</p>
                        <p className="text-stone-700 font-semibold text-sm">{req.requiredQuantity}</p>
                      </div>

                      {req.description && (
                        <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{req.description}</p>
                      )}

                      <div className="space-y-1.5 pt-1 border-t border-stone-100">
                        <div className="flex items-center gap-2 text-xs text-stone-400"><span>📍</span>{req.city}, {req.state}</div>
                        <div className="flex items-center gap-2 text-xs text-stone-400"><span>📞</span>{req.phone}</div>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <span>🗓</span>
                          {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      {req.status === 'pending' && (
                        <button className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-[#3d7a14] bg-[#9CCC65]/15 hover:bg-[#9CCC65]/30 transition-colors border border-[#9CCC65]/25">
                          I can help ↗
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 bg-[#FAF9F7]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-[.14em] uppercase text-[#9CCC65]">Simple Process</span>
            <h2 className="serif mt-2 text-[#2d1f1a]" style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700 }}>How It Works</h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-[#9CCC65]/30 via-[#9CCC65] to-[#9CCC65]/30 z-0" />
            {steps.map(({ n, title, body }, i) => (
              <div key={n} className="relative z-10 text-center">
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-5 flex flex-col items-center justify-center shadow-lg ${i === 1 ? '' : 'bg-white border border-stone-200'}`}
                  style={i === 1 ? { background: 'linear-gradient(135deg,#3d7a14,#9CCC65)' } : {}}>
                  <span className={`serif font-black leading-none text-[28px] ${i === 1 ? 'text-white' : 'text-[#9CCC65]'}`}>{n}</span>
                </div>
                <h3 className="font-bold text-[#2d1f1a] text-lg mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE FOOTER ── */}
      <section className="py-20 px-4 bg-[#1c1008] text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-[64px] text-[#9CCC65]/60 leading-none mb-4" style={{ fontFamily: 'Georgia, serif' }}>"</div>
          <blockquote className="serif italic text-white/90 leading-relaxed" style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 500 }}>
            If you want to eliminate hunger, everybody has to be involved.
          </blockquote>
          <p className="text-[#9CCC65] text-sm font-bold tracking-[.1em] uppercase mt-6">— Bono</p>
        </div>
      </section>
    </div>
  );
}
