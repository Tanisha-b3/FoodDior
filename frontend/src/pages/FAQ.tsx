import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, ChevronDown, ChevronUp, Gift, Heart, Clock, MapPin } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does Food Doer work?",
      answer: "Food Doer connects donors who have surplus food with those who need it. Donors can list available food, and receivers can request it. Our volunteers help with pickup and delivery to ensure food reaches those in need."
    },
    {
      question: "Who can use Food Doer?",
      answer: "Anyone can join as a Donor, Receiver, or Volunteer. Donors are typically restaurants, households, or food businesses with surplus food. Receivers are individuals or organizations in need. Volunteers help with pickups and deliveries."
    },
    {
      question: "Is it free to use Food Doer?",
      answer: "Yes, Food Doer is completely free for all users. Our mission is to reduce food waste and hunger, so we don't charge any fees for using our platform."
    },
    {
      question: "What types of food can be donated?",
      answer: "You can donate cooked food, packaged food, fruits, vegetables, and other consumable items. All food must be safe for consumption and properly packaged."
    },
    {
      question: "How do I become a volunteer?",
      answer: "Simply sign up, select 'Volunteer' as your role, and start helping with deliveries in your area. You'll receive notifications when pickups are available near you."
    },
    {
      question: "How are donations delivered?",
      answer: "Volunteers pick up donations from donors and deliver them to receivers. The entire process is coordinated through our platform to ensure efficiency and safety."
    },
    {
      question: "What if I have dietary restrictions?",
      answer: "When requesting food, you can specify your dietary preferences. Donors list food types (VEG, NON-VEG) so receivers can make informed choices."
    },
    {
      question: "How can I contact support?",
      answer: "You can reach us through the Contact page on our website, or email us at support@fooddoer.com. We're available Mon-Sat, 9AM - 8PM."
    }
  ];

  const categories = [
    { icon: Gift, label: 'Donating', count: 12 },
    { icon: Heart, label: 'Receiving', count: 8 },
    { icon: Clock, label: 'Delivery', count: 5 },
    { icon: MapPin, label: 'Locations', count: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-500">Find answers to common questions about Food Doer</p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((cat) => (
            <div key={cat.label} className="bg-white rounded-xl p-4 border border-stone-100 shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
              <cat.icon className="w-8 h-8 text-[#8D6E63] mx-auto mb-2" />
              <p className="font-medium text-stone-800">{cat.label}</p>
              <p className="text-sm text-stone-500">{cat.count} questions</p>
            </div>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl border border-stone-100 shadow-md overflow-hidden transition-all ${
                openIndex === index ? 'ring-2 ring-[#9CCC65]' : ''
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#8D6E63]" />
                  <span className="font-medium text-stone-800">{faq.question}</span>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-stone-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pl-14 text-stone-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-[#8D6E63]/10 to-[#6E554D]/10 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-xl text-stone-800 mb-2">Still have questions?</h3>
          <p className="text-stone-600 mb-4">Can't find what you're looking for? Our team is here to help.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8D6E63] to-[#6E554D] text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}