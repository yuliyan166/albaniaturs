import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">GDPR / Politika pro zpracování osobních údajů</h1>
          </div>
          
          <div className="prose prose-lg text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Úvod</h2>
              <p>
                S cílem chránit Vaše soukromí zajistila AlbaniaTours (dále jen „ správce“) toto prohlášení 
                o ochraně osobních údajů (dále jen „Zásada“), které vysvětluje, jak shromažďujeme, používáme, 
                sdílíme a chráníme Vaše osobní údaje při používání naší platformy.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Správce osobních údajů</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Správce:</strong> AlbaniaTours</li>
                <li><strong>Kontakt:</strong> contact@albania-turs.com</li>
                <li><strong>Adresa:</strong> Tirana, Albania</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Shromažďované údaje</h2>
              <p>Zpracováváme následující osobní údaje:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kontaktní údaje (jméno, e-mail, telefon)</li>
                <li>Údaje o rezervacích (typ služby, datum, údaje cestujících)</li>
                <li>Platební údaje (zpracovávány přes zabezpečené platformy Stripe)</li>
                <li>IP adresu a technické údaje o zařízení</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Účel zpracování</h2>
              <p>Osobní údaje zpracováváme pro následující účely:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pro zajištění rezervačních služeb</li>
                <li>Pro komunikaci s uživateli</li>
                <li>Pro zajištění bezpečnosti platformy</li>
                <li>Pro statistické účely a vylepšení služeb</li>
                <li>Pro plnění právních povinností</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Zásady zpracování</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Legitimní zájem:</strong> Výkon smluvních vztahů a poskytování Služeb</li>
                <li><strong>Souhlas uživatele:</strong> Pro marketingové účely a newsletter</li>
                <li><strong>Právní povinnost:</strong> Splnění daňových a účetních povinností</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Doba uchovávání údajů</h2>
              <p>
                Osobní údaje uchováváme po dobu nezbytnou pro plnění smluvních vztahů a vyhovění právním povinnostem. 
                Po vypršení doby uchovávání jsou údaje bezpečně zničeny nebo anonymizovány.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Práva uživatelů</h2>
              <p>Máte následující práva:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Přístup:</strong> Právo získat kopii svých osobních údajů</li>
                <li><strong>Oprava:</strong> Právo na opravu nepřesných osobních údajů</li>
                <li><strong>Smazání:</strong> Právo na smazání svých osobních údajů</li>
                <li><strong>Omezení:</strong> Právo na omezení zpracování</li>
                <li><strong>Přenositelnost:</strong> Právo přenést své údaje do jiného poskytovatele</li>
                <li><strong>Odvolání:</strong> Právo kdykoli odvolat svůj souhlas</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Předávání údajů třetím stranám</h2>
              <p>
                VAŠE osobní údaje nepředáváme třetím stranám bez Vašeho výslovného souhlasu, s výjimkou:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Partnerům pro výkon služeb (pouze minimum údajů potřebných ke splnění rezervace)</li>
                <li>Platebních branžových společností pro zpracování plateb</li>
                <li>Úřadům na základě právní povinnosti</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Bezpečnost údajů</h2>
              <p>
                Používáme technická a organizační opatření pro ochranu Vašich osobních údajů před neoprávněným přístupem, 
                ztrátou, změnou nebo zničením. Platební údaje jsou zpracovávány přes šifrované rozhraní Stripe.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Změny zásady</h2>
              <p>
                Tuto Zásadu můžeme kdykoli aktualizovat. Poslední změny budou zveřejněny na této stránce s uvedením data.
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
