import { Link } from 'react-router-dom';
import { 
  Heart, Leaf, Users, Clock, TrendingUp, 
  ArrowRight, CheckCircle, Phone, Mail, MapPin,
  Calendar, Globe, Handshake, Utensils, Building2,
  PartyPopper, Home, Hotel, Sparkles, Star,
  Zap, Shield, Target, Coffee,  ChevronRight, Quote
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Homek() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const initiatives = [
    {
      icon: Leaf,
      title: "Reduce Food Wastage",
      description: "Partner with local businesses and events to collect surplus food that would otherwise go to waste.",
      color: "from-green-500 to-emerald-500",
      gradient: "group-hover:from-green-600 group-hover:to-emerald-600",
      delay: "0s",
      stats: "2.5M lbs saved"
    },
    {
      icon: Heart,
      title: "Donate To Needy People",
      description: "Our dedicated volunteers reach people in every corner - urban or rural areas.",
      color: "from-red-500 to-pink-500",
      gradient: "group-hover:from-red-600 group-hover:to-pink-600",
      delay: "0.1s",
      stats: "50K+ families"
    },
    {
      icon: Globe,
      title: "Anywhere, Everywhere!",
      description: "No one is left behind when it comes to accessing quality food.",
      color: "from-blue-500 to-cyan-500",
      gradient: "group-hover:from-blue-600 group-hover:to-cyan-600",
      delay: "0.2s",
      stats: "100+ cities"
    },
    {
      icon: Clock,
      title: "24/7 Services",
      description: "Available around the clock because hunger knows no schedule.",
      color: "from-purple-500 to-indigo-500",
      gradient: "group-hover:from-purple-600 group-hover:to-indigo-600",
      delay: "0.3s",
      stats: "Always open"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Meals Donated", icon: TrendingUp, trend: "+25%", trendColor: "text-green-500" },
    { value: "500+", label: "Active Volunteers", icon: Users, trend: "+50", trendColor: "text-blue-500" },
    { value: "50+", label: "Partner Organizations", icon: Building2, trend: "+12", trendColor: "text-purple-500" },
    { value: "98%", label: "Satisfaction Rate", icon: Star, trend: "+2%", trendColor: "text-yellow-500" }
  ];

  const partners = [
    { name: "Restaurants", icon: Utensils, color: "from-orange-500 to-red-500", count: 150 },
    { name: "Marriage Halls", icon: Building2, color: "from-purple-500 to-pink-500", count: 45 },
    { name: "Parties", icon: PartyPopper, color: "from-yellow-500 to-orange-500", count: 200 },
    { name: "Local Celebrations", icon: Calendar, color: "from-green-500 to-emerald-500", count: 300 },
    { name: "Households", icon: Home, color: "from-blue-500 to-cyan-500", count: 1000 },
    { name: "Hotels", icon: Hotel, color: "from-red-500 to-rose-500", count: 80 }
  ];

  const impactStories = [
    {
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3",
      title: "Community Kitchen",
      description: "Surplus food from events redistributed to those in need.",
      icon: Heart,
      impact: "1,200 meals/week"
    },
    {
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3",
      title: "Hotel Donations",
      description: "Hotels and restaurants contributing surplus meals.",
      icon: Building2,
      impact: "800 meals/week"
    },
    {
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3",
      title: "Family Meals",
      description: "Households sharing extra food with neighbors.",
      icon: Home,
      impact: "500 meals/week"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Volunteer",
      content: "Being part of this initiative has been life-changing. Seeing the smiles on people's faces when they receive a warm meal is priceless.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      name: "Rajesh Mehta",
      role: "Restaurant Owner",
      content: "We've partnered with Food Doer for 6 months now. Their team is professional, prompt, and truly cares about the cause.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      name: "Anita Desai",
      role: "Beneficiary",
      content: "Food Doer has been a blessing for our community. The volunteers are so kind and the food is always fresh.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ];

  const features = [
    { icon: Zap, title: "Fast Response", description: "Quick pickup and delivery within 30 minutes", color: "text-yellow-500" },
    { icon: Shield, title: "Safe & Hygienic", description: "Quality checked food with proper packaging", color: "text-green-500" },
    { icon: Target, title: "Targeted Distribution", description: "Reaching the most vulnerable communities", color: "text-red-500" },
    { icon: Coffee, title: "Warm Meals", description: "Hot and fresh food delivered daily", color: "text-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8D6E63] via-[#6E554D] to-[#4a3a33]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-30" />
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                width: Math.random() * 10 + 5 + 'px',
                height: Math.random() * 10 + 5 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fadeIn border border-white/30">
              <Sparkles className="w-5 h-5 text-[#9CCC65] animate-pulse" />
              <span className="text-white font-medium">Join the Food Revolution</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-['Poppins'] animate-slideUp">
              FOOD DOER
              <span className="text-[#9CCC65] animate-pulse inline-block">!!</span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-4 animate-slideUp animation-delay-200">
              "Nourish Lives, Not Landfills.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-8 animate-slideUp animation-delay-300">
              Join the Food Revolution!"
            </p>
            
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-slideUp animation-delay-400">
              Every Meal Counts. Every Share Matters. Together We Can End Hunger.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp animation-delay-500">
              <Link 
                to="/donate" 
                className="group relative overflow-hidden bg-[#9CCC65] text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 hover:shadow-[#9CCC65]/30"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Donate Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#8db854] to-[#9CCC65] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
              
              <Link 
                to="/request" 
                className="group bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 transition-all transform hover:scale-105 border border-white/30 hover:border-white/50"
              >
                <span className="flex items-center gap-2">
                  Request Food
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#9CCC65]" />
                <span>Trusted by 500+ organizations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#9CCC65]" />
                <span>Zero food waste since 2020</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#9CCC65]" />
                <span>24/7 support team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white -mt-10 relative z-10 rounded-t-3xl shadow-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 cursor-pointer scroll-animate"
                  id={`stat-${index}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    opacity: isVisible[`stat-${index}`] ? 1 : 0,
                    transform: isVisible[`stat-${index}`] ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease-out'
                  }}
                >
                  <div className="inline-flex p-3 bg-gradient-to-r from-[#8D6E63] to-[#6E554D] rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm mb-2">{stat.label}</div>
                  <div className={`text-xs font-semibold ${stat.trendColor}`}>{stat.trend} growth</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12 bg-gradient-to-r from-[#8D6E63] to-[#6E554D]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 text-white">
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-white/70">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#9CCC65]/10 rounded-full px-4 py-2 mb-4">
              <Target className="w-4 h-4 text-[#9CCC65]" />
              <span className="text-[#9CCC65] font-semibold text-sm">Our Mission</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Poppins']">
              Ensuring Food for <span className="text-[#8D6E63]">Every Person</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're on a mission to eliminate hunger and reduce food waste through community action
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer scroll-animate"
                  id={`initiative-${index}`}
                  style={{ 
                    animationDelay: initiative.delay,
                    opacity: isVisible[`initiative-${index}`] ? 1 : 0,
                    transform: isVisible[`initiative-${index}`] ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.6s ease-out'
                  }}
                >
                  <div className={`inline-flex p-4 bg-gradient-to-r ${initiative.color} rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{initiative.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">{initiative.description}</p>
                  <div className="text-sm font-semibold text-[#8D6E63]">{initiative.stats}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Gallery */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <Camera className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-semibold text-sm">Our Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Poppins']">
              Reduce Food <span className="text-[#8D6E63]">Wastage</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how we're making a difference in communities across the country
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {impactStories.map((story, index) => {
              const Icon = story.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 scroll-animate"
                  id={`story-${index}`}
                  style={{
                    opacity: isVisible[`story-${index}`] ? 1 : 0,
                    transform: isVisible[`story-${index}`] ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.6s ease-out ${index * 0.1}s`
                  }}
                >
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 transition-all duration-300">
                    <div className="inline-flex p-2 bg-white/20 backdrop-blur-sm rounded-lg mb-2">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{story.title}</h3>
                    <p className="text-white/80 text-sm mb-2">{story.description}</p>
                    <div className="flex items-center gap-2 text-[#9CCC65] text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      {story.impact}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
              <Quote className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 font-semibold text-sm">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Poppins']">
              What People <span className="text-[#8D6E63]">Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from our community members
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#9CCC65] rounded-full p-2">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg italic mb-6">"{testimonials[activeTestimonial].content}"</p>
                <img 
                  src={testimonials[activeTestimonial].avatar} 
                  alt={testimonials[activeTestimonial].name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-4 border-[#9CCC65]"
                />
                <h4 className="font-bold text-gray-800">{testimonials[activeTestimonial].name}</h4>
                <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
              </div>
              
              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === activeTestimonial ? 'w-8 bg-[#9CCC65]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9CCC65] to-[#8db854]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-10" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Users className="w-12 h-12 text-white animate-bounce" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Poppins']">
              Become a Volunteer Today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join us in our mission to eliminate hunger. Food donation for needy people is a great work.
              Anyone interested can fill the form and help us in our campaign.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/volunteer" 
                className="inline-flex items-center gap-2 bg-white text-[#9CCC65] px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 hover:shadow-white/30"
              >
                Become Volunteer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/learn-more"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
              >
                Learn More
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Donor CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8D6E63] to-[#6E554D]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-10" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Heart className="w-12 h-12 text-[#9CCC65] animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Poppins']">
              Become a Donor Today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Donating to the needy is a great way to improve conditions in your community.
              It helps counter poverty and hunger while building harmony.
            </p>
            <Link 
              to="/donate" 
              className="inline-flex items-center gap-2 bg-white text-[#8D6E63] px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 hover:shadow-white/30"
            >
              Donate NOW
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-2 mb-4">
              <Handshake className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-600 font-semibold text-sm">Our Network</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-['Poppins']">
              Our <span className="text-[#8D6E63]">Partners</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Together with our amazing partners, we're creating a hunger-free world
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 cursor-pointer scroll-animate"
                  id={`partner-${index}`}
                  style={{
                    opacity: isVisible[`partner-${index}`] ? 1 : 0,
                    transform: isVisible[`partner-${index}`] ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.6s ease-out ${index * 0.05}s`
                  }}
                >
                  <div className={`inline-flex p-3 bg-gradient-to-r ${partner.color} rounded-xl mb-3 group-hover:scale-110 transition-all duration-300 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-800">{partner.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{partner.count}+ partners</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-28 bg-[#4E4E4E] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-7xl text-[#9CCC65] mb-6 opacity-50">"</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-['Georgia'] leading-relaxed">
              If you want to eliminate hunger, everybody has to be involved.
            </h2>
            <p className="text-xl text-[#9CCC65] font-semibold">- Bono</p>
            <div className="mt-8 flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for updates on our impact and how you can help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#9CCC65] focus:ring-2 focus:ring-[#9CCC65]/20"
              />
              <button className="bg-[#9CCC65] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-[#8db854] transition-all transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
              <Mail className="w-4 h-4 text-[#9CCC65]" />
              <span className="text-[#9CCC65] font-semibold text-sm">Get in Touch</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Poppins']">
              Have <span className="text-[#9CCC65]">Questions?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We'd love to hear from you. Reach out to us anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <div className="inline-flex p-4 bg-gradient-to-r from-[#8D6E63] to-[#6E554D] rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold mb-1">+91 7400100112</p>
              <p className="text-gray-400">Phone</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <div className="inline-flex p-4 bg-gradient-to-r from-[#8D6E63] to-[#6E554D] rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <p className="text-xl font-bold mb-1">Food Dior</p>
              <p className="text-gray-400">Address</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
              <div className="inline-flex p-4 bg-gradient-to-r from-[#8D6E63] to-[#6E554D] rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-bold mb-1">Fooddior@gmail.com</p>
              <p className="text-gray-400">Email</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scroll {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(10px); }
          50% { transform: translateY(20px) translateX(-10px); }
          75% { transform: translateY(-5px) translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }

        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
        }
      `}</style>
    </div>
  );
}

// Note: Import Camera from lucide-react
import { Camera } from 'lucide-react';