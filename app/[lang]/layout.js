import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingContactStack from '../../components/FloatingContactStack';
import DelayedPrompt from '../../components/DelayedPrompt';
import LangAttr from '../../components/LangAttr';
import { getTranslations, normalizeLang } from '../../constants/translations';

export default function LangLayout({ children, params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <LangAttr />
      <Header lang={lang} t={t} />
      <main>{children}</main>
      <Footer lang={lang} />
      <FloatingContactStack lang={lang} />
      <DelayedPrompt lang={lang} />
    </div>
  );
}

