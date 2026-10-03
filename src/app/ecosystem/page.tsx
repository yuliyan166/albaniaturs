'use client';

import React from 'react';
import { useLanguage } from '@/app/providers/LanguageContext';
import { Blockchain, Brain, ShieldCheck, Gem, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function EcosystemPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-6">
            <Blockchain size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Our Digital Ecosystem</h1>
          <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
            {t?.common?.detail || 'The Future of Travel: Our Digital Ecosystem'}
          </p>
        </div>

        {/* RWA Explanation */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-12 md:p-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-8">
              <ShieldCheck size={40} className="text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Real World Asset (RWA) Integration
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our internal stable-credit system ensures price predictability and operational transparency, acting as the
              digital backbone of the Albania Tours network.
            </p>
          </div>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              icon: ShieldCheck,
              title: t?.auth?.successRegister || 'Security & Transparency',
              description: '1:1 stability across all utility token transactions for absolute trust.'
            },
            {
              icon: Gem,
              title: t?.common?.detail || 'Exclusive Client Access',
              description: 'Curated holiday packages and loyalty rewards delivered seamlessly via closed-loop credits.'
            },
            {
              icon: Brain,
              title: t?.common?.detail || 'AI-Driven Automation',
              description: 'Future AI agents enabling autonomous booking, settlement, and personalized travel experiences.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
                <item.icon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Core Features */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-10 border border-blue-100 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8">
            {t?.partner?.addListingSubtitle || 'Closed-Loop Economy in Action'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-3">
                <CheckCircle2 size={24} className="text-red-500" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Internal Efficiency</h4>
              <p className="text-sm text-gray-600">Streamlined payments for strategic partners and staff.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
                <Gem size={24} className="text-purple-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Client Rewards</h4>
              <p className="text-sm text-gray-600">Exclusive credits for curated holiday packages.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-3">
                <Brain size={24} className="text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">AI-Driven Experience</h4>
              <p className="text-sm text-gray-600">Future integration of AI agents for autonomous booking and settlement.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <span className="text-lg font-semibold text-red-600 inline-flex items-center gap-2">
            Explore Our Ecosystem
            <ArrowRight size={20} />
          </span>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            {t?.common?.detail || 'Experience the seamless digital backbone powering Albania Tours.'}
          </p>
        </div>
      </section>
    </div>
  );
}
