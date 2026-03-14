export type Lang = "EN" | "MK" | "AL";
export type TKey =
  | "nav_about"
  | "nav_data"
  | "expertise_title"
  | "hero_eyebrow"
  | "expertise_1_title"
  | "expertise_1_desc"
  | "expertise_2_title"
  | "expertise_2_desc"
  | "expertise_3_title"
  | "expertise_3_desc"
  | "expertise_4_title"
  | "expertise_4_desc"
  | "expertise_5_title"
  | "expertise_5_desc"
  | "expertise_6_title"
  | "expertise_6_desc"
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
    hero_eyebrow: "Judiciary Intelligence Platform",
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

    expertise_title: "Areas of Expertise",
    expertise_1_title: "Case Documentation",
    expertise_1_desc:
      "Organize judicial records, filings, and legal documents in a structured and accessible way.",
    expertise_2_title: "Legal Analysis",
    expertise_2_desc:
      "Turn judicial data into clear insights that support legal interpretation and decision-making.",
    expertise_3_title: "Court Intelligence",
    expertise_3_desc:
      "Track proceedings, legal activity, and relevant patterns through a modern data-driven platform.",
    expertise_4_title: "Compliance Review",
    expertise_4_desc:
      "Support transparency and accountability with tools built for oversight and verification workflows.",
    expertise_5_title: "Institutional Oversight",
    expertise_5_desc:
      "Provide better visibility into judicial institutions, structures, and administrative legal data.",
    expertise_6_title: "Practice Support",
    expertise_6_desc:
      "Help legal professionals work faster with organized information, clean dashboards, and smart insights.",
  },

  MK: {
    nav_about: "За нас",
    nav_data: "Податоци",
    nav_dashboard: "Dashboard",
    nav_research: "Истражување",
    nav_contact: "Контакт",
    nav_login: "Најава",
    hero_title: "Платформа за судска интелигенција",
    hero_eyebrow: "Платформа за судска интелигенција",
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

    expertise_title: "Области на експертиза",
    expertise_1_title: "Документација на предмети",
    expertise_1_desc:
      "Организирај судски записи, поднесоци и правни документи на структуриран и достапен начин.",
    expertise_2_title: "Правна анализа",
    expertise_2_desc:
      "Претвори ги судските податоци во јасни увиди што поддржуваат правно толкување и одлучување.",
    expertise_3_title: "Судска интелигенција",
    expertise_3_desc:
      "Следи постапки, правна активност и важни обрасци преку современа платформа базирана на податоци.",
    expertise_4_title: "Проверка на усогласеност",
    expertise_4_desc:
      "Поддржи транспарентност и отчетност со алатки за надзор и процеси на верификација.",
    expertise_5_title: "Институционален надзор",
    expertise_5_desc:
      "Овозможи подобар увид во судските институции, структури и административни правни податоци.",
    expertise_6_title: "Поддршка за пракса",
    expertise_6_desc:
      "Помогни им на правните професионалци да работат побрзо со организирани информации и паметни увиди.",
  },

  AL: {
    nav_about: "Rreth",
    nav_data: "Të dhëna",
    nav_dashboard: "Dashboard",
    hero_eyebrow: "Platformë Inteligjence Gjyqësore",
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

    expertise_title: "Fushat e ekspertizës",
    expertise_1_title: "Dokumentimi i rasteve",
    expertise_1_desc:
      "Organizo të dhënat gjyqësore, parashtresat dhe dokumentet ligjore në mënyrë të strukturuar dhe të qasshme.",
    expertise_2_title: "Analizë ligjore",
    expertise_2_desc:
      "Shndërro të dhënat gjyqësore në njohuri të qarta që mbështesin interpretimin dhe vendimmarrjen ligjore.",
    expertise_3_title: "Inteligjencë gjyqësore",
    expertise_3_desc:
      "Ndjek procedurat, aktivitetin ligjor dhe modelet e rëndësishme përmes një platforme moderne të bazuar në të dhëna.",
    expertise_4_title: "Rishikim i pajtueshmërisë",
    expertise_4_desc:
      "Mbështet transparencën dhe llogaridhënien me mjete të ndërtuara për mbikëqyrje dhe verifikim.",
    expertise_5_title: "Mbikëqyrje institucionale",
    expertise_5_desc:
      "Ofron pamje më të qartë mbi institucionet gjyqësore, strukturat dhe të dhënat administrative ligjore.",
    expertise_6_title: "Mbështetje për praktikën",
    expertise_6_desc:
      "Ndihmo profesionistët ligjorë të punojnë më shpejt me informacion të organizuar dhe njohuri inteligjente.",
  },
};