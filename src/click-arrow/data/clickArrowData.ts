import backdropAsset from '../../assets/click-arrow-backdrop.jpg.asset.json';
import brandFilmAsset from '../../assets/click-arrow-brand-film.jpg.asset.json';
import identitySystemAsset from '../../assets/click-arrow-identity-system.jpg.asset.json';
import lifestyleEditorialAsset from '../../assets/click-arrow-lifestyle-editorial.jpg.asset.json';
import productCampaignAsset from '../../assets/click-arrow-product-campaign.jpg.asset.json';
import spatialScreensAsset from '../../assets/click-arrow-spatial-screens.jpg.asset.json';

export interface ServiceChannel {
  id: string;
  channelNumber: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  programType:
    | 'brand-identity'
    | 'social-presence'
    | 'search-growth'
    | 'digital-experiences'
    | 'visual-stories'
    | 'ai-marketing';
  backdropImage: string;
}

export interface StudioWorkItem {
  id: string;
  index: string;
  title: string;
  category: 'Brand Films' | 'Photography' | 'Identity & Motion';
  medium: string;
  conceptLabel: string;
  description: string;
  image: string;
  programType?: ServiceChannel['programType'];
  aspect: 'landscape' | 'portrait';
}

export interface StrategyPillar {
  index: string;
  title: string;
  summary: string;
  focus: string;
}

export interface GrowthChannel {
  id: string;
  index: string;
  title: string;
  role: string;
  outputs: string[];
}

export interface ProcessStage {
  number: string;
  title: string;
  tagline: string;
  detail: string;
}

export const BRAND_BACKDROP =
  backdropAsset.url;

export const STUDIO_ASSETS = {
  brandFilm: brandFilmAsset.url,
  productCampaign: productCampaignAsset.url,
  lifestyleEditorial: lifestyleEditorialAsset.url,
  identitySystem: identitySystemAsset.url,
  spatialScreens: spatialScreensAsset.url,
} as const;

export const SERVICES_CHANNELS: ServiceChannel[] = [
  {
    id: 'brand-identity',
    channelNumber: 'TV 01',
    title: 'BRAND IDENTITY',
    subtitle: 'Visual architecture built to stay unmistakable.',
    description:
      'Distinctive brand marks, kinetic typography, colour discipline, and cohesive design systems engineered to command recognition across every touchpoint.',
    deliverables: [
      'Logo animations & motion marks',
      'Custom brand typography systems',
      'Complete identity guidelines',
      'Art-directed branding compositions',
    ],
    programType: 'brand-identity',
    backdropImage: STUDIO_ASSETS.identitySystem,
  },
  {
    id: 'social-presence',
    channelNumber: 'TV 02',
    title: 'SOCIAL PRESENCE',
    subtitle: 'Culture-ready creative built for thumb-stopping velocity.',
    description:
      'High-contrast vertical storytelling, campaign series, and agile content systems that turn passive feeds into active brand momentum.',
    deliverables: [
      'Social media creative suites',
      'Short-form reels & cutdowns',
      'Always-on campaign visuals',
      'Editorial content production',
    ],
    programType: 'social-presence',
    backdropImage: STUDIO_ASSETS.lifestyleEditorial,
  },
  {
    id: 'search-growth',
    channelNumber: 'TV 03',
    title: 'SEARCH & GROWTH',
    subtitle: 'Precision visibility aligned with commercial intent.',
    description:
      'Search architecture, paid acquisition creative, and conversion pathways structured to capture high-intent demand without wasting attention.',
    deliverables: [
      'Digital marketing campaigns',
      'Search visibility & intent mapping',
      'Performance creative testing',
      'Live growth measurement views',
    ],
    programType: 'search-growth',
    backdropImage: STUDIO_ASSETS.spatialScreens,
  },
  {
    id: 'digital-experiences',
    channelNumber: 'TV 04',
    title: 'DIGITAL EXPERIENCES',
    subtitle: 'Interactive flagship platforms engineered for immersion.',
    description:
      'Experimental web flagships, fluid scroll choreography, and responsive digital interfaces that transform visitors into invested believers.',
    deliverables: [
      'Flagship website interfaces',
      'Interactive WebGL & motion layouts',
      'Cross-device responsive systems',
      'Conversion-led product journeys',
    ],
    programType: 'digital-experiences',
    backdropImage: STUDIO_ASSETS.spatialScreens,
  },
  {
    id: 'visual-stories',
    channelNumber: 'TV 05',
    title: 'VISUAL STORIES',
    subtitle: 'Cinema-grade production with unmistakable point of view.',
    description:
      'Commercial direction, product photography, editorial stills, and rhythmic post-production designed to make every frame feel authored.',
    deliverables: [
      'Cinematic brand films',
      'Commercial & lifestyle photography',
      'Rhythmic editorial video editing',
      '3D & 2D motion graphics',
    ],
    programType: 'visual-stories',
    backdropImage: STUDIO_ASSETS.brandFilm,
  },
  {
    id: 'ai-marketing',
    channelNumber: 'TV 06',
    title: 'AI-POWERED MARKETING',
    subtitle: 'Intelligent creative workflows paired with human taste.',
    description:
      'Custom generative art pipelines, rapid campaign iteration systems, and automated creative intelligence anchored by sharp editorial direction.',
    deliverables: [
      'Art-directed generative visuals',
      'Intelligent marketing workflows',
      'Experimental visual prototyping',
      'Automated creative scaling systems',
    ],
    programType: 'ai-marketing',
    backdropImage: STUDIO_ASSETS.productCampaign,
  },
];

