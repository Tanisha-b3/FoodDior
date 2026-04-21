import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations, createDonation } from '../store/slices/donationSlice';
import {
  Camera, Clock, MapPin, Phone, CheckCircle, User, Heart,
  ArrowRight, X, Utensils, ChevronDown
} from 'lucide-react';

type OrganizationType = 'hotel' | 'restaurant' | 'marriage_hall' | 'party' | 'household' | 'ngo';


const orgTypes: { value: OrganizationType; label: string; icon: string }[] = [
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'marriage_hall', label: 'Marriage Hall', icon: '🏛️' },
  { value: 'party', label: 'Party / Event', icon: '🎉' },
  { value: 'household', label: 'Household', icon: '🏠' },
  { value: 'ngo', label: 'NGO', icon: '🤝' },
];

const foodTypes = [
  'Vegetables', 'Fruits', 'Cooked Food', 'Bread & Bakery',
  'Rice & Pulses', 'Dairy Products', 'Mixed Meals', 'Other',
];

const statusConfig: Record<string, { label: string; classes: string }> = {
  available:  { label: 'Available',  classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-300' },
  claimed:    { label: 'Claimed',    classes: 'bg-amber-50  text-amber-700  border-amber-200  ring-amber-300'  },
  collected:  { label: 'Collected',  classes: 'bg-sky-50    text-sky-700    border-sky-200    ring-sky-300'    },
  completed:  { label: 'Completed',  classes: 'bg-violet-50 text-violet-700 border-violet-200 ring-violet-300' },
};

/* ─── tiny reusable field wrapper ─────────────────────────────────────────── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold tracking-widest uppercase text-stone-500 select-none">
        {label}{required && <span className="ml-0.5 text-[#9CCC65]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 ' +
  'text-sm transition-all duration-200 outline-none ' +
  'focus:bg-white focus:border-[#9CCC65] focus:ring-2 focus:ring-[#9CCC65]/20 ' +
  'hover:border-stone-300';

export default function Donate() {
  const dispatch = useAppDispatch();
  const { donations, loading } = useAppSelector((state) => state.donations);
  const { currentUser } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    donorName: '', organizationType: 'hotel' as OrganizationType,
    phone: '', email: '', address: '', city: '', state: '',
    foodType: 'Cooked Food', quantity: '', description: '',
    availableFrom: '', availableUntil: '', imageUrl: '',
  });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max 5 MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      set('imageUrl', result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(createDonation({
        donorId: currentUser?._id,
        name: form.donorName,
        email: form.email,
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.state}`,
        foodType: form.foodType,
        quantity: form.quantity,
        expiryDate: form.availableUntil,
        description: form.description,
        organizationType: form.organizationType,
        city: form.city,
        state: form.state,
        imageUrl: form.imageUrl,
        availableFrom: form.availableFrom,
        availableUntil: form.availableUntil,
        donar: {
          id: currentUser?._id || '',
          name: form.donorName,
          phone: form.phone,
        },
      })).unwrap();

      setShowSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 4000);

      setForm({ donorName: '', organizationType: 'hotel', phone: '', email: '', address: '', city: '', state: '', foodType: 'Cooked Food', quantity: '', description: '', availableFrom: '', availableUntil: '', imageUrl: '' });
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting donation:', error);
      setIsSubmitting(false);
      alert('Failed to submit donation. Please try again.');
    }
  };

  /* ── section heading helper ── */
  const SectionHead = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-stone-100">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#9CCC65]/15 text-[#5a8a2a]">
        <Icon className="w-4 h-4" />
      </span>
      <h3 className="text-sm font-bold tracking-widest uppercase text-stone-600">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f5f2] font-['DM_Sans',system-ui,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .anim-1{animation:fadeUp .7s .05s both}
        .anim-2{animation:fadeUp .7s .18s both}
        .anim-3{animation:fadeUp .7s .30s both}
        .anim-4{animation:fadeUp .7s .42s both}
        .toast-in{animation:fadeUp .35s both}
        .spinner{animation:spin .8s linear infinite}
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] flex items-center overflow-hidden">
        {/* layered bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1008] via-[#4a2c18] to-[#7a5030]" />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, rgba(156,204,101,.13) 0%, transparent 55%), radial-gradient(circle at 15% 75%, rgba(255,160,80,.07) 0%, transparent 50%)' }} />
        {/* subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* leaf accents */}
        <div className="absolute top-16 right-12 text-[120px] opacity-[0.07] select-none rotate-[-20deg]">🍃</div>
        <div className="absolute bottom-10 left-8 text-[80px] opacity-[0.06] select-none rotate-12">🌿</div>

        <div className="relative z-10 container mx-auto px-6 py-28 text-center max-w-4xl">
          {/* pill badge */}
          <div className="anim-1 inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8
            bg-white/10 border border-white/20 backdrop-blur-sm text-white/90 text-xs font-semibold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#9CCC65] animate-pulse" />
            Make a Difference
          </div>

          <h1 className="anim-2 font-['Cormorant_Garamond',Georgia,serif] font-bold text-white leading-[.95] mb-6"
            style={{ fontSize: 'clamp(52px, 8vw, 88px)' }}>
            Donate Food for<br />
            <em className="text-[#9CCC65] not-italic">#ZeroHunger</em>
          </h1>

          <p className="anim-3 text-white/70 text-lg max-w-xl mx-auto leading-relaxed font-light mb-10">
            "If you can't feed a hundred people, then feed just one."
            <span className="block text-white/45 text-sm mt-1">— Mother Teresa</span>
          </p>

          {/* live stat pills */}
          <div className="anim-4 flex flex-wrap gap-4 justify-center">
            {[
              [`${donations.length || 0}+`, 'Meals Listed'],
              ['500+', 'Lives Impacted'],
              ['1 000 kg+', 'Food Saved'],
            ].map(([val, label]) => (
              <div key={label} className="flex flex-col items-center px-8 py-4
                bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15">
                <span className="font-['Cormorant_Garamond',serif] font-bold text-[#9CCC65] text-3xl leading-none">{val}</span>
                <span className="text-white/55 text-xs tracking-widest uppercase mt-1 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14">
            <path d="M0 60 C360 0 1080 0 1440 60 L1440 60 L0 60 Z" fill="#f7f5f2"/>
          </svg>
        </div>
      </section>

      {/* ── FORM CARD ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* success toast */}
          {showSuccess && (
            <div className="toast-in mb-6 flex items-start gap-4 p-5 rounded-2xl
              bg-emerald-50 border border-emerald-200 shadow-sm shadow-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800 text-sm">Donation submitted — thank you! 🎉</p>
                <p className="text-emerald-600 text-xs mt-0.5">Our team will coordinate pickup shortly.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/60 overflow-hidden border border-stone-100">

            {/* card header strip */}
            <div className="relative px-8 py-7 bg-gradient-to-r from-[#2d1f1a] to-[#5a3828] overflow-hidden">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[64px] opacity-10 select-none">🍱</div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#9CCC65] mb-1">Food Doer</p>
              <h2 className="font-['Cormorant_Garamond',serif] text-white text-3xl font-bold">Donate Surplus Food</h2>
              <p className="text-white/55 text-sm mt-1">Fill out the details below to list your food donation</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-10">

              {/* ── Donor Info ── */}
              <div>
                <SectionHead icon={User} title="Donor Information" />
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Organisation / Name" required>
                    <input type="text" required value={form.donorName}
                      onChange={e => set('donorName', e.target.value)}
                      placeholder="Your name or org name" className={inputCls} />
                  </Field>
                  <Field label="Organisation Type" required>
                    <div className="relative">
                      <select required value={form.organizationType}
                        onChange={e => set('organizationType', e.target.value as OrganizationType)}
                        className={inputCls + ' appearance-none pr-10 cursor-pointer'}>
                        {orgTypes.map(t => (
                          <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                  </Field>
                </div>
              </div>

              {/* ── Contact ── */}
              <div>
                <SectionHead icon={Phone} title="Contact Information" />
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Phone Number" required>
                    <input type="tel" required value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="+91 98765 43210" className={inputCls} />
                  </Field>
                  <Field label="Email Address">
                    <input type="email" value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="your@email.com" className={inputCls} />
                  </Field>
                </div>
              </div>

              {/* ── Location ── */}
              <div>
                <SectionHead icon={MapPin} title="Pickup Location" />
                <div className="space-y-5">
                  <Field label="Full Pickup Address" required>
                    <input type="text" required value={form.address}
                      onChange={e => set('address', e.target.value)}
                      placeholder="Street, area, landmark…" className={inputCls} />
                  </Field>
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="City" required>
                      <input type="text" required value={form.city}
                        onChange={e => set('city', e.target.value)}
                        placeholder="Bhopal" className={inputCls} />
                    </Field>
                    <Field label="State" required>
                      <input type="text" required value={form.state}
                        onChange={e => set('state', e.target.value)}
                        placeholder="Madhya Pradesh" className={inputCls} />
                    </Field>
                  </div>
                </div>
              </div>

              {/* ── Food Details ── */}
              <div>
                <SectionHead icon={Utensils} title="Food Details" />
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Food Type" required>
                      <div className="relative">
                        <select required value={form.foodType}
                          onChange={e => set('foodType', e.target.value)}
                          className={inputCls + ' appearance-none pr-10 cursor-pointer'}>
                          {foodTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Quantity" required>
                      <input type="text" required value={form.quantity}
                        onChange={e => set('quantity', e.target.value)}
                        placeholder="e.g. 50 meals, 10 kg, 20 packets" className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea value={form.description}
                      onChange={e => set('description', e.target.value)}
                      rows={3} placeholder="Describe the food — items, packaging, freshness…"
                      className={inputCls + ' resize-none'} />
                  </Field>
                </div>
              </div>

              {/* ── Image Upload ── */}
              <div>
                <SectionHead icon={Camera} title="Food Photo" />
                <input type="file" ref={fileInputRef} accept="image/*"
                  onChange={handleImage} className="hidden" />

                {imagePreview ? (
                  <div className="relative w-fit">
                    <img src={imagePreview} alt="Preview"
                      className="w-36 h-36 object-cover rounded-2xl border-2 border-[#9CCC65]/40 shadow-md" />
                    <button type="button"
                      onClick={() => { setImagePreview(null); set('imageUrl', ''); }}
                      className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center
                        rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-xs text-stone-400 mt-2">Tap ✕ to remove</p>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="group flex flex-col items-center justify-center gap-3 w-full py-10
                      rounded-2xl border-2 border-dashed border-stone-200
                      hover:border-[#9CCC65] hover:bg-[#9CCC65]/[0.03]
                      transition-all duration-200 cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 group-hover:bg-[#9CCC65]/15
                      flex items-center justify-center transition-colors duration-200">
                      <Camera className="w-6 h-6 text-stone-400 group-hover:text-[#5a8a2a] transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-stone-600 group-hover:text-stone-800">Upload a photo</p>
                      <p className="text-xs text-stone-400 mt-0.5">PNG, JPG up to 5 MB</p>
                    </div>
                  </button>
                )}
              </div>

              {/* ── Availability ── */}
              <div>
                <SectionHead icon={Clock} title="Availability Window" />
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Available From" required>
                    <input type="datetime-local" required value={form.availableFrom}
                      onChange={e => set('availableFrom', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Available Until" required>
                    <input type="datetime-local" required value={form.availableUntil}
                      onChange={e => set('availableUntil', e.target.value)} className={inputCls} />
                  </Field>
                </div>
              </div>

              {/* ── Submit ── */}
              <button type="submit" disabled={isSubmitting}
                className="relative w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase
                  overflow-hidden group transition-all duration-300
                  bg-gradient-to-r from-[#2d1f1a] to-[#5a3828]
                  text-white hover:shadow-xl hover:shadow-stone-900/20
                  disabled:opacity-60 disabled:cursor-not-allowed
                  hover:-translate-y-0.5 active:translate-y-0">
                {/* shimmer overlay */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <svg className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"/>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      Submit Donation
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* ── AVAILABLE DONATIONS ───────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-[#9CCC65] mb-3">Browse</p>
            <h2 className="font-['Cormorant_Garamond',serif] font-bold text-stone-800"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
              Available Donations
            </h2>
            <p className="text-stone-500 mt-3 max-w-md mx-auto text-sm leading-relaxed">
              Browse food donations available near you and help connect surplus to need
            </p>
          </div>

          {donations.length === 0 && !loading ? (
            <div className="text-center py-20 rounded-3xl bg-white border-2 border-dashed border-stone-200">
              <div className="text-6xl mb-4 opacity-30">🍱</div>
              <p className="text-stone-400 text-sm font-medium">No donations listed yet — be the first!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((d: any) => {
                const orgIcon = orgTypes.find(o => o.value === d.organizationType)?.icon ?? '📦';
                const sc = statusConfig[d.status] || statusConfig.available;
                const addressParts = d.address ? d.address.split(', ') : [];
                return (
                  <div key={d._id}
                    className="group bg-white rounded-3xl overflow-hidden border border-stone-100
                      shadow-md shadow-stone-100 hover:shadow-xl hover:shadow-stone-200/70
                      transition-all duration-300 hover:-translate-y-1.5 flex flex-col">

                    <div className="relative h-48 overflow-hidden bg-stone-100 flex-shrink-0">
                      {d.imageUrl
                        ? <img src={d.imageUrl} alt={d.foodType}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
                        : <div className="w-full h-full flex items-center justify-center text-5xl opacity-25">🍱</div>
                      }
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold
                        tracking-widest uppercase border ${sc.classes}`}>
                        {sc.label}
                      </span>
                      <span className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm
                        shadow-sm flex items-center justify-center text-lg">
                        {orgIcon}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div>
                        <h3 className="font-bold text-stone-800 text-base leading-snug">{d.foodType}</h3>
                        <p className="text-[#5a8a2a] text-sm font-semibold mt-0.5">{d.quantity}</p>
                      </div>
                      {d.description && (
                        <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{d.description}</p>
                      )}
                      <div className="mt-auto pt-3 border-t border-stone-100 space-y-1.5">
                        {[
                          { icon: MapPin, text: addressParts[0] || d.address || 'Address not specified' },
                          { icon: User, text: d.name },
                          { icon: Phone, text: d.phone },
                        ].map(({ icon: Icon, text }) => (
                          <p key={text} className="flex items-center gap-2 text-stone-500 text-xs">
                            <Icon className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                            {text}
                          </p>
                        ))}
                        {d.expiryDate && (
                          <p className="flex items-center gap-2 text-xs text-amber-600 font-medium mt-1">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            Until {new Date(d.expiryDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── IMPACT STRIP ─────────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1008] via-[#3a2010] to-[#1c1008]" />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, #9CCC65 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div className="relative max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest uppercase text-[#9CCC65] mb-10">Our Impact</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { val: `${donations.length || 0}+`, label: 'Meals Donated', icon: '🍱' },
              { val: '500+',    label: 'Lives Impacted',         icon: '❤️' },
              { val: '1000kg+', label: 'Food Saved from Waste',  icon: '♻️' },
            ].map(({ val, label, icon }) => (
              <div key={label}
                className="text-center px-8 py-8 rounded-2xl bg-white/5 border border-white/10
                  hover:bg-white/8 transition-colors">
                <div className="text-4xl mb-3">{icon}</div>
                <div className="font-['Cormorant_Garamond',serif] font-bold text-[#9CCC65] text-4xl leading-none mb-2">{val}</div>
                <div className="text-white/50 text-xs tracking-widest uppercase font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
