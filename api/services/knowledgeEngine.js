import { WEBSITE_KNOWLEDGE } from '../data/websiteKnowledge.js';

/**
 * Intelligent Local Knowledge & Fallback Response Engine
 * Resolves natural language user queries when Gemini is unconfigured, rate-limited, or unavailable.
 */
export function getKnowledgeResponse(userQuery) {
  const query = (userQuery || '').toLowerCase().trim();

  // 1. GREETINGS
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|greetings|jambo|salam|hullo)/i.test(query)) {
    return {
      text: `Hello! Welcome to R. Kasaija & Partners Advocates. I am your digital assistant. How may I assist you today? You can ask about our legal services, advocates, office location, or book a consultation with our team.`,
      actions: [
        { label: "Book Consultation", path: "/book" },
        { label: "Practice Areas", path: "/practice" },
        { label: "Our Team", path: "/team" }
      ]
    };
  }

  // 2. SERVICES / PRACTICE AREAS
  if (/(service|practice|offer|work|handle|area|domain|specializ|field|do you guys do|what do you do|what can you do)/i.test(query)) {
    return {
      text: `R. Kasaija & Partners Advocates is a full-service Ugandan law firm specializing in 12 core practice areas:\n\n• Banking & Finance\n• Corporate & Commercial\n• Debt Recovery\n• Land & Conveyancing\n• Intellectual Property\n• Family & Probate\n• Employment & Labour\n• Criminal Law\n• Arbitration & ADR\n• Revenue Law & Taxation\n• Non-Profit & NGO Law\n• Governance & Compliance\n\nWhich area would you like more information about?`,
      actions: [
        { label: "View Practice Areas", path: "/practice" },
        { label: "Book Consultation", path: "/book" }
      ]
    };
  }

  // 3. LAWYERS / TEAM
  if (/(lawyer|advocate|counsel|team|partner|associate|who works|staff|robert|sharon|joseph|justine|justin|oscar|chris|fred)/i.test(query)) {
    return {
      text: `Our firm features 7 experienced Ugandan advocates:\n\n• Robert Kasaija — Managing Partner (ICAMEK Arbitrator, Corporate & Finance)\n• Sharon Murungi — Partner & Head of Litigation (Commercial, Labour, Family & IP)\n• Joseph Kwesiga — Partner (Land, Environment, Procurement & NGO)\n• Justine Joseph Kasaija — Associate & Head of Administration (Corporate Governance)\n• Oscar Musiime — Associate (Corporate, Commercial & Land)\n• Christopher Baluku — Associate (Submissions & Pleadings)\n• Fred Asiimwe — Associate (Civil Litigation)`,
      actions: [
        { label: "View Our Team", path: "/team" },
        { label: "Book Consultation", path: "/book" }
      ]
    };
  }

  // 4. BOOKING / CONSULTATION / APPOINTMENT
  if (/(book|appointment|schedule|consult|meet|lawyer|appointment|visit|reserve|talk to|speak with|see an advocate)/i.test(query)) {
    return {
      text: `You can schedule a consultation with our advocates directly online or by calling +256 772 418 707. Our team will review your matter and confirm your booking within one business day.`,
      actions: [
        { label: "Book Consultation", path: "/book" },
        { label: "Call Us Now", path: "/contact" }
      ]
    };
  }

  // 5. CONTACT / LOCATION / ADDRESS / PHONE
  if (/(contact|address|phone|location|where|office|number|email|reach|whatsapp|call|hours|find)/i.test(query)) {
    return {
      text: `You can reach R. Kasaija & Partners Advocates at:\n\n• Address: Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, Kampala, Uganda\n• Phone: +256 772 418 707 | +256 776 044 004\n• WhatsApp: +256 776 044 004\n• Email: kasaijaandpartners@gmail.com\n• Hours: Monday–Friday, 8:00 AM – 5:00 PM EAT`,
      actions: [
        { label: "Contact Us Page", path: "/contact" },
        { label: "Book Consultation", path: "/book" }
      ]
    };
  }

  // 6. ABOUT THE FIRM
  if (/(about|firm|who are you|history|background|ugandan|kasaija)/i.test(query)) {
    return {
      text: `R. Kasaija & Partners Advocates is a premier indigenous Ugandan law firm established over 20 years ago in Kampala. We represent foreign and local corporations, financial institutions, donor agencies, and individual clients across East Africa with ethical integrity and business-minded counsel.`,
      actions: [
        { label: "About Our Firm", path: "/about" },
        { label: "Our Practice Areas", path: "/practice" }
      ]
    };
  }

  // 7. SPECIFIC PRACTICE AREAS (Land, Family, Corporate, Banking, Criminal, Debt, IP, Tax)
  if (/(land|title|kibanja|mailo|house|property)/i.test(query)) {
    return {
      text: `Our Land & Conveyancing practice handles title searches, due diligence, mailo & freehold transfers, mortgages, caveats, and land dispute resolution. Led by Partner Joseph Kwesiga.`,
      actions: [
        { label: "Book Land Consultation", path: "/book" },
        { label: "Practice Areas", path: "/practice" }
      ]
    };
  }

  if (/(family|divorce|custody|child|will|probate|succession|wills)/i.test(query)) {
    return {
      text: `Our Family & Probate practice advises on divorce, custody, child support, adoption, guardianship, wills, estates, and succession. Led by Sharon Murungi, Head of Litigation.`,
      actions: [
        { label: "Book Family Consultation", path: "/book" },
        { label: "Contact Firm", path: "/contact" }
      ]
    };
  }

  if (/(corporate|business|company|ursb|contract|merger|acquisition)/i.test(query)) {
    return {
      text: `Our Corporate & Commercial practice handles company registration (URSB), commercial contracts, joint ventures, secretarial services, and regulatory compliance.`,
      actions: [
        { label: "Book Business Advisory", path: "/book" },
        { label: "Practice Areas", path: "/practice" }
      ]
    };
  }

  // DEFAULT / GENERAL RESPONSE
  return {
    text: `Thank you for reaching out to R. Kasaija & Partners Advocates. We are a full-service law firm based in Kampala, Uganda, specializing in Banking & Finance, Corporate Law, Land & Conveyancing, Debt Recovery, Family Law, Litigation, and Arbitration.\n\nHow can we best assist you today?`,
    actions: [
      { label: "Book Consultation", path: "/book" },
      { label: "Practice Areas", path: "/practice" },
      { label: "Contact Us", path: "/contact" }
    ]
  };
}
