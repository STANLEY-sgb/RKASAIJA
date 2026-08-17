/**
 * Centralized API & Communication Submission Engine for R. Kasaija & Partners Advocates
 * Compatible with GitHub Pages static hosting & production serverless endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const FIRM_PRIMARY_EMAIL = 'kasaijaandpartners@gmail.com';
const FIRM_SECONDARY_EMAIL = 'musinguzialituhastanley@gmail.com';
const REQUEST_TIMEOUT_MS = 12000; // 12-second timeout

/**
 * Standard fetch with AbortController timeout protection
 */
export const fetchWithTimeout = async (url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('The request timed out. Please check your internet connection or call +256 772 418 707.');
    }
    throw err;
  }
};

/**
 * Generic API Fetcher for local backend or VITE_API_URL endpoints
 */
export const apiFetch = async (endpoint, options = {}) => {
  const primaryUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetchWithTimeout(primaryUrl, defaultOptions);
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP status: ${response.status}`);
  } catch (err) {
    console.warn(`[apiFetch warning] ${endpoint} failed:`, err.message);
    throw err;
  }
};

/**
 * Validates email format strictly without browser crashes
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Reliable Direct Form-to-Email Delivery via FormSubmit (Works on static GitHub Pages)
 */
const sendViaFormSubmit = async (recipientEmail, payloadData) => {
  const endpointUrl = `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;
  
  const response = await fetchWithTimeout(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payloadData)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`FormSubmit HTTP error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result;
};

/**
 * ─── 1. CONTACT INQUIRY SUBMISSION ─────────────────────────────────────────────
 */
export const submitContactForm = async (data) => {
  const { name, email, phone, area, message, honeypot } = data;

  // Spam protection: silent rejection if honeypot trap is filled
  if (honeypot) {
    console.warn('[SPAM DETECTED] Honeypot field triggered');
    return { success: true, message: 'Your enquiry has been received.' };
  }

  if (!name || !name.trim()) {
    return { success: false, error: 'Please enter your full name.' };
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!message || !message.trim()) {
    return { success: false, error: 'Please enter your enquiry message.' };
  }

  // 1. Try primary API endpoint if custom VITE_API_URL is configured
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.startsWith('http')) {
    try {
      const res = await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, area, message })
      });
      if (res && res.success) {
        return { success: true, message: 'Your enquiry has been received.' };
      }
    } catch (apiErr) {
      console.warn('[API Route fallback] Custom VITE_API_URL endpoint unreachable. Using FormSubmit delivery engine.');
    }
  }

  // 2. Production Static Delivery Engine (GitHub Pages Compatible)
  const timestampStr = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Kampala' }) + ' (EAT)';

  const formPayload = {
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : 'Not provided',
    _replyto: email.trim(),
    _subject: `New Website Enquiry: ${name.trim()} (${area || 'General Legal Enquiry'})`,
    _template: 'table',
    'Client Name': name.trim(),
    'Client Email': email.trim(),
    'Client Phone': phone ? phone.trim() : 'Not provided',
    'Practice Area': area || 'General Legal Enquiry',
    'Submitted At': timestampStr,
    'Client Message': message.trim(),
    'Source Website': 'R. Kasaija & Partners Advocates Website'
  };

  try {
    // Deliver to primary firm email inbox
    await sendViaFormSubmit(FIRM_PRIMARY_EMAIL, formPayload);
    
    // Asynchronously trigger dual delivery to secondary email if configured
    sendViaFormSubmit(FIRM_SECONDARY_EMAIL, formPayload).catch(() => {});

    return { 
      success: true, 
      message: 'Your message has been sent successfully. Our legal team will get back to you as soon as possible.' 
    };
  } catch (deliveryError) {
    console.error('[Contact Submission Delivery Error]', deliveryError.message);
    return {
      success: false,
      error: 'We couldn\'t send your message right now due to a network connection issue. Please try again or contact us directly at +256 772 418 707 or kasaijaandpartners@gmail.com.'
    };
  }
};

/**
 * ─── 2. APPOINTMENT REQUEST SUBMISSION ─────────────────────────────────────────
 */
export const submitAppointmentRequest = async (data) => {
  const { 
    client_name, 
    client_email, 
    client_phone, 
    practice_area, 
    preferred_lawyer, 
    preferred_date, 
    preferred_time, 
    message, 
    reference_id,
    honeypot 
  } = data;

  // Spam trap protection
  if (honeypot) {
    console.warn('[SPAM DETECTED] Honeypot field triggered');
    return { success: true, message: 'Your appointment request has been received.' };
  }

  if (!client_name || !client_name.trim()) {
    return { success: false, error: 'Please enter your full name.' };
  }

  if (!isValidEmail(client_email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const refId = reference_id || 'RKP-' + Math.floor(100000 + Math.random() * 900000);

  // 1. Try primary API endpoint if custom VITE_API_URL is configured
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.startsWith('http')) {
    try {
      const res = await apiFetch('/book', {
        method: 'POST',
        body: JSON.stringify({ 
          client_name, client_email, client_phone, practice_area, 
          preferred_lawyer, preferred_date, preferred_time, message, reference_id: refId 
        })
      });
      if (res && res.success) {
        return { 
          success: true, 
          refId,
          message: 'Your appointment request has been received. Our team will contact you to confirm availability.' 
        };
      }
    } catch (apiErr) {
      console.warn('[API Route fallback] Custom VITE_API_URL endpoint unreachable. Using FormSubmit delivery engine.');
    }
  }

  // 2. Production Static Delivery Engine (GitHub Pages Compatible)
  const timestampStr = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Kampala' }) + ' (EAT)';

  const appointmentPayload = {
    name: client_name.trim(),
    email: client_email.trim(),
    phone: client_phone ? client_phone.trim() : 'Not provided',
    _replyto: client_email.trim(),
    _subject: `[Appointment Request] ${client_name.trim()} — ${preferred_lawyer || 'Any Specialist'} (${preferred_date || 'Flexible Date'})`,
    _template: 'table',
    'Reference ID': refId,
    'Client Name': client_name.trim(),
    'Client Email': client_email.trim(),
    'Client Phone': client_phone ? client_phone.trim() : 'Not provided',
    'Practice Area': practice_area || 'General Legal Consultation',
    'Requested Advocate': preferred_lawyer || 'Any Senior Advocate',
    'Requested Date': preferred_date || 'Flexible Date',
    'Requested Time': preferred_time || 'Flexible Time',
    'Case Summary / Message': message ? message.trim() : 'None provided',
    'Submitted At': timestampStr,
    'Source Website': 'R. Kasaija & Partners Advocates Website'
  };

  try {
    // Deliver to primary firm inbox
    await sendViaFormSubmit(FIRM_PRIMARY_EMAIL, appointmentPayload);

    // Asynchronously send to secondary admin email
    sendViaFormSubmit(FIRM_SECONDARY_EMAIL, appointmentPayload).catch(() => {});

    return { 
      success: true, 
      refId,
      message: 'Your appointment request has been received. Our team will contact you to confirm availability.' 
    };
  } catch (deliveryError) {
    console.error('[Appointment Submission Delivery Error]', deliveryError.message);
    return {
      success: false,
      error: 'We couldn\'t send your appointment request right now due to a network connection issue. Please try again or call our chambers directly at +256 772 418 707.'
    };
  }
};

/**
 * ─── 3. LAWYER-SPECIFIC INQUIRY SUBMISSION ─────────────────────────────────────
 */
export const submitLawyerInquiry = async (lawyerName, clientData) => {
  return submitAppointmentRequest({
    ...clientData,
    preferred_lawyer: lawyerName
  });
};

/**
 * Streaming Fetch helper for AI Assistant
 */
export const streamFetch = async (endpoint, body, onChunk, onDone, onError) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content') {
              onChunk(data.content);
            } else if (data.type === 'done') {
              onDone();
            } else if (data.type === 'error') {
              onError(data.message);
            }
          } catch (e) {
            console.error('Error parsing SSE line', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Stream fetch error:', error);
    onError('I am having trouble connecting to the server. Please try again or call +256 772 418 707.');
  }
};
