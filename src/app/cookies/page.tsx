import Link from 'next/link';
import { Cookie } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Cookie className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Politika pro používání souborů cookie</h1>
          </div>
          
          <div className="prose prose-lg text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Co jsou cookies?</h2>
              <p>
                Cookies jsou malé textové soubory, které jsou ukládány do Vašeho prohlížeče při návštěvě webových stránek. 
                Tyto soubory pomáhají stránkám fungovat efektivně a zaznamenávají informace o Vašem návštěvníkovi.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Jak používáme cookies?</h2>
              <p>
                Používáme různé typy cookies pro různé účely:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Nutné cookies:</strong> Pro základní funkce stránek (přihlášení, košík)</li>
                <li><strong>Analytics cookies:</strong> Pro analýzu návštěvnosti a vylepšení stránek</li>
                <li><strong>Marketing cookies:</strong> Pro personalizaci reklam a sledování kampaní</li>
                <li><strong>Functionality cookies:</strong> Pro zapamatování Vašich preferencí (jazyk, měna)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Používané typy cookies</h2>
              <p>
                <strong>Relativní cookies:</strong> Tyto soubory jsou odesílány Vámi a zpracovány v době prohlížení stránek.
                <br/>
                <strong>Trvalé cookies:</strong> Tyto soubory zůstávají v Vašem prohlížeči po zavření a jsou používány 
                při opakované návštěvě stránek.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Správa cookies</h2>
              <p>
                Můžete se rozhodnout, že nebudete přijímat cookies, tím ale můžete omezit funkčnost naší platformy. 
                Nastavení cookies můžete změnit v nastavení Vašeho prohlížeče.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Třetí strany</h2>
              <p>
                Naše platforma může obsahovat obsah od třetích stran (např. YouTube videa, sociální sítě), 
                které mohou používat vlastní cookies. Tato politika se nevztahuje na tyto třetí strany.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Změny politiky</h2>
              <p>
                Tuto politiku můžeme kdykoli aktualizovat. Změny vstupují v platnost dnem jejich zveřejnění na této stránce.
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
