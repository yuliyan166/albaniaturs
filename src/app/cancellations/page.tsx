import Link from 'next/link';
import { FileX } from 'lucide-react';

export default function CancellationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <FileX className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Odnávňování a rušení</h1>
          </div>
          
          <div className="prose prose-lg text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Obecná pravidla</h2>
              <p>
                Pravidla pro odhalování a zrušení rezervací se liší podle typu služby a individuálních podmínek 
                zvolených Partnem. Tato stránka obsahuje obecné směrnice platné pro všechny služby.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Rezervační okno pro bezplatné zrušení</h2>
              <p>
                Většina služeb umožňuje bezplatné zrušení do 24 hodin před plánovaným startem služby. 
                To platí pro všechny kategorie: ubytování, převod, výlety a auta.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Zrušení ubytování</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Standardní podmínky:</strong> Bezplatné zrušení do 24 hodin před příjezdem</li>
                <li><strong>Premium podmínky:</strong> 48 hodin před příjezdem s vracením 100%</li>
                <li><strong>Nevrátitelné slevy:</strong> Zrušení není možné po potvrzení rezervace</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Zrušení převodu</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Standartní:</strong> Do 2 hodin před plánovaným příjezdem</li>
                <li><strong>Nocní služby:</strong> Minimálně 12 hodin dopředu</li>
                <li><strong>Nedostupnost:</strong> Pokud nejsou změny provedeny včas, platí 100% poplatek</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Zrušení výletů</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Standardní:</strong> 48 hodin před výletem</li>
                <li><strong>Individuální turné:</strong> Minimálně 72 hodin dopředu</li>
                <li><strong>Skupinové zájezdy:</strong> Pravidla se liší podle kapacity</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Postup zrušení</h2>
              <p>
                Pro zrušení rezervace:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Přihlaste se do svého profilu</li>
                <li>Najděte svou rezervaci v sekci "Moje rezervace"</li>
                <li>Klikněte na "Zrušit" pro danou rezervaci</li>
                <li>Potvrďte zrušení a zkontrolujte e-mail s potvrzením</li>
              </ol>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Vrácení peněz</h2>
              <p>
                Vrácení peněz se provádí na původní způsob platby do 5-10 pracovních dní po schválení zrušení. 
                Platforma si vyhrazuje právo účtovat administrativní poplatek ve výši 5% z vrácené částky.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Výše poplatků za zrušení</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Do 24 hodin：</strong> 100% poplatek celé ceny</li>
                <li><strong>24-48 hodin：</strong> 50% poplatek z ceny</li>
                <li><strong>Po 48 hodin：</strong> 10% administrativní poplatek</li>
              </ul>
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
