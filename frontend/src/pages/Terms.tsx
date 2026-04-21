import { Link } from 'react-router-dom';
import {  ArrowLeft, Scale, Heart, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            Terms of Service
          </h1>
          <p className="text-stone-500">Last updated: April 2024</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-md space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">Acceptance of Terms</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              By accessing and using Food Doer, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">Use License</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-3">
              Permission is granted to use Food Doer for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
            </p>
            <ul className="text-stone-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>You may not modify or copy the materials</li>
              <li>You may not use the materials for any commercial purpose</li>
              <li>You must not transfer the materials to another person</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">Donation Guidelines</h2>
            </div>
            <p className="text-stone-600 leading-relaxed mb-3">
              When donating food through our platform, you agree to:
            </p>
            <ul className="text-stone-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>Provide accurate and complete information about the food</li>
              <li>Ensure food is safe for consumption</li>
              <li>Package food properly for transport</li>
              <li>Be available for pickup at the agreed time</li>
              <li>Not donate expired or adulterated food</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">Disclaimer</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              The materials on Food Doer are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl text-stone-800 mb-4">Contact Information</h2>
            <p className="text-stone-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}