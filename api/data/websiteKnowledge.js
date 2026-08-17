/**
 * Structured & Verified Website Knowledge Base for R. Kasaija & Partners Advocates
 * Primary knowledge source for Kasaija AI Assistant.
 */

export const WEBSITE_KNOWLEDGE = {
  firm: {
    name: "R. Kasaija & Partners Advocates",
    shortName: "Kasaija Advocates",
    tagline: "Counsel that moves with your business",
    established: "Over 20 years of practice in Kampala, Uganda",
    address: "Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, P.O. Box 70643, Kampala, Uganda",
    phone1: "+256 772 418 707",
    phone2: "+256 776 044 004",
    whatsapp: "+256 776 044 004",
    email: "kasaijaandpartners@gmail.com",
    hours: "Monday – Friday: 8:00 AM – 5:00 PM EAT. Closed weekends & public holidays.",
    memberships: ["Uganda Law Society (ULS)", "East Africa Law Society (EALS)", "ICAMEK (Institute of Chartered Arbitrators & Mediators)"],
    accreditation: "Managing Partner Robert Kasaija is an ICAMEK-accredited arbitrator, Notary Public, and Commissioner for Oaths."
  },
  
  practiceAreas: [
    { id: "banking", name: "Banking & Finance", desc: "Structured finance, syndicated lending, e-banking, insurance claims, debentures, and project financing across East Africa.", lawyer: "Robert Kasaija", path: "/practice" },
    { id: "corporate", name: "Corporate & Commercial", desc: "Mergers, acquisitions, foreign investment, company secretarial work, joint ventures, and URSB business registration.", lawyer: "Justine Joseph Kasaija", path: "/practice" },
    { id: "debt", name: "Debt Recovery", desc: "Substantial debt recovery record for financial institutions, demand letters, negotiation, civil suits, attachment, and garnishment.", lawyer: "Sharon Murungi", path: "/practice" },
    { id: "land", name: "Land & Conveyancing", desc: "Title searches, mailo/freehold land transfers, mortgages, caveats, due diligence, and property dispute resolution.", lawyer: "Joseph Kwesiga", path: "/practice" },
    { id: "ip", name: "Intellectual Property", desc: "Trademark & patent registration, IP licensing, enforcement, and landmark predatory pricing litigation in Uganda.", lawyer: "Sharon Murungi", path: "/practice" },
    { id: "family", name: "Family & Probate", desc: "Divorce, child custody & support, adoption, guardianship, wills, succession, and probate administration.", lawyer: "Sharon Murungi", path: "/practice" },
    { id: "employment", name: "Employment & Labour", desc: "Employment contracts, redundancies, trade union relations, pension audits, social security, and wrongful termination.", lawyer: "Sharon Murungi", path: "/practice" },
    { id: "criminal", name: "Criminal Law", desc: "Criminal defence, police bail & bond, private investigations, and retained partnerships with security firms.", lawyer: "Robert Kasaija", path: "/practice" },
    { id: "adr", name: "Arbitration & ADR", desc: "ICAMEK-accredited arbitration, commercial mediation, and negotiation to save clients time and litigation costs.", lawyer: "Robert Kasaija", path: "/practice" },
    { id: "tax", name: "Revenue Law & Taxation", desc: "Corporate tax planning, VAT, PAYE, withholding tax, tax reorganization, and URA compliance.", lawyer: "Robert Kasaija", path: "/practice" },
    { id: "ngo", name: "Non-Profit & NGO", desc: "NGO Bureau registration, governance, compliance, financing, and pro-bono counsel to Uganda Christian Lawyers Fraternity.", lawyer: "Joseph Kwesiga", path: "/practice" },
    { id: "compliance", name: "Governance & Compliance", desc: "Designing regulatory compliance programs, institutional risk deterrence, and corporate governance audits.", lawyer: "Justine Joseph Kasaija", path: "/practice" }
  ],

  team: [
    { name: "Robert Kasaija", role: "Managing Partner", focus: "Corporate Finance, Real Estate, Arbitration, Litigation", bio: "Over 20 years in practice. Commissioner for Oaths, Notary Public, ICAMEK arbitrator. Represents Shengli Engineering and foreign investor entities.", path: "/team" },
    { name: "Sharon Murungi", role: "Partner — Head of Litigation", focus: "Commercial, Labour, Tax, Arbitration, Family Law, IP", bio: "Head of Litigation. Former UNHCR/HIJRA protection manager and legal aid provider.", path: "/team" },
    { name: "Joseph Kwesiga", role: "Partner", focus: "Environmental, Land, Procurement, Insurance, NGO", bio: "Former Legal Officer and Head of Prosecutions at National Forestry Authority.", path: "/team" },
    { name: "Justine Joseph Kasaija", role: "Associate — Head of Administration", focus: "Corporate Governance & Business Advisory", bio: "Advises national and multinational companies on business risk and governance.", path: "/team" },
    { name: "Christopher Baluku", role: "Associate", focus: "Submissions, Pleadings & Legal Research", bio: "Grounded in legal research, submissions, and court pleadings.", path: "/team" },
    { name: "Fred Asiimwe", role: "Associate", focus: "Civil Litigation & Case Research", bio: "Extensive civil litigation and court filing experience.", path: "/team" },
    { name: "Oscar Musiime", role: "Associate", focus: "Corporate & Commercial, IP, Family Law, Land", bio: "Advocate of the High Court of Uganda specializing in client-centered legal practice.", path: "/team" }
  ],

  booking: {
    title: "Book a Legal Consultation",
    process: "You can schedule a consultation online or by calling +256 772 418 707.",
    requiredInfo: ["Full Name", "Phone / WhatsApp", "Email Address", "Practice Area / Issue", "Preferred Date & Time"],
    timeframe: "Our legal team responds and confirms appointments within one business day.",
    path: "/book"
  },

  contact: {
    title: "Contact Chambers",
    address: "Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, Kampala, Uganda",
    phone: "+256 772 418 707",
    whatsapp: "+256 776 044 004",
    email: "kasaijaandpartners@gmail.com",
    path: "/contact"
  },

  navigation: [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Practice Areas", path: "/practice" },
    { label: "Our Team", path: "/team" },
    { label: "Book Consultation", path: "/book" },
    { label: "Contact Us", path: "/contact" }
  ]
};
