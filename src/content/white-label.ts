/** Copy for /white-label-program (taken from the approved page document). */
export type Tone = 'blue' | 'violet' | 'green' | 'amber' | 'rose' | 'sky';

export type IconCard = { icon: string; title: string; text: string; tone?: Tone };

export const WL = {
  seo: {
    title: 'White Label Workforce Management Software | Teamital',
    description: 'Launch your own SaaS business with Teamital white label workforce management software: your brand, your pricing, your customers.',
  },

  hero: {
    pill: 'White Label Program',
    image: '',
    trust: ['Your name, logo and domain', 'Your own pricing', '24/7 technical support'],
    title: 'Launch Your SaaS Business With Our White Label Workforce Management Software',
    tagline: 'Our Platform. Your Brand. Your Business.',
    text: "Launch your own SaaS business with Teamital's ready-to-use White Label Workforce Management Software. Customize the platform with your brand name, logo, colors, and custom domain. Create your own subscription plans, set your prices, manage multiple customer companies, and build recurring revenue without developing software from scratch.",
    primary: 'Become a White Label Partner',
    secondary: 'Schedule a Demo',
  },

  build: {
    title: 'Build Your Own Software Brand With Teamital White Label',
    paragraphs: [
      "Teamital is a complete workforce management software solution designed to help businesses manage their employees and daily operations from a single dashboard. Our platform includes employee clock-in/out, task management, notifications, Community & AI, leave management, work summaries, help and support, shift scheduling, and roster creation. With AI-powered features, businesses can also manage supported workforce activities through simple prompts.",
      "Available on Android, iOS, Windows, and Web, Teamital allows businesses to manage their workforce across multiple devices.",
      "Through our White Label program, you can offer Teamital's workforce management technology under your own brand. Use your business name, logo, brand colors, website, and custom domain to launch and market your own software solution without developing it from scratch. Our team handles the platform setup and provides 24/7 technical support, allowing you to focus on attracting customers, managing subscriptions, and growing your SaaS business.",
    ],
    pillars: [
      {
        icon: 'palette',
        tone: 'blue',
        title: 'Your Brand. Your Identity.',
        text: 'Customize the platform with your business name, logo, colors, and custom domain to create a professional branded experience for your customers.',
      },
      {
        icon: 'groups',
        tone: 'violet',
        title: 'Your Customers. Your Control.',
        text: 'Manage multiple customer companies and their users through a centralized White Label Partner Portal while maintaining direct customer relationships.',
      },
      {
        icon: 'payments',
        tone: 'green',
        title: 'Your Pricing. Your Revenue.',
        text: 'Create your own subscription packages, set your own prices, and collect payments directly from your customers while paying Teamital a fixed monthly or yearly platform fee.',
      },
    ] as IconCard[],
  },

  why: {
    title: 'Why Choose Our White Label Workforce Management Software?',
    intro:
      "Starting a SaaS business doesn't have to involve building software from the ground up. Teamital gives you an existing workforce management platform and dedicated partner management tools to help you launch and grow your own software brand.",
    cta: 'Book 1:1 Demo for White Label Program',
    cards: [
      { icon: 'rocket_launch', tone: 'blue', title: 'Launch Without Software Development', text: "Save the time and resources required to develop a workforce management platform from scratch. Start with Teamital's existing software and focus on your business." },
      { icon: 'verified', tone: 'violet', title: 'Create Your Own Software Brand', text: 'Offer workforce management software with your business name, logo, brand colors, and custom domain.' },
      { icon: 'autorenew', tone: 'green', title: 'Build Recurring Revenue', text: 'Create monthly or yearly subscription packages for your customers and develop a recurring-revenue business model.' },
      { icon: 'sell', tone: 'amber', title: 'Set Your Own Pricing', text: 'Choose the subscription prices you charge your customers and build packages based on their workforce management needs.' },
      { icon: 'apartment', tone: 'sky', title: 'Manage Multiple Customer Companies', text: 'Add and manage multiple companies, users, and subscriptions from one White Label Partner Portal.' },
      { icon: 'trending_up', tone: 'rose', title: 'Expand Your Existing Business', text: 'Introduce branded workforce management software alongside your current HR, payroll, IT, consulting, or software services.' },
      { icon: 'insights', tone: 'blue', title: 'Monitor Revenue & Business Performance', text: 'Use the Revenue Analytics section to review financial information and understand your business performance.' },
      { icon: 'support_agent', tone: 'green', title: 'Get 24/7 Technical Support From Teamital', text: 'Focus on managing customers and growing your brand while Teamital provides round-the-clock technical support for the underlying software.' },
    ] as IconCard[],
  },

  portal: {
    navTitle: 'In this portal',
    title: 'Complete White Label Partner Portal to Manage Your SaaS Business',
    intro:
      'Manage your White Label software business from one centralized platform. Teamital provides dedicated tools to help you manage customer companies, users, subscription packages, branding, and revenue.',
    items: [
      { icon: 'dashboard', title: 'Dashboard', text: 'Access an overview of your White Label business and manage important activities from one dashboard.' },
      { icon: 'domain', title: 'Companies', text: 'Add, manage, and remove customer companies while keeping their business accounts organized in one place.' },
      { icon: 'manage_accounts', title: 'User Management', text: 'Manage users across customer companies, including company accounts and employee profiles.' },
      { icon: 'query_stats', title: 'Revenue Analytics', text: 'Monitor revenue information and analyze the financial performance of your White Label software business.' },
      { icon: 'workspace_premium', title: 'Subscription Plans', text: "Create and manage your own subscription packages, define pricing, and offer plans based on your customers' requirements." },
      { icon: 'brush', title: 'Branding', text: 'Customize your White Label platform with your business name, logo, and brand colors.' },
      { icon: 'language', title: 'Custom Domain', text: 'Connect your own domain and provide customers with a branded web address to access the platform.' },
      { icon: 'headset_mic', title: 'Support', text: 'Access 24/7 technical support from Teamital while managing customer service directly.' },
      { icon: 'tune', title: 'Partner Settings', text: 'Manage your partner account information and available platform settings from one place.' },
    ] as IconCard[],
  },

  solutions: {
    title: 'Teamital Offers Complete Workforce Management Solutions Under Your Brand',
    intro:
      'Through Teamital\'s White Label platform, you can offer your customers a complete workforce management solution under your own brand. Businesses can manage employees, attendance, departments, locations, projects, tasks, and daily operations from a centralized dashboard, while employees can track working hours, manage tasks, request leave, and view their schedules.',
    admin: {
      title: 'Company Admin Profile – Complete Workforce Management From One Dashboard',
      text: 'Give businesses a centralized dashboard to manage employees, monitor attendance, organize departments, assign tasks, track locations, and oversee daily workforce operations.',
      label: 'Company Admin Features:',
      features: [
        { title: 'Dashboard', text: 'View workforce statistics, including employee attendance, present and absent staff, late arrivals, and leave information.' },
        { title: 'Employees', text: 'Add, manage, and update employee profiles, employment details, and workforce records.' },
        { title: 'Attendance', text: 'Monitor employee clock-in/out records, attendance status, and working hours.' },
        { title: 'Departments', text: 'Create and manage departments to organize employees across different teams.' },
        { title: 'Leave', text: 'Review employee leave requests, approve or reject applications, and manage leave records.' },
        { title: 'Locations', text: 'Manage office locations, GPS tracking, and location-based attendance settings.' },
        { title: 'Reports', text: 'Generate workforce reports, review attendance data, and export information in PDF, Excel, or CSV formats.' },
        { title: 'Projects & Tasks', text: 'Create projects, assign tasks, and monitor employee responsibilities and progress.' },
        { title: 'Help & Support', text: 'Access assistance and support for workforce management activities.' },
        { title: 'Subscription', text: "View and manage the company's software subscription." },
        { title: 'Notifications', text: 'Receive updates about attendance, leave requests, tasks, and other workforce activities.' },
        { title: 'Community & AI', text: 'Access community features and use AI-powered assistance to manage supported workforce activities through simple prompts.' },
      ],
    },
    employee: {
      title: 'Employee Profile – Manage Daily Work Activities From One Place',
      text: 'Provide employees with a simple, user-friendly dashboard where they can manage attendance, view assigned tasks, check work schedules, request leave, and stay connected with their company.',
      label: 'Employee Features:',
      features: [
        { title: 'Dashboard', text: 'Access an overview of daily work activities, attendance information, assigned tasks, and important updates.' },
        { title: 'Clock In/Out', text: 'Record work attendance using supported verification methods, including facial recognition, device biometrics, and PIN.' },
        { title: 'Tasks', text: 'View assigned tasks, track responsibilities, and update task progress.' },
        { title: 'Notifications', text: 'Receive updates about assigned tasks, attendance, leave requests, and company activities.' },
        { title: 'Community & AI', text: 'Access community features and use AI-powered assistance for supported workforce activities.' },
        { title: 'Leave', text: 'Submit leave requests, check approval status, and view available leave balances.' },
        { title: 'Work Summary', text: 'Review working hours, attendance history, and daily or weekly work information.' },
        { title: 'Help & Support', text: 'Access help and assistance when needed.' },
        { title: 'Shift Schedules', text: 'View assigned shifts, working schedules, and roster information.' },
      ],
    },
    oneTitle: 'One Platform for Companies and Employees',
    onePara: [
      'Teamital connects company administrators and employees through one workforce management platform. Administrators can oversee their teams and business operations, while employees can manage their daily work activities through their own profiles.',
      'Available on Android, iOS, Windows, and Web, Teamital helps businesses manage their workforce across multiple devices.',
      'Through our White Label program, you can offer these workforce management features under your own brand, using your business name, logo, colors, and custom domain.',
    ],
  },

  who: {
    title: 'Who Can Start a SaaS Business With Teamital White Label Program?',
    intro:
      'Our White Label Workforce Management Software is suitable for entrepreneurs, agencies, and service providers looking to introduce their own software solutions without developing a new platform.',
    cards: [
      { icon: 'lightbulb', tone: 'amber', title: 'SaaS Entrepreneurs & Startups', text: 'Launch a subscription-based workforce management software business with your own brand and pricing strategy.' },
      { icon: 'code', tone: 'blue', title: 'IT Companies & Software Agencies', text: 'Expand your software portfolio by offering workforce management technology to existing and new customers.' },
      { icon: 'receipt_long', tone: 'green', title: 'HR & Payroll Service Providers', text: 'Add employee attendance, leave management, scheduling, and workforce tracking to your service offerings.' },
      { icon: 'person_search', tone: 'violet', title: 'Staffing & Recruitment Agencies', text: 'Offer workforce management tools to companies that need help organizing employee activities and schedules.' },
      { icon: 'business_center', tone: 'sky', title: 'Business Consultants', text: 'Provide clients with a branded workforce management solution alongside your consulting services.' },
      { icon: 'storefront', tone: 'rose', title: 'Software Resellers', text: 'Build a subscription-based software offering with your own branding and customer pricing.' },
    ] as IconCard[],
  },

  launch: {
    title: 'How to Launch Your White Label SaaS Business With Teamital',
    intro: 'Get started with a straightforward partnership process and launch your branded workforce management platform.',
    cta: 'Schedule Your White Label Demo',
    steps: [
      { title: 'Schedule a Demo', text: 'Connect with our team to explore the White Label platform, partner features, and business opportunities.' },
      { title: 'Finalize Your Partnership', text: 'Discuss your requirements, review the fixed monthly or yearly platform fee, and complete your partnership agreement.' },
      { title: 'Customize Your Platform', text: 'Our team helps set up your White Label platform with your business name, logo, brand colors, and custom domain.' },
      { title: 'Create Your Subscription Plans', text: 'Build custom subscription packages and set your own customer pricing.' },
      { title: 'Add Your Customers', text: 'Start adding customer companies, managing users, and offering your workforce management software.' },
      { title: 'Grow Your SaaS Business', text: 'Manage companies, subscriptions, and revenue through your Partner Portal while expanding your customer base, with ongoing technical support from Teamital.' },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'What is White Label Workforce Management Software?', a: 'White Label Workforce Management Software is an existing software solution that businesses can offer under their own brand. Teamital allows partners to customize branding, manage customers, create subscription plans, and offer workforce management tools without developing software from scratch.' },
      { q: 'Can I start my own SaaS business with Teamital?', a: "Yes. Teamital's White Label program allows you to launch a branded workforce management software business, manage customer companies, and offer your own subscription packages." },
      { q: 'Can I use my own business name, logo, and domain?', a: 'Yes. You can customize the platform with your business name, logo, brand colors, and custom domain. Teamital also helps with the initial platform setup.' },
      { q: 'Can I set my own subscription prices?', a: 'Yes. White Label Partners have complete control over the prices they charge customers.' },
      { q: 'How does Teamital White Label pricing work?', a: 'Partners pay Teamital a fixed monthly or yearly platform fee. Contact our team for partnership pricing details.' },
      { q: 'Who collects subscription payments from customers?', a: 'White Label Partners collect customer payments directly and manage their own billing relationships.' },
      { q: 'Can I manage multiple companies from one account?', a: 'Yes. Teamital provides a dedicated Partner Portal where you can add and manage multiple customer companies.' },
      { q: 'Does Teamital offer AI-powered workforce management?', a: 'Yes. Teamital includes Community & AI features that allow users to interact with AI and manage supported workforce activities using prompts.' },
      { q: 'Do I need to develop or maintain the software myself?', a: "You don't need to develop the underlying platform. Teamital provides the software, assists with setup, and offers 24/7 technical support. Partners manage their customers and provide customer-facing support." },
      { q: 'Which platforms does Teamital support?', a: 'Teamital supports Web, Android, iOS, and Windows. White Label branding capabilities may differ between the web platform and applications.' },
      { q: 'How can I become a White Label Partner?', a: 'Schedule a demo, discuss your requirements, finalize the partnership agreement, and work with our team to configure your White Label account before onboarding customers.' },
    ],
  },

  labels: {
    profileHint: 'Hover to see features',
    profileHintActive: 'Features shown on the right',
    featuresWord: 'features',
    featuresIncluded: 'features included',
  },

  packages: {
    title: 'White Label Packages',
    intro: 'Pick Monthly or Yearly: a one-time setup fee plus a simple recurring cost to run Teamital under your own brand.',
    monthlyTab: 'Monthly',
    yearlyTab: '1 Year',
    cta: 'Become a partner',
    monthly: [
      { name: 'Monthly License', price: '€1,000', unit: '/month', features: ['Up to 10 Companies', 'Up to 1,000 Employees'] },
      { name: 'Monthly Usage-Based', price: '€500', unit: '/One-time Setup Fee', features: ['50% OFF all packages listed on Teamital’s official website price list', 'Pay according to the packages selected'] },
    ],
    yearly: [
      { name: 'Yearly License', price: '€5,000', unit: '/year', features: ['Up to 50 Companies', 'Up to 2,000 Employees'] },
      { name: 'Yearly Usage-Based', price: '€500', unit: '/One-time Setup Fee', features: ['60% OFF all packages listed on Teamital’s official website price list', 'Pay according to the packages selected'] },
    ],
  },

  final: {
    title: 'Our Platform. Your Brand. Your Business.',
    text: 'Talk to our team and see the White Label Partner Portal in action.',
  },
};

export type WLContent = typeof WL;
export const WL_PAGE_KEY = 'white-label';
