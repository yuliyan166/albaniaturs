'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/app/providers/LanguageContext';
import { translations } from '@/lib/translations';

export type SectorType = 'accommodation' | 'car_rental' | 'tours' | 'transfers';

interface SectorAgreement {
  title: string;
  description: string;
}

const SECTOR_AGREEMENTS: Record<SectorType, SectorAgreement> = {
  accommodation: {
    title: 'Smlouva o ubytování',
    description: 'Zde je text specifických podmínekpro ubytování. Tato sekce bude obsahovat detaily o kvalitě služeb, čistících poplatcích, kapacitě atd.'
  },
  car_rental: {
    title: 'Smlouva o půjčovně aut',
    description: 'Zde je text specifických podmínek pro půjčovny aut. Tato sekce bude obsahovat detaily o ručení, pojištění, palivové politice atd.'
  },
  tours: {
    title: 'Smlouva o výletech',
    description: 'Zde je text specifických podmínek pro výlety. Tato sekce bude obsahovat detaily o trasách, bezpečnosti, kapacitě atd.'
  },
  transfers: {
    title: 'Smlouva o transferech',
    description: 'Zde je text specifických podmínek pro transfery. Tato sekce bude obsahovat detaily o trasách, čase, vozidlech atd.'
  }
};

const REQUIRED_AGREEMENTS = [
  { id: 'terms', label: 'Obchodní podmínky', url: '/terms' },
  { id: 'privacy', label: 'GDPR / Zásada ochrany osobních údajů', url: '/gdpr' },
  { id: 'partner', label: 'Smlouva o partnerství', url: '/partner-agreement' }
];

