import React from "react";
import { translations } from "./translations";
import type { Lang, TKey } from "./translations";

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("EN");

  const t = React.useCallback(
    (key: TKey) => translations[lang]?.[key] ?? translations.EN[key] ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18nContext() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18nContext must be used within I18nProvider");
  return ctx;
}