export const STUDIO_WORK_ITEMS: StudioWorkItem[] = [
  {
    id: 'film-signal-zero',
    index: '01',
    title: 'Signal Zero — Brand Film Direction',
    category: 'Brand Films',
    medium: 'Anamorphic Motion · Live Studio Loop',
    conceptLabel: 'Concept Campaign 01',
    description:
      'Volumetric crimson and stark white stage lighting paired with tracked cinema camera choreography for a flagship brand launch film.',
    image: STUDIO_ASSETS.brandFilm,
    programType: 'visual-stories',
    aspect: 'landscape',
  },
  {
    id: 'photo-axis-noir',
    index: '02',
    title: 'Axis Monolith — Product Campaign',
    category: 'Photography',
    medium: 'Commercial Stills · Lighting Study',
    conceptLabel: 'Concept Campaign 02',
    description:
      'Sculptural obsidian surfaces edged with bright Click Arrow red rim light to create pure tactile contrast without visual noise.',
    image: STUDIO_ASSETS.productCampaign,
    programType: 'brand-identity',
    aspect: 'portrait',
  },
  {
    id: 'editorial-frame-shift',
    index: '03',
    title: 'Frame Shift — Editorial Portrait Series',
    category: 'Photography',
    medium: 'Lifestyle Direction · 35mm Contrast',
    conceptLabel: 'Concept Campaign 03',
    description:
      'Architectural studio portraiture combining stark geometric light projection with vivid scarlet cyclorama staging.',
    image: STUDIO_ASSETS.lifestyleEditorial,
    programType: 'social-presence',
    aspect: 'portrait',
  },
  {
    id: 'identity-arrow-manual',
    index: '04',
    title: 'Vector Systems — Identity Architecture',
    category: 'Identity & Motion',
    medium: 'Brand System · Kinetic Print & Digital',
    conceptLabel: 'Concept Campaign 04',
    description:
      'Grid-governed visual identity books, custom arrow geometry, and synchronized digital motion templates built for scale.',
    image: STUDIO_ASSETS.identitySystem,
    programType: 'brand-identity',
    aspect: 'portrait',
  },
  {
    id: 'motion-crt-matrix',
    index: '05',
    title: 'Broadcast Array — Spatial CRT Installation',
    category: 'Brand Films',
    medium: 'Multi-Screen Motion · Oscilloscope Loop',
    conceptLabel: 'Concept Campaign 05',
    description:
      'Synchronized multi-monitor visual loop combining vintage cathode-ray glass warmth with contemporary geometric motion graphics.',
    image: STUDIO_ASSETS.spatialScreens,
    programType: 'digital-experiences',
    aspect: 'landscape',
  },
  {
    id: 'motion-kinetic-type',
    index: '06',
    title: 'Velocity Type — Campaign Reel Sequence',
    category: 'Identity & Motion',
    medium: 'Procedural Motion · 60fps Loop',
    conceptLabel: 'Concept Campaign 06',
    description:
      'Real-time animated typography and modular directional vectors engineered for social reels and digital out-of-home displays.',
    image: STUDIO_ASSETS.brandFilm,
    programType: 'ai-marketing',
    aspect: 'landscape',
  },
];

export const STRATEGY_PILLARS: StrategyPillar[] = [
  {
    index: '01',
    title: 'Brand Research',
    summary:
      'Audit heritage, perception gaps, and category conventions to uncover what makes the brand genuinely defensible.',
    focus: 'Truth before aesthetic',
  },
  {
    index: '02',
    title: 'Audience Understanding',
    summary:
      'Map how real buyers discover, evaluate, and remember brands across high-noise digital environments.',
    focus: 'Behavioural clarity',
  },
  {
    index: '03',
    title: 'Competitor Analysis',
    summary:
      'Identify where every rival sounds and looks identical so your brand can occupy uncontested territory.',
    focus: 'White-space positioning',
  },
  {
    index: '04',
    title: 'Market Positioning',
    summary:
      'Distill a sharp commercial promise that separates your offering from interchangeable category noise.',
    focus: 'Category distinction',
  },
  {
    index: '05',
    title: 'Business Objectives',
    summary:
      'Anchor every creative decision to measurable commercial priorities, pipeline velocity, and brand equity.',
    focus: 'Commercial alignment',
  },
  {
    index: '06',
    title: 'Creative Direction',
    summary:
      'Translate strategic insight into an unmistakable visual language, tone, and multi-platform campaign system.',
    focus: 'Execution blueprint',
  },
];

