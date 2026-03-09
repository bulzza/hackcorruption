export type Lang = "EN" | "MK" | "AL";
export type TKey =
  | "nav_about"
  | "nav_data"
  | "nav_dashboard"
  | "nav_research"
  | "nav_contact"
  | "nav_login"
  | "hero_title"
  | "btn_get_insights"
  | "mission_title"
  | "mission_desc"
  | "feature_search_title"
  | "feature_search_desc"
  | "feature_ai_title"
  | "feature_ai_desc"
  | "feature_reporting_title"
  | "feature_reporting_desc"
  | "partners_label"
  | "newsletter_title"
  | "newsletter_desc"
  | "newsletter_placeholder"
  | "newsletter_btn"
  | "footer_rights";

export const translations: Record<Lang, Record<TKey, string>> = {
  EN: {
    nav_about: "About",
    nav_data: "Data",
    nav_dashboard: "Dashboard",
    nav_research: "Research",
    nav_contact: "Contact",
    nav_login: "Login",
    hero_title: "Judiciary Intelligence Platform",
    btn_get_insights: "Get Insights",
    mission_title: "Empowering justice\nthrough intelligent\ninsights.",
    mission_desc:
      "By embracing innovation, we are not only advancing legal decision-making but also reducing reliance on outdated systems, fostering fairness, and ensuring that justice is both efficient and equitable.",
    feature_search_title: "Advanced Search Options",
    feature_search_desc:
      "Provides cutting-edge advanced search options that allow users to pinpoint relevant cases, statutes, and legal precedents with unmatched precision. With filters, keywords, and contextual analysis, users can efficiently navigate vast legal databases to find exactly what they need in seconds",
    feature_ai_title: "AI-Driven Insights",
    feature_ai_desc:
      "Leverage the power of AI-driven legal insights to uncover patterns, predict outcomes, and gain a deeper understanding of legal contexts. The Judiciary Intelligence Platform analyzes complex data sets to deliver actionable insights, empowering professionals to make data-backed decisions with confidence.",
    feature_reporting_title: "Tailored Reporting Tools",
    feature_reporting_desc:
      "Create customized, professional-grade reports with the Judiciary Intelligence Platform's tailored reporting tools. These reports integrate insights from searches and analytics, presenting the information in a clear, actionable format designed to meet the specific needs of legal professionals and organizations.",
    partners_label: "OUR PARTNERS",
    newsletter_title: "Subscribe to our newsletter",
    newsletter_desc: "Stay updated with the latest legal data insights.",
    newsletter_placeholder: "Enter your email",
    newsletter_btn: "Subscribe",
    footer_rights: "© 2025 JusticiaAI. All rights reserved.",
  },

  MK: {
    nav_about: "За нас",
    nav_data: "Податоци",
    nav_dashboard: "Dashboard",
    nav_research: "Истражување",
    nav_contact: "Контакт",
    nav_login: "Најава",
    hero_title: "Платформа за судска интелигенција",
    btn_get_insights: "Види анализи",
    mission_title: "Зајакнување на правдата\nпреку интелигентни\nувиди.",
    mission_desc:
      "Со прифаќање на иновациите, ја унапредуваме правната одлука, ја намалуваме зависноста од застарени системи и обезбедуваме правдата да биде ефикасна и правична.",
    feature_search_title: "Напредно пребарување",
    feature_search_desc:
      "Напредни опции за пребарување со филтри, клучни зборови и контекстуална анализа за брзо пронаоѓање релевантни предмети и преседани.",
    feature_ai_title: "AI-увиди",
    feature_ai_desc:
      "AI анализа за откривање обрасци, предвидување исходи и подобро разбирање на контекстот за сигурни одлуки.",
    feature_reporting_title: "Извештаи по мерка",
    feature_reporting_desc:
      "Професионални извештаи кои ги интегрираат пребарувањата и аналитиката во јасен и употреблив формат.",
    partners_label: "НАШИ ПАРТНЕРИ",
    newsletter_title: "Претплати се на билтен",
    newsletter_desc: "Биди во тек со најновите увид и податоци.",
    newsletter_placeholder: "Внеси е-пошта",
    newsletter_btn: "Претплати се",
    footer_rights: "© 2025 JusticiaAI. Сите права задржани.",
  },

  AL: {
    nav_about: "Rreth",
    nav_data: "Të dhëna",
    nav_dashboard: "Dashboard",
    nav_research: "Kërkim",
    nav_contact: "Kontakt",
    nav_login: "Hyrje",
    hero_title: "Platformë Inteligjence Gjyqësore",
    btn_get_insights: "Shiko analiza",
    mission_title: "Fuqizimi i drejtësisë\npërmes\nnjohurive inteligjente.",
    mission_desc:
      "Duke përqafuar inovacionin, ne avancojmë vendimmarrjen ligjore, ulim varësinë nga sistemet e vjetra dhe sigurojmë drejtësi më efikase dhe të drejtë.",
    feature_search_title: "Kërkim i avancuar",
    feature_search_desc:
      "Opsione të avancuara kërkimi me filtra, fjalë kyçe dhe analizë kontekstuale për të gjetur rastet dhe precedentët më të rëndësishëm shpejt.",
    feature_ai_title: "Njohuri me AI",
    feature_ai_desc:
      "Analizë me AI për të zbuluar modele, parashikuar rezultate dhe kuptuar më mirë kontekstin për vendime të sigurta.",
    feature_reporting_title: "Raporte të personalizuara",
    feature_reporting_desc:
      "Raporte profesionale që kombinojnë kërkimin dhe analitikën në një format të qartë dhe të përdorshëm.",
    partners_label: "PARTNERËT TANË",
    newsletter_title: "Abonohu në newsletter",
    newsletter_desc: "Qëndro i përditësuar me njohuritë më të reja ligjore.",
    newsletter_placeholder: "Shkruaj email-in",
    newsletter_btn: "Abonohu",
    footer_rights: "© 2025 JusticiaAI. Të gjitha të drejtat e rezervuara.",
  },
};
