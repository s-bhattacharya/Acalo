window.ACALO_CONFIG = {
  siteName: 'Acalo',
  domain: 'https://acalo.live',
  founderName: 'Founder Name',
  primaryEmail: 'hello@acalo.live',
  contactFormEndpoint: '',
  leadMagnetFormEndpoint: '',
  bookingUrl: '',
  whatsappUrl: '',
  portalUrl: '',
  socialLinks: {
    instagram: '',
    linkedin: '',
    youtube: ''
  },
  pricing: {
    diagnostic: { label: 'LSAT Diagnostic', usd: '$15', inr: '₹1,300', note: 'Single diagnostic session with a clear study map.' },
    oneToOne: { label: '1:1 Private Coaching', usd: '$20', inr: '₹1,700', note: 'Focused private correction and reasoning work.' },
    pack4: { label: '4-Session Correction Pack', usd: '$72', inr: '₹6,000', note: 'Package rate for structured correction over four sessions.' },
    intensive7: { label: '7-Session Intensive', usd: '$119', inr: '₹10,000', note: 'Final-stretch support with consistent momentum.' },
    ibgcse: { label: 'IB / GCSE Support', usd: 'From $18', inr: 'From ₹1,500', note: 'Subject and writing support, scoped by syllabus level.' }
  },
  payments: {
    diagnostic: '',
    oneToOne: '',
    pack4: '',
    intensive7: '',
    ibgcse: ''
  },
  downloadLinks: {
    lsatChecklist: '',
    errorLog: '',
    essayTemplate: '',
    revisionSheet: '',
    planner: '',
    readingFramework: ''
  },
  phase2: {
    services: {
      auth: 'supabase',
      database: 'supabase',
      billing: ['stripe', 'razorpay']
    },
    dataContracts: {
      profile: ['id', 'full_name', 'exam_track', 'target_date'],
      doubtTicket: ['id', 'student_id', 'topic', 'question_text', 'status'],
      purchase: ['id', 'student_id', 'resource_id', 'provider', 'payment_status'],
      sessionHistory: ['id', 'student_id', 'session_date', 'focus_area', 'coach_notes']
    }
  }
};
