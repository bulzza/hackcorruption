export type ResearchCard = {
  image: string;
  typeLabel: string;
  dateLabel: string;
  title: string;
  snippet: string;
  variant?: "horizontal" | "vertical";
};

export const publications: ResearchCard[] = [
  {
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    typeLabel: "Publications",
    dateLabel: "October 30, 2025",
    title: "Berlin Process and The Way Forward",
    snippet: "Analysis of the Chair's Conclusions and impact on the Berlin Process 2025.",
    variant: "horizontal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    typeLabel: "Publications",
    dateLabel: "October 21, 2025",
    title: "From Resilience to Renewal: Economic Outlook",
    snippet: "The 2025 Annual Meetings marked a turning point in global economic strategy.",
    variant: "horizontal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    typeLabel: "Publications",
    dateLabel: "June 16, 2025",
    title: "G7 Summit 2025: Strategic Cooperation",
    snippet:
      "Changes in Kananaskis, Canada, come at a time of significant geopolitical uncertainty.",
    variant: "horizontal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    typeLabel: "Publications",
    dateLabel: "June 11, 2025",
    title: "Investing in Climate for Growth",
    snippet: "New OECD-UNDP report shows how climate action can drive economic growth.",
    variant: "horizontal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    typeLabel: "Publications",
    dateLabel: "May 20, 2025",
    title: "Eurobarometer: Trust in EU Institutions",
    snippet: "Over half of Europeans tend to trust the EU, the highest result since 2014.",
    variant: "horizontal",
  },
];

export const analyses: ResearchCard[] = [
  {
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    typeLabel: "REPORT",
    dateLabel: "NOVEMBER 10, 2025",
    title: "AI Liability Directives",
    snippet: "Navigating the new EU framework for civil liability in artificial intelligence systems.",
    variant: "vertical",
  },
  {
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    typeLabel: "ANALYSIS",
    dateLabel: "OCTOBER 24, 2025",
    title: "Smart Contract Validity",
    snippet: "Examining the legal enforceability of blockchain-based agreements in commercial law.",
    variant: "vertical",
  },
  {
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    typeLabel: "OPINION",
    dateLabel: "OCTOBER 12, 2025",
    title: "Digital Rights Charter",
    snippet: "Proposed amendments to data privacy laws protecting citizen rights in the metaverse.",
    variant: "vertical",
  },
  {
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    typeLabel: "COMMENTARY",
    dateLabel: "AUGUST 28, 2025",
    title: "Judicial Analytics",
    snippet: "Leveraging big data to improve caseflow management and reduce court backlogs.",
    variant: "vertical",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    typeLabel: "COMMENTARY",
    dateLabel: "AUGUST 15, 2025",
    title: "Cross-Border Protocols",
    snippet:
      "Standardizing e-evidence procedures across member states for faster resolution.",
    variant: "vertical",
  },
];
export type ResearchCategory =
  | "Publications"
  | "Report"
  | "Analysis"
  | "Opinion"
  | "Commentary";

export type ResearchItem = {
  id: string;
  title: string;
  excerpt: string;
  category: ResearchCategory;
  dateISO: string; // "2025-10-30"
  imageUrl: string;
  href: string; // route or url
};


export const analysisAndOpinions: ResearchItem[] = [
  {
    id: "ao-ai-liability",
    title: "AI Liability Directives",
    excerpt:
      "Navigating the new EU framework for civil liability in artificial intelligence systems.",
    category: "Report",
    dateISO: "2025-11-10",
    imageUrl:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1400&q=80",
    href: "/research/ai-liability-directives",
  },
  {
    id: "ao-smart-contract-validity",
    title: "Smart Contract Validity",
    excerpt:
      "Examining the legal enforceability of blockchain-based agreements in commercial law.",
    category: "Analysis",
    dateISO: "2025-10-24",
    imageUrl:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1400&q=80",
    href: "/research/smart-contract-validity",
  },
  {
    id: "ao-digital-rights",
    title: "Digital Rights Charter",
    excerpt:
      "Proposed amendments to data privacy laws protecting citizen rights in the metaverse.",
    category: "Opinion",
    dateISO: "2025-10-12",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
    href: "/research/digital-rights-charter",
  },
  {
    id: "ao-judicial-analytics",
    title: "Judicial Analytics",
    excerpt:
      "Leveraging big data to improve caseflow management and reduce court backlogs.",
    category: "Commentary",
    dateISO: "2025-08-28",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
    href: "/research/judicial-analytics",
  },
  {
    id: "ao-cross-border",
    title: "Cross Border ...",
    excerpt:
      "Standards for faster cross-border procedures and better coordination.",
    category: "Commentary",
    dateISO: "2025-08-12",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    href: "/research/cross-border",
  },
];
