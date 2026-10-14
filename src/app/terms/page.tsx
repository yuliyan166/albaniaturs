import Link from 'next/link';
import { Scroll } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Scroll className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Obchodní podmínky</h1>
          </div>
          
          <div className="prose prose-lg text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Úvodní ustanovení</h2>
              <p>
                Tyto obchodní podmínky upravují využívání platformy AlbaniaTours (dále jen „Platforma“) 
                a služeb poskytovaných prostřednictvím této Platformy.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definice</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Platforma:</strong> Webové stránky a aplikace pod doménou albania-turs.com</li>
                <li><strong>Partner:</strong>Poskytovatel ubytování, převodů nebo výletů připojený k Platformě</li>
                <li><strong>Uživatel:</strong> Každý návštěvník Platformy, který vykonává rezervaci nebo komunikaci s Partnery</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Přijetí podmínek</h2>
              <p>
                Používáním Platformy uživatel bezpodmínečně souhlasí s těmito obchodními podmínkami. 
                V případě nevyhovujících ustanovení je uživatel povinen ukončit používání Platformy.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4.Registration and Account</h2>
              <p>
                Pro vytvoření účtu je nutné poskytnout pravdivé a úplné informace. 
                Uživatel je povinen udržovat přesnost údajů a chránit přístup ke svému účtu.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Oblast použití</h2>
              <p>
                Platforma slouží jako propojovací prostředek mezi uživateli a Partnery. 
                AlbaniaTours nevykonává kontrolu nad kvalitou služeb poskytovaných Partnery.
              </p>
            </section>
            
            <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">Důležité ustanovení o odpovědnosti</h3>
              <p className="font-medium text-yellow-900">
                AlbaniaTours působí výhradně jako prostředník (platforma) mezi zákazníky a partnery. 
                Partneři nesou plnou odpovědnost za poskytování služeb, jejich kvalitu, bezpečnost a soulad s právními předpisy. 
                AlbaniaTours není stranou smluv mezi zákazníky a partnery a neočekává se žádná účast na výkonu těchto služeb.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Rezervační proces</h2>
              <p>
                Rezervace se provádí prostřednictvím online formuláře. Zákazník je povinen zkontrolovat 
                údaje před potvrzením. AlbaniaTours nezajišťuje přímou účast na výkonu rezervované služby.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Platební podmínky</h2>
              <p>
                Platební podmínky jsou stanoveny jednotlivými partnery. AlbaniaTours zprostředkovává 
                platební transakce, ale není zodpovědná za platební schopnost Partnů.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Ochrana osobních údajů</h2>
              <p>
                Zpracování osobních údajů je řízeno samostatnou Zásadou ochrany osobních údajů (GDPR), 
                která je součástí těchto obchodních podmínek.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Úpravy podmínek</h2>
              <p>
                AlbaniaTours si vyhrazuje právo kdykoli změnit tyto obchodní podmínky. Změny vstupují v platnost 
                dnem jejich zveřejnění na Platformě.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Poslední ustanovení</h2>
              <p>
                Tyto obchodní podmínky vstupují v platnost dnem zveřejnění na Platformě a jsou vYTVOŘENY v českém jazyce.
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