export default function PartnerRegisterPage() {
  const { t, language } = useLanguage();
  const tTrans = translations[language as keyof typeof translations] || translations.en;
  
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    vatNumber: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    contactPerson: '',
    iban: '',
    bankName: '',
    businessType: '' as SectorType | ''
  });
  
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    partner: false,
    sector: false,
    accuracy: false
  });
  
  const [selectedSector, setSelectedSector] = useState<SectorType | ''>('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAgreementChange = (id: keyof typeof agreements, checked: boolean) => {
    setAgreements(prev => ({ ...prev, [id]: checked }));
  };
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate all required agreements
    if (!agreements.terms || !agreements.privacy || !agreements.partner || !agreements.sector || !agreements.accuracy) {
      setError('Prosím, přečtěte si a potvrďte všechny povinné dokumenty a deklarace.');
      setLoading(false);
      return;
    }
    
    // Validate sector selection
    if (!selectedSector) {
      setError('Prosím, vyberte svou obchodní činnost.');
      setLoading(false);
      return;
    }
    
    try {
      // Create the user account in Supabase Auth first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'Partner123!', // In production, generate secure password or let user set it
      });
  
      if (authError) {
        if (authError.message?.toLowerCase().includes('already registered') || 
            authError.message?.toLowerCase().includes('user already')) {
          setError(`Účet s tímto e-mailem (${formData.email}) je již zaregistrován. Prosím,zkuste se přihlásit.`);
          setLoading(false);
          return;
        }
        throw new Error(authError.message);
      }
  
      if (authData.user) {
        // Get user IP address (in production, get this from server-side)
        const userIP = '192.168.1.1'; // Placeholder - would come from request headers
        
        // Insert a profile record flagged as 'partner' with status 'pending'
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: formData.companyName,
          phone: formData.phone,
          business_type: selectedSector,
          role: 'partner',
          status: 'pending'
        });
  
        if (profileError) throw new Error(profileError.message);
        
        // Insert audit trail record
        const { error: auditError } = await supabase.from('audit_trails').insert({
          user_id: authData.user.id,
          action: 'partner_registration',
          details: JSON.stringify({
            companyName: formData.companyName,
            selectedSector,
            agreementsAccepted: Object.entries(agreements)
              .filter(([_, val]) => val)
              .map(([key]) => key),
            documentsUploaded: documents.length
          }),
          metadata: {
            ip_address: userIP,
            business_type: selectedSector,
            registration_data: formData
          },
          created_at: new Date().toISOString()
        });
  
        if (auditError) {
          console.error('Audit trail error:', auditError);
        }
        
        // In production, upload documents to Supabase Storage here
        
        alert('Vaše žádost o partnerství byla odeslána. Administrátor zkontroluje Vaše údaje v nejbližší době.');
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Došlo k chybě při zpracování žádosti o partnerství.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-red-600 mb-2 tracking-tight">
              {t.partner?.registerTitle || 'Registration for Partners'}
            </h1>
            <p className="text-sm text-gray-500">
              {t.partner?.addListingSubtitle || 'Apply to become a service provider on AlbaniaTours. Applications are reviewed before approval.'}
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t.partner?.basicInfo || 'Basic Information'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.common?.detail || 'Company Name'} *
                  </label>
                  <input
                    type="text" required
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.partner?.basicInfo || 'Registration Number'} *
                  </label>
                  <input
                    type="text" required
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.partner?.basicInfo || 'VAT Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.partner?.basicInfo || 'Address'} *
                  </label>
                  <input
                    type="text" required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.common?.locationTirana || 'Phone Number'} *
                  </label>
                  <input
                    type="tel" required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+355 ..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.common?.locationTirana || 'Email Address'} *
                  </label>
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="you@yourbusiness.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.common?.locationTirana || 'Website'}
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.partner?.basicInfo || 'Contact Person'} *
                  </label>
                  <input
                    type="text" required
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.partner?.basicInfo || 'IBAN'} *
                  </label>
                  <input
                    type="text" required
                    value={formData.iban}
                    onChange={(e) => handleInputChange('iban', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="AL41 ... (20 chars)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.partner?.basicInfo || 'Bank Name'} *
                  </label>
                  <input
                    type="text" required
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Business Type Selection */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t.partner?.category || 'Select your business sector'} *
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['accommodation', 'car_rental', 'tours', 'transfers'] as const).map((sector) => (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => setSelectedSector(sector)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSector === sector
                        ? 'border-blue-600 bg-blue-100 ring-2 ring-blue-600 ring-opacity-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">
                      {t.categories[sector === 'car_rental' ? 'carRental' : sector === 'accommodation' ? 'accommodation' : sector === 'tours' ? 'excusion' : 'transfer'] || sector}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {sector === 'accommodation' && 'Ubytování, apartmány, vily'}
                      {sector === 'car_rental' && 'Půjčovna aut, doprava'}
                      {sector === 'tours' && 'Výlety, turistika, exkurze'}
                      {sector === 'transfers' && 'Transfery, přeprava'}
                    </p>
                  </button>
                ))}
              </div>

              {/* Dynamic Sector Terms */}
              {selectedSector && (
                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {SECTOR_AGREEMENTS[selectedSector].title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    {SECTOR_AGREEMENTS[selectedSector].description}
                  </p>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      required
                      checked={agreements.sector}
                      onChange={(e) => handleAgreementChange('sector', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-sm">
                      Souhlasím se specifickými podmínkami pro {SECTOR_AGREEMENTS[selectedSector].title}
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t.partner?.addListingSubtitle || 'Upload Documents'} *
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Registration Certificate
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business License / Permit
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Certificate
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax clearance certificate
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Required Agreements */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t.partner?.basicInfo || 'Required Agreements'} *
              </h2>
              
              <div className="space-y-3">
                {REQUIRED_AGREEMENTS.map((agreement) => (
                  <label key={agreement.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-green-100 transition-colors">
                    <input
                      type="checkbox"
                      required
                      checked={agreements[agreement.id as keyof typeof agreements]}
                      onChange={(e) => handleAgreementChange(agreement.id as keyof typeof agreements, e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{agreement.label}</span>
                      <div className="mt-1">
                        <Link href={agreement.url} className="text-blue-600 hover:underline text-sm">
                          Read full text
                        </Link>
                      </div>
                    </div>
                  </label>
                ))}
                
                {/* Declaration */}
                <label className="flex items-start space-x-3 p-3 rounded-lg bg-white hover:bg-green-100 transition-colors">
                  <input
                    type="checkbox"
                    required
                    checked={agreements.accuracy}
                    onChange={(e) => handleAgreementChange('accuracy', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-0.5"
                  />
                  <span className="text-gray-700 text-sm">
                    Potvrzuji, že všechny uvedené informace jsou pravdivé a úplné. V případě falešného prohlášení může být účet ukončen.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Submit Partner Application'}
            </button>

            <div className="text-center pt-4 border-t border-gray-200 text-sm">
              {t.common?.locationTirana || 'Looking for a traveler account?'}{' '}
              <Link href="/register" className="text-red-600 hover:underline font-medium">
                Return to Visitor Registration
              </Link>
            </div>
          </form>

          <footer className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} AlbaniaTours Partner Program. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
