import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Eye, Database, Mail } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            Privacy Policy
          </h1>
          <p className="text-stone-500">Last updated: April 2024</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-md space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">Introduction</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              At Food Doer, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">Information We Collect</h2>
            </div>
            <ul className="text-stone-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>Personal identification information (name, email, phone number)</li>
              <li>Profile information (role, preferences)</li>
              <li>Food donation and request details</li>
              <li>Location data for delivery purposes</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">How We Protect Your Information</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted using industry-standard protocols.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">Information Sharing</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with trusted third parties who assist us in operating our platform, provided they agree to keep this information confidential.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">Contact Us</h2>
            </div>
            <p className="text-stone-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@fooddoer.com or visit our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}