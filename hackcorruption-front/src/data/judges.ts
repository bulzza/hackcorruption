import judgePlaceholder from "../assets/judge_placeholder.png";

export type JudgeMetric = {
  label: string;
  value: string;
  tone?: "good" | "warn" | "bad";
  info?: string;
};

export type JudgeCaseRow = {
  id: string;
  court: string;
  type: string;
  subtype: string;
  basisType: string;
  filingDate: string;
  status: "Unknown" | "Active" | "Closed";
};

export type JudgeItem = {
  id: string;
  name: string;
  role: string;
  court: string;
  electedOn: string;
  yearOfElection: string;
  area: string;
  photo: string;
  education: string[];
  experience: string[];
  metrics: JudgeMetric[];
  cases: JudgeCaseRow[];
};

export const JUDGES: JudgeItem[] = [
  {
    id: "daniela_stojanovska",
    name: "Daniela Stojanovska",
    role: "Judge",
    court: "Basic Criminal Court Skopje",
    electedOn: "08.03.2012",
    yearOfElection: "2012",
    area: "Criminal Matter",
    photo: judgePlaceholder,
    education: [
      "Faculty of Law, Justinianus Primus - Skopje (2002)",
      "Academy for Judges and Public Prosecutors (2006)",
    ],
    experience: [
      "Basic Criminal Court Skopje (2012 - Present)",
      "Senior Associate, Basic Court Skopje 1 (2007 - 2012)",
    ],
    metrics: [
      {
        label: "Average Duration",
        value: "231 days",
        tone: "good",
        info: "Average time from filing to decision.",
      },
      {
        label: "Clearance Rate",
        value: "82%",
        tone: "good",
        info: "Resolved cases vs. incoming in the last year.",
      },
      { label: "Total Solved (2024)", value: "154" },
      { label: "Active Cases", value: "42" },
      { label: "Sentence Severity", value: "Medium", tone: "warn" },
      { label: "Appeal Reversal", value: "18%", tone: "warn" },
    ],
    cases: [
      {
        id: "K-2010/24",
        court: "Basic Criminal Court Skopje",
        type: "Criminal",
        subtype: "Adult",
        basisType: "Abuse of Office",
        filingDate: "15.10.2025",
        status: "Unknown",
      },
      {
        id: "K-1959/25",
        court: "Basic Criminal Court Skopje",
        type: "Criminal",
        subtype: "Adult",
        basisType: "Fraud",
        filingDate: "15.12.2025",
        status: "Unknown",
      },
      {
        id: "PPK-C-2659/25",
        court: "Basic Criminal Court Skopje",
        type: "Criminal",
        subtype: "Adult",
        basisType: "Corruption",
        filingDate: "15.12.2025",
        status: "Unknown",
      },
    ],
  },
  {
    id: "daniela_dimovska",
    name: "Daniela Dimovska",
    role: "Judge",
    court: "Basic Criminal Court Skopje",
    electedOn: "05.09.2016",
    yearOfElection: "2015",
    area: "Criminal Matter - Organized Crime",
    photo: judgePlaceholder,
    education: [
      "Faculty of Law, Justinianus Primus - Skopje (2005)",
      "Academy for Judges and Public Prosecutors (2008)",
    ],
    experience: [
      "Basic Criminal Court Skopje (2015 - Present)",
      "Professional Associate, Basic Court Skopje 1 (2010 - 2015)",
    ],
    metrics: [
      {
        label: "Average Duration",
        value: "245 days",
        tone: "good",
        info: "Average time from filing to decision.",
      },
      {
        label: "Clearance Rate",
        value: "88%",
        tone: "good",
        info: "Resolved cases vs. incoming in the last year.",
      },
      { label: "Total Solved (2024)", value: "142" },
      { label: "Active Cases", value: "35" },
      { label: "Sentence Severity", value: "Medium", tone: "warn" },
      { label: "Appeal Reversal", value: "15%", tone: "warn" },
    ],
    cases: [
      {
        id: "K-1023/24",
        court: "Basic Criminal Court Skopje",
        type: "Criminal",
        subtype: "Adult",
        basisType: "Abuse of Office",
        filingDate: "14.09.2024",
        status: "Active",
      },
      {
        id: "K-144/25",
        court: "Basic Criminal Court Skopje",
        type: "Criminal",
        subtype: "Adult",
        basisType: "Fraud",
        filingDate: "27.05.2025",
        status: "Active",
      },
      {
        id: "K-331/22",
        court: "Court of Appeal Skopje",
        type: "Appeal",
        subtype: "Criminal",
        basisType: "Modification",
        filingDate: "18.06.2022",
        status: "Closed",
      },
    ],
  },
  {
    id: "aleksandra_ademi",
    name: "Aleksandra Ademi",
    role: "Judge",
    court: "Basic Criminal Court Skopje",
    electedOn: "12.02.2014",
    yearOfElection: "2014",
    area: "Misdemeanor - Traffic",
    photo: judgePlaceholder,
    education: [
      "Faculty of Law, South East European University (2003)",
      "Academy for Judges and Public Prosecutors (2007)",
    ],
    experience: [
      "Basic Criminal Court Skopje (2014 - Present)",
      "Misdemeanor Court Skopje (2008 - 2014)",
    ],
    metrics: [
      { label: "Average Duration", value: "110 days", tone: "good" },
      { label: "Clearance Rate", value: "92%", tone: "good" },
      { label: "Total Solved (2024)", value: "198" },
      { label: "Active Cases", value: "28" },
      { label: "Sentence Severity", value: "Low", tone: "good" },
      { label: "Appeal Reversal", value: "9%", tone: "good" },
    ],
    cases: [
      {
        id: "M-19/22",
        court: "Basic Court Ohrid",
        type: "Misdemeanor",
        subtype: "Traffic",
        basisType: "Safety",
        filingDate: "30.09.2022",
        status: "Closed",
      },
      {
        id: "M-301/24",
        court: "Basic Court Skopje",
        type: "Misdemeanor",
        subtype: "Traffic",
        basisType: "Speeding",
        filingDate: "11.02.2024",
        status: "Active",
      },
      {
        id: "M-402/24",
        court: "Basic Court Skopje",
        type: "Misdemeanor",
        subtype: "Traffic",
        basisType: "Parking",
        filingDate: "05.06.2024",
        status: "Unknown",
      },
    ],
  },
  {
    id: "vesna_stojanova",
    name: "Vesna Stojanova",
    role: "Judge",
    court: "Basic Civil Court Skopje",
    electedOn: "19.04.2011",
    yearOfElection: "2011",
    area: "Civil Litigation",
    photo: judgePlaceholder,
    education: [
      "Faculty of Law, Justinianus Primus - Skopje (2000)",
      "Academy for Judges and Public Prosecutors (2004)",
    ],
    experience: [
      "Basic Civil Court Skopje (2011 - Present)",
      "Civil Department, Basic Court Skopje 2 (2004 - 2011)",
    ],
    metrics: [
      { label: "Average Duration", value: "175 days", tone: "warn" },
      { label: "Clearance Rate", value: "80%", tone: "good" },
      { label: "Total Solved (2024)", value: "133" },
      { label: "Active Cases", value: "57" },
      { label: "Sentence Severity", value: "Low", tone: "good" },
      { label: "Appeal Reversal", value: "12%", tone: "warn" },
    ],
    cases: [
      {
        id: "P-204/24",
        court: "Basic Civil Court Skopje",
        type: "Civil",
        subtype: "Litigation",
        basisType: "Contract",
        filingDate: "05.12.2024",
        status: "Active",
      },
      {
        id: "P-88/23",
        court: "Basic Court Bitola",
        type: "Civil",
        subtype: "Debt Collection",
        basisType: "Invoice",
        filingDate: "28.06.2023",
        status: "Closed",
      },
      {
        id: "P-322/24",
        court: "Basic Civil Court Skopje",
        type: "Civil",
        subtype: "Property",
        basisType: "Ownership",
        filingDate: "17.08.2024",
        status: "Unknown",
      },
    ],
  },
  {
    id: "arben_kelmendi",
    name: "Arben Kelmendi",
    role: "Judge",
    court: "Administrative Court",
    electedOn: "04.06.2013",
    yearOfElection: "2013",
    area: "Administrative Law",
    photo: judgePlaceholder,
    education: [
      "Faculty of Law, State University of Tetovo (2001)",
      "Academy for Judges and Public Prosecutors (2005)",
    ],
    experience: [
      "Administrative Court (2013 - Present)",
      "Legal Adviser, Ministry of Justice (2006 - 2013)",
    ],
    metrics: [
      { label: "Average Duration", value: "140 days", tone: "good" },
      { label: "Clearance Rate", value: "85%", tone: "good" },
      { label: "Total Solved (2024)", value: "121" },
      { label: "Active Cases", value: "31" },
      { label: "Sentence Severity", value: "Medium", tone: "warn" },
      { label: "Appeal Reversal", value: "10%", tone: "good" },
    ],
    cases: [
      {
        id: "U-15/24",
        court: "Administrative Court",
        type: "Administrative",
        subtype: "Dispute",
        basisType: "Penalty Review",
        filingDate: "19.04.2024",
        status: "Active",
      },
      {
        id: "U-101/23",
        court: "Administrative Court",
        type: "Administrative",
        subtype: "Dispute",
        basisType: "Procurement",
        filingDate: "03.10.2023",
        status: "Closed",
      },
      {
        id: "U-88/24",
        court: "Administrative Court",
        type: "Administrative",
        subtype: "Dispute",
        basisType: "Licensing",
        filingDate: "22.08.2024",
        status: "Unknown",
      },
    ],
  },
  {
    id: "marko_georgiev",
    name: "Marko Georgiev",
    role: "Judge",
    court: "Commercial Court Skopje",
    electedOn: "17.09.2010",
    yearOfElection: "2010",
    area: "Commercial Dispute",
    photo: judgePlaceholder,
    education: [
      "Faculty of Law, Ss. Cyril and Methodius University (1999)",
      "Academy for Judges and Public Prosecutors (2003)",
    ],
    experience: [
      "Commercial Court Skopje (2010 - Present)",
      "Commercial Law Department, Basic Court Skopje 1 (2003 - 2010)",
    ],
    metrics: [
      { label: "Average Duration", value: "210 days", tone: "warn" },
      { label: "Clearance Rate", value: "79%", tone: "warn" },
      { label: "Total Solved (2024)", value: "97" },
      { label: "Active Cases", value: "64" },
      { label: "Sentence Severity", value: "Medium", tone: "warn" },
      { label: "Appeal Reversal", value: "13%", tone: "warn" },
    ],
    cases: [
      {
        id: "PR-7/24",
        court: "Commercial Court Skopje",
        type: "Commercial",
        subtype: "Dispute",
        basisType: "Governance",
        filingDate: "08.07.2024",
        status: "Active",
      },
      {
        id: "PR-44/23",
        court: "Commercial Court Skopje",
        type: "Commercial",
        subtype: "Dispute",
        basisType: "Shareholders",
        filingDate: "21.11.2023",
        status: "Closed",
      },
      {
        id: "PR-61/24",
        court: "Commercial Court Skopje",
        type: "Commercial",
        subtype: "Dispute",
        basisType: "Insolvency",
        filingDate: "19.09.2024",
        status: "Unknown",
      },
    ],
  },
  {
    id: "marija_kostova",
    name: "Marija Kostova",
    role: "Judge",
    court: "Basic Court Kumanovo",
    electedOn: "22.01.2015",
    yearOfElection: "2015",
    area: "Family Law",
    photo: judgePlaceholder,
    education: [
      "Faculty of Law, Justinianus Primus - Skopje (2004)",
      "Academy for Judges and Public Prosecutors (2009)",
    ],
    experience: [
      "Basic Court Kumanovo (2015 - Present)",
      "Family Law Department, Basic Court Skopje 2 (2009 - 2015)",
    ],
    metrics: [
      { label: "Average Duration", value: "120 days", tone: "good" },
      { label: "Clearance Rate", value: "86%", tone: "good" },
      { label: "Total Solved (2024)", value: "118" },
      { label: "Active Cases", value: "29" },
      { label: "Sentence Severity", value: "Low", tone: "good" },
      { label: "Appeal Reversal", value: "11%", tone: "warn" },
    ],
    cases: [
      {
        id: "F-303/23",
        court: "Basic Court Kumanovo",
        type: "Family",
        subtype: "Custody",
        basisType: "Child Support",
        filingDate: "17.03.2023",
        status: "Closed",
      },
      {
        id: "F-88/24",
        court: "Basic Court Kumanovo",
        type: "Family",
        subtype: "Divorce",
        basisType: "Visitation",
        filingDate: "01.07.2024",
        status: "Active",
      },
      {
        id: "F-114/24",
        court: "Basic Court Kumanovo",
        type: "Family",
        subtype: "Support",
        basisType: "Maintenance",
        filingDate: "09.10.2024",
        status: "Unknown",
      },
    ],
  },
];

export function getJudgeById(judgeId: string): JudgeItem | undefined {
  return JUDGES.find((j) => j.id.toLowerCase() === judgeId.toLowerCase());
}
