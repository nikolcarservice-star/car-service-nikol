import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';
import FloatingCall from '../../components/FloatingCall';
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
      <FloatingCall lang={lang} />
      <FloatingWhatsApp lang={lang} />
      <DelayedPrompt lang={lang} />
    </div>
  );
}

