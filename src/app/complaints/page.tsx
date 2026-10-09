import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function ComplaintsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Reklamace a podání stížností</h1>
          </div>
          
          <div className="prose prose-lg text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Úvod</h2>
              <p>
                AlbaniaTours se zavazuje k poskytování kvalitních služeb a k řešení případných reklamací 
                uživatelů včas a transparentně. Tento dokument popisuje postup podání stížnosti.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Co můžete nahlásit</h2>
              <p>Stížnost můžete podat v případě:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Změny nekvality služby oproti popisu</li>
                <li>Změny termínu nebo odložení služby</li>
                <li>Poškození osobních věcí během služby</li>
                <li>Neetického chování zaměstnanců Partnera</li>
                <li>Odlišného zpracování nebo odmítnutí rezervace</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Postup podání stížnosti</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Nejprve kontaktujte Partna:</strong> Kvalitní řešení většinou proběhne přímým 
                  kontaktem s poskytovatelem služby.
                </li>
                <li>
                  <strong>Kontaktujte AlbaniaTours:</strong> Pokud není řešení uspokojivé, kontaktujte nás 
                  na support@albania-turs.com s předmětem "Reklamace" a uveďte:
                </li>
              </ol>
              <div className="bg-gray-100 p-4 mt-3 rounded-lg">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Číslo rezervace</li>
                  <li>Datum a popis incidentu</li>
                  <li>Fotodůkazy (pokud jsou k dispozici)</li>
                  <li>Prosby o řešení</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Zpracování stížnosti</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Časový rámec:</strong> Naše tým zpracuje stížnost do 48 hodin od přijetí</li>
                <li><strong>Řešení:</strong> Může zahrnovat upozornění Partnera, vrácení peněz, nebo jiné opatření</li>
                <li><strong>Zpětná vazba:</strong> Po řešení získáte e-mail s informacemi o podniknutých opatřeních</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Záruka řešení</h2>
              <p>
                V případě závažného porušení práv uživatele AlbaniaTours zasáhne intermediálně a může 
                zastavit spolupráci s Partnem, pokud dochází opakovaně k nekvalitním službám.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Přímý kontakt</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">E-mail</h3>
                  <p className="text-blue-700">support@albania-turs.com</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Telefon</h3>
                  <p className="text-blue-700">+355 69 XXX XXXX</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Podpora je dostupná v pracovních dnech 9:00-18:00 (CET)
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Zrušení stížnosti</h2>
              <p>
                Stížnost lze kdykoli odvolat písemným e-mailem na stejné adresy. AlbaniaTours přestane 
                další vyšetřování a vrátí všechny materiály do původního stavu.
              </p>
            </section>
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
