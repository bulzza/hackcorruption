import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    lng: "en",            // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes
    },
    resources: {
      en: {
        translation: {
          hero_title: "Judiciary Intelligence Platform",
          btn_get_insights: "Get Insights",
        },
      },
      mk: {
        translation: {
          hero_title: "Платформа за судска интелигенција",
          btn_get_insights: "Види анализи",
        },
      },
      al: {
        translation: {
          hero_title: "Platformë Inteligjence Gjyqësore",
          btn_get_insights: "Shiko analiza",
        },
      },
    },
  });

export default i18n;
