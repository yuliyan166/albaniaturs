import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PartnerAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Smlouva o partnerství</h1>
          </div>
          
          <div className="prose prose-lg text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Úvod</h2>
              <p>
                Tato Smlouva o partnerství (dále jen „Smlouva“) vzniká mezi AlbaniaTours (dále jen „Platforma“) 
                a jednotlivýmiPartnery (dále jen „Partner“), kteří poskytují služby přes Platformu.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Předmět smlouvy</h2>
              <p>
                Partner se zavazuje poskytovat služby v oblasti ubytování, převodů nebo výletů prostřednictvím 
                Platformy. Platforma zajišťuje technické zázemí, platební infrastrukturu a marketingovou podporu.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Práva a povinnosti Party</h2>
              <p>
                <strong>Partner povinnosti:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Poskytovat přesné a aktuální informace o svých službách</li>
                <li>Zajistit kvalitu a bezpečnost poskytovaných služeb</li>
                <li>Plnit smluvní povinnosti vůči zákazníkům</li>
                <li>Zachovávat důvěrnost všech obchodních údajů</li>
              </ul>
              
              <p className="mt-4">
                <strong>Platforma povinnosti:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Zajišťovat funkčnost online platformy</li>
                <li>Zpracovávat platby za služby</li>
                <li>Prodej a marketing služeb Partnera</li>
                <li>Poskytovat technickou podporu</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Komise a úhrady</h2>
              <p>
                Za poskytnutí služeb získává Partner komisi podle aktuálního sazebníku Platformy. 
                Komise se odečítá z celkové částky proplácené zákazníkem. Detailní podmínky jsou uvedeny 
                v samostatném doplňkovém dopise.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Výloha odpovědnosti</h2>
              <p>
                Partner nese plnou odpovědnost za kvalitu, bezpečnost a legálnost svých služeb. 
                Platforma není stranou smluv mezi Partnerem a jeho zákazníky a není zodpovědná za 
                škody vzniklé v důsledku provádění služeb Partnerem.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Ochranná známka</h2>
              <p>
                Partner nesmí používat ochranné známky Platformy bez písemného souhlasu. Po ukončení 
                smlouvy je povinen okamžitě přestat používat veškeré brandingové prvky Platformy.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Doba trvání a ukončení</h2>
              <p>
                Smlouva vstupuje v platnost dnem podepsání a trvá po dobu 12 měsíců, s možností prodloužení. 
                Každá ze stran může smluvní poměr ukončit písemnou oznámením s tříměsíční lhůtou.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Závěrečná ustanovení</h2>
              <p>
                Za všechny spory vyplývající z této Smlouvy je příslušným soudem soud v Tirana, Albánie. 
                Tato Smlouva je vypracována v albánském a anglickém jazyce a oba texty mají stejnou platnost.
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