export const GROWTH_CHANNELS: GrowthChannel[] = [
  {
    id: 'social',
    index: '01',
    title: 'Social Media',
    role: 'Cultural reach & recurring brand recall',
    outputs: ['Short-form video systems', 'Editorial feed architecture', 'Creator & launch sprints'],
  },
  {
    id: 'search',
    index: '02',
    title: 'Search Visibility',
    role: 'Capturing active, high-intent demand',
    outputs: ['Technical & content SEO', 'Search intent architecture', 'Landing page relevance'],
  },
  {
    id: 'advertising',
    index: '03',
    title: 'Digital Advertising',
    role: 'Precision media paired with sharp creative',
    outputs: ['Paid social & search creative', 'Structured creative iteration', 'Audience funnel sequencing'],
  },
  {
    id: 'websites',
    index: '04',
    title: 'Website Experiences',
    role: 'Turning attention into action and trust',
    outputs: ['Flagship brand platforms', 'Interactive product showcases', 'Speed & conversion UX'],
  },
  {
    id: 'engagement',
    index: '05',
    title: 'Audience Engagement',
    role: 'Sustaining attention beyond the first click',
    outputs: ['Interactive storytelling', 'Retention touchpoints', 'Community narrative arcs'],
  },
  {
    id: 'measurement',
    index: '06',
    title: 'Performance Measurement',
    role: 'Closing the loop between creative and impact',
    outputs: ['Attribution & funnel diagnostics', 'Creative resonance signals', 'Iterative refinement cycles'],
  },
];

export const EXPERIENCE_PLATFORMS = [
  {
    id: 'crt-broadcast',
    label: 'Broadcast & Film',
    deviceType: 'CRT Monitor',
    program: 'visual-stories' as const,
    caption: 'Hero film narratives engineered to stop rooms and anchor launches.',
  },
  {
    id: 'web-flagship',
    label: 'Interactive Web',
    deviceType: 'Widescreen Frame',
    program: 'digital-experiences' as const,
    caption: 'Fluid digital flagships that translate brand energy into interaction.',
  },
  {
    id: 'social-vertical',
    label: 'Social Feed',
    deviceType: 'Vertical Canvas',
    program: 'social-presence' as const,
    caption: 'Vertical motion sequences built for instant recognition on mobile.',
  },
  {
    id: 'search-commerce',
    label: 'Search & Growth',
    deviceType: 'Signal Display',
    program: 'search-growth' as const,
    caption: 'High-intent discovery pathways connecting curiosity to conversion.',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    number: '01',
    title: 'DISCOVER',
    tagline: 'Understand the brand and its opportunities.',
    detail:
      'Deep immersion into your product, audience psychology, competitive landscape, and untapped creative ground.',
  },
  {
    number: '02',
    title: 'STRATEGISE',
    tagline: 'Create a focused direction.',
    detail:
      'Define positioning, message hierarchy, channel roles, and a clear creative thesis before producing a single pixel.',
  },
  {
    number: '03',
    title: 'CREATE',
    tagline: 'Turn ideas into creative experiences.',
    detail:
      'Craft distinctive identity systems, films, photography, 3D visuals, and interactive web experiences built to stand apart.',
  },
  {
    number: '04',
    title: 'LAUNCH',
    tagline: 'Execute across the right platforms.',
    detail:
      'Deploy coordinated assets across web, search, paid media, and social channels with disciplined timing and polish.',
  },
  {
    number: '05',
    title: 'MEASURE',
    tagline: 'Understand performance.',
    detail:
      'Read audience behaviour, creative attention signals, and commercial conversion pathways without vanity noise.',
  },
  {
    number: '06',
    title: 'IMPROVE',
    tagline: 'Refine and move forward.',
    detail:
      'Feed real-world signal back into creative iteration so every campaign sharpens the brand over time.',
  },
];

export const CONTACT_DETAILS = {
  email: 'clickarrowcreative@gmail.com',
  phone: '+91 9110815727',
  whatsapp: '919110815727',
  studioLocation: 'India · Global Remote Studio',
  hours: 'Mon – Sat · 09:00 – 19:00 IST',
  socials: [
    { label: 'Instagram', handle: '@clickarrowstudio', href: '#contact-social-instagram' },
    { label: 'LinkedIn', handle: 'Click Arrow Agency', href: '#contact-social-linkedin' },
  ],
};
