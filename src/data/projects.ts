export type ProjectMotif = 'healthcare' | 'commerce' | 'rental' | 'data'

export interface Project {
  id: string
  number: string
  descriptor: string
  category: string
  description: string
  metricValue?: string
  metricLabel?: string
  systemFlow: string[]
  motif: ProjectMotif
  technologies: string[]
  details: string[]
}

export const projects: Project[] = [
  {
    id: 'project-01',
    number: '01',
    descriptor: 'HEALTHCARE\nLEARNING\nPLATFORM',
    category: 'Healthcare / Learning',
    metricValue: '670+',
    metricLabel: 'REGISTERED DOCTORS',
    description:
      'A production medical learning platform combining secure authentication, content delivery, media management and learning workflows.',
    systemFlow: ['AUTH', 'CONTENT', 'MEDIA', 'LEARNING'],
    motif: 'healthcare',
    technologies: [
      'React',
      'Strapi',
      'Node.js',
      'JWT',
      'AWS S3',
      'Encryption',
      'Nginx',
    ],
    details: [
      'Built and maintained a production medical learning platform used by 670+ registered doctors.',
      'Implemented secure handling of sensitive doctor data using encryption/decryption across application and database flows.',
      'Worked on JWT authentication, refresh tokens, sessions/cookies and LMS integration.',
      'Worked with AWS S3 media workflows.',
      'Worked on deployment pipelines and production releases.',
      'Used Nginx and handled production troubleshooting.',
      'Translated application and authentication requirements into reliable production features.',
    ],
  },
  {
    id: 'project-02',
    number: '02',
    descriptor: 'COMMERCE\n& PAYMENTS',
    category: 'Commerce / Product',
    metricValue: '60+',
    metricLabel: 'USERS',
    description:
      'A commerce platform for discovering, customizing and ordering physical greeting cards.',
    systemFlow: ['DISCOVER', 'CUSTOMIZE', 'CHECKOUT', 'FULFIL'],
    motif: 'commerce',
    technologies: [
      'React',
      'Node.js',
      'MongoDB',
      'Stripe',
      'Webhooks',
      'SSO',
      'Shipping',
    ],
    details: [
      'Co-architected the frontend, backend and database for the platform.',
      'Built workflows for card discovery, customization, ordering, fulfilment and administration.',
      'Built browsing and checkout flows using Stripe Payment Intents.',
      'Implemented location-based tax calculation.',
      'Implemented payment webhooks.',
      'Worked on SSO and shipping integrations.',
      'Worked across APIs, database logic, frontend and deployment.',
    ],
  },
  {
    id: 'project-03',
    number: '03',
    descriptor: 'RENTAL\nMANAGEMENT',
    category: 'Rental Management',
    description:
      'A rental management platform that turns real-world landlord and tenant processes into digital workflows.',
    systemFlow: ['AGREEMENT', 'INVOICE', 'REMINDER', 'EXPIRY'],
    motif: 'rental',
    technologies: [
      'React',
      'Node.js',
      'PostgreSQL',
      'Supabase',
      'Cron Jobs',
    ],
    details: [
      'Built workflows for landlords, property managers and tenants.',
      'Implemented rental agreement lifecycles.',
      'Implemented notice periods.',
      'Implemented agreement extensions.',
      'Implemented early termination workflows.',
      'Implemented invoices and outstanding balances.',
      'Implemented advance payment handling.',
      'Built automated monthly processing for invoices.',
      'Built automated reminders.',
      'Built agreement expiry processing.',
      'Worked directly with client requirements, business rules and edge cases.',
      'The platform gained local adoption through organic word-of-mouth referrals.',
    ],
  },
  {
    id: 'project-04',
    number: '04',
    descriptor: 'DATA\nVISUALIZATION',
    category: 'Data / Visualization',
    description:
      'A data platform combining backend APIs with interactive data visualizations.',
    systemFlow: ['DATA', 'API', 'CACHE', 'VISUALIZE'],
    motif: 'data',
    technologies: [
      'Node.js',
      'Express',
      'MongoDB',
      'Redis',
      'ECharts',
      'Highcharts',
      'AmCharts',
      'Leaflet',
    ],
    details: [
      'Built Node.js/Express APIs connected to MongoDB.',
      'Created interactive data visualizations.',
      'Worked with ECharts, Highcharts, AmCharts and Leaflet.',
      'Worked with stakeholders to understand data requirements.',
      'Translated data requirements into usable visual interfaces.',
      'Implemented Redis-backed caching.',
    ],
  },
]
