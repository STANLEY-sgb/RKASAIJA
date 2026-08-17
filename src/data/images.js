/**
 * Centralized Image Configuration Registry for R. Kasaija & Partners Advocates
 * Structured asset paths under /assets/images/{logo,hero,about,practice,team,contact,backgrounds,icons}
 */

export const IMAGES = {
  logo: {
    src: "/assets/images/logo/firm-logo.webp",
    fallback: "/assets/img/firm_logo.jpeg",
    alt: "R. Kasaija & Partners Advocates Logo",
  },
  hero: {
    src: "/assets/images/team/firm-team-full.webp",
    fallback: "/assets/img/FIRM  TEAM PIC.png",
    alt: "R. Kasaija & Partners Advocates Legal Team",
  },
  // Requested sequence for the homepage slideshow:
  // Slide 1 (TOP FIRST): FIRM TEAM PIC.png
  // Slide 2: Counsel Justine Junior
  // Slide 3: Counsel Oscar
  // Slide 4: Counsel Robert
  // Slide 5: Counsel Sharon
  // Slide 6: Counsel Chris
  // Slide 7: law_firm_team.jpeg
  heroSlides: [
    {
      id: "firm-team-main",
      src: "/assets/images/team/firm-team-full.webp",
      srcSm: "/assets/images/team/firm-team-full-sm.webp",
      fallback: "/assets/images/team/FIRM  TEAM PIC.png",
      fallbackOriginal: "/assets/img/FIRM  TEAM PIC.png",
      name: "R. Kasaija & Partners Advocates",
      title: "Official Firm Legal Team",
      alt: "R. Kasaija & Partners Advocates — Official Team Photograph",
      objectPosition: "center 35%",
      isTeamPic: true,
      motionType: "restrainedZoomOut",
    },
    {
      id: "justine",
      src: "/assets/images/hero/justine_junior.webp",
      srcSm: "/assets/images/hero/justine_junior-sm.webp",
      fallback: "/assets/img/counsel_justine_junior.jpeg",
      name: "Counsel Justine Junior",
      title: "Associate & Head of Administration",
      alt: "Counsel Justin Joseph Kasaija — Associate & Head of Administration",
      objectPosition: "center 20%",
      motionType: "zoomIn",
    },
    {
      id: "oscar",
      src: "/assets/images/hero/oscar-padded.webp",
      srcSm: "/assets/images/hero/oscar-padded.webp",
      fallback: "/assets/img/counsel_oscar.jpeg",
      name: "Counsel Oscar Musiime",
      title: "Advocate & Associate",
      alt: "Counsel Oscar Musiime — Advocate & Associate",
      objectPosition: "center 10%",
      motionType: "panLeft",
    },
    {
      id: "robert",
      src: "/assets/images/hero/robert.webp",
      srcSm: "/assets/images/hero/robert-sm.webp",
      fallback: "/assets/img/counsel_robert.jpeg",
      name: "Counsel Robert Kasaija",
      title: "Managing Partner",
      alt: "Counsel Robert Kasaija — Managing Partner",
      objectPosition: "center 15%",
      motionType: "zoomOut",
    },
    {
      id: "sharon",
      src: "/assets/images/hero/sharon.webp",
      srcSm: "/assets/images/hero/sharon-sm.webp",
      fallback: "/assets/img/counsel_sharon.jpeg",
      name: "Counsel Sharon Murungi",
      title: "Partner & Head of Litigation",
      alt: "Counsel Sharon Murungi — Partner & Head of Litigation",
      objectPosition: "center 20%",
      motionType: "panRight",
    },
    {
      id: "chris",
      src: "/assets/images/hero/chris.webp",
      srcSm: "/assets/images/hero/chris-sm.webp",
      fallback: "/assets/img/counsel_chris.jpeg",
      name: "Counsel Christopher Baluku",
      title: "Associate",
      alt: "Counsel Christopher Baluku — Associate",
      objectPosition: "center 20%",
      motionType: "zoomIn",
    },
    {
      id: "firm-team-landscape",
      src: "/assets/images/hero/law_firm_team.webp",
      srcSm: "/assets/images/hero/law_firm_team.webp",
      fallback: "/assets/img/law_firm_team.jpeg",
      name: "R. Kasaija Advocates Legal Team",
      title: "Advocates & Legal Specialists",
      alt: "R. Kasaija Advocates Legal Team — Group Photograph",
      objectPosition: "center 25%",
      isTeamPic: true,
      motionType: "panLeft",
    },
  ],
  teamGroupSlides: [
    {
      id: "full-team",
      src: "/assets/images/team/firm-team-full.webp",
      srcMd: "/assets/images/team/firm-team-full-md.webp",
      fallback: "/assets/images/team/FIRM  TEAM PIC.png",
      fallbackOriginal: "/assets/img/FIRM  TEAM PIC.png",
      title: "United Counsel. Unwavering Integrity.",
      badge: "Official FIRM TEAM PIC.png",
      objectPosition: "center 35%",
    },
    {
      id: "landscape-team",
      src: "/assets/images/team/firm-team-landscape.webp",
      srcMd: "/assets/images/team/firm-team-landscape-md.webp",
      fallback: "/assets/images/team/law_firm_team.jpeg",
      fallbackOriginal: "/assets/img/law_firm_team.jpeg",
      title: "Advocates, Commissioners & Legal Consultants",
      badge: "Official law_firm_team.jpeg",
      objectPosition: "center 25%",
    },
  ],
  team: {
    full: "/assets/images/team/firm-team-full.webp",
    fullMd: "/assets/images/team/firm-team-full-md.webp",
    fullOriginal: "/assets/img/FIRM  TEAM PIC.png",
    landscape: "/assets/images/team/firm-team-landscape.webp",
    alt: "R. Kasaija & Partners Advocates — Official Team Photograph",
  },
  practice: {
    banking: { src: "/assets/images/practice/banking-finance.jpg", alt: "Banking & Finance Law" },
    corporate: { src: "/assets/images/practice/corporate-commercial.jpg", alt: "Corporate & Commercial Law" },
    debt: { src: "/assets/images/practice/debt-recovery.jpg", alt: "Debt Recovery & Finance Litigation" },
    land: { src: "/assets/images/practice/land-conveyancing.jpg", alt: "Land & Real Estate Conveyancing" },
    ip: { src: "/assets/images/practice/intellectual-property.jpg", alt: "Intellectual Property Rights" },
    family: { src: "/assets/images/practice/family-probate.jpg", alt: "Family & Probate Law" },
    employment: { src: "/assets/images/practice/employment-labour.jpg", alt: "Employment & Labour Law" },
    criminal: { src: "/assets/images/practice/criminal-law.jpg", alt: "Criminal Defense & Proceedings" },
    adr: { src: "/assets/images/practice/arbitration-adr.jpg", alt: "Arbitration & Alternative Dispute Resolution" },
    tax: { src: "/assets/images/practice/tax-revenue.jpg", alt: "Revenue Law & Taxation Advisory" },
    ngo: { src: "/assets/images/practice/ngo-nonprofit.jpg", alt: "Non-Profit & NGO Governance" },
    compliance: { src: "/assets/images/practice/governance-compliance.jpg", alt: "Regulatory Governance & Compliance" },
  },
  advocates: {
    robert: {
      src: "/assets/images/team-members/robert.webp",
      fallback: "/assets/img/counsel_robert.jpeg",
      alt: "Robert Kasaija — Managing Partner",
    },
    sharon: {
      src: "/assets/images/team-members/sharon.webp",
      fallback: "/assets/img/counsel_sharon.jpeg",
      alt: "Sharon Murungi — Partner & Head of Litigation",
    },
    joseph: {
      src: "/assets/images/team-members/joseph.webp",
      fallback: "/assets/img/counsel_joseph.jpeg",
      alt: "Joseph Kwesiga — Partner",
    },
    justine: {
      src: "/assets/images/team-members/justine_junior.webp",
      fallback: "/assets/img/counsel_justine_junior.jpeg",
      alt: "Justin Joseph Kasaija — Associate & Head of Administration",
    },
    chris: {
      src: "/assets/images/team-members/chris.webp",
      fallback: "/assets/img/counsel_chris.jpeg",
      alt: "Christopher Baluku — Associate",
    },
    fred: {
      src: "/assets/images/team-members/fred.webp",
      fallback: "/assets/img/counsel_fred.jpeg",
      alt: "Fred Asiimwe — Associate",
    },
    oscar: {
      src: "/assets/images/team-members/oscar-card-padded.webp",
      fallback: "/assets/img/counsel_oscar.jpeg",
      alt: "Oscar Musiime — Associate",
    },
  },
  patterns: {
    pat: "/assets/img/PAT.png",
    remove: "/assets/img/remove.png",
  }
};

/**
 * Image onError helper to automatically swap broken image sources with fallback
 */
export const handleImageError = (e, fallbackSrc = IMAGES.patterns.remove) => {
  if (e.target && e.target.src !== fallbackSrc) {
    e.target.onerror = null;
    e.target.src = fallbackSrc;
  }
};

