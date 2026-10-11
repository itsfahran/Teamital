/** Copy for /white-label-program (taken from the approved page document). */
export type Tone = 'blue' | 'violet' | 'green' | 'amber' | 'rose' | 'sky';

export type IconCard = { icon: string; title: string; text: string; tone?: Tone };

export const WL = {
  hero: {
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
        ['Dashboard', 'View workforce statistics, including employee attendance, present and absent staff, late arrivals, and leave information.'],
        ['Employees', 'Add, manage, and update employee profiles, employment details, and workforce records.'],
        ['Attendance', 'Monitor employee clock-in/out records, attendance status, and working hours.'],
        ['Departments', 'Create and manage departments to organize employees across different teams.'],
        ['Leave', 'Review employee leave requests, approve or reject applications, and manage leave records.'],
        ['Locations', 'Manage office locations, GPS tracking, and location-based attendance settings.'],
        ['Reports', 'Generate workforce reports, review attendance data, and export information in PDF, Excel, or CSV formats.'],
        ['Projects & Tasks', 'Create projects, assign tasks, and monitor employee responsibilities and progress.'],
        ['Help & Support', 'Access assistance and support for workforce management activities.'],
        ['Subscription', "View and manage the company's software subscription."],
        ['Notifications', 'Receive updates about attendance, leave requests, tasks, and other workforce activities.'],
        ['Community & AI', 'Access community features and use AI-powered assistance to manage supported workforce activities through simple prompts.'],
      ] as Array<[string, string]>,
    },
    employee: {
      title: 'Employee Profile – Manage Daily Work Activities From One Place',
      text: 'Provide employees with a simple, user-friendly dashboard where they can manage attendance, view assigned tasks, check work schedules, request leave, and stay connected with their company.',
      label: 'Employee Features:',
      features: [
        ['Dashboard', 'Access an overview of daily work activities, attendance information, assigned tasks, and important updates.'],
        ['Clock In/Out', 'Record work attendance using supported verification methods, including facial recognition, device biometrics, and PIN.'],
        ['Tasks', 'View assigned tasks, track responsibilities, and update task progress.'],
        ['Notifications', 'Receive updates about assigned tasks, attendance, leave requests, and company activities.'],
        ['Community & AI', 'Access community features and use AI-powered assistance for supported workforce activities.'],
        ['Leave', 'Submit leave requests, check approval status, and view available leave balances.'],
        ['Work Summary', 'Review working hours, attendance history, and daily or weekly work information.'],
        ['Help & Support', 'Access help and assistance when needed.'],
        ['Shift Schedules', 'View assigned shifts, working schedules, and roster information.'],
      ] as Array<[string, string]>,
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
      ['Step 1: Schedule a Demo', 'Connect with our team to explore the White Label platform, partner features, and business opportunities.'],
      ['Step 2: Finalize Your Partnership', 'Discuss your requirements, review the fixed monthly or yearly platform fee, and complete your partnership agreement.'],
      ['Step 3: Customize Your Platform', 'Our team helps set up your White Label platform with your business name, logo, brand colors, and custom domain.'],
      ['Step 4: Create Your Subscription Plans', 'Build custom subscription packages and set your own customer pricing.'],
      ['Step 5: Add Your Customers', 'Start adding customer companies, managing users, and offering your workforce management software.'],
      ['Step 6: Grow Your SaaS Business', 'Manage companies, subscriptions, and revenue through your Partner Portal while expanding your customer base, with ongoing technical support from Teamital.'],
    ] as Array<[string, string]>,
  },

  faq: {
    title: 'Frequently Asked Questions',
    items: [
      ['What is White Label Workforce Management Software?', 'White Label Workforce Management Software is an existing software solution that businesses can offer under their own brand. Teamital allows partners to customize branding, manage customers, create subscription plans, and offer workforce management tools without developing software from scratch.'],
      ['Can I start my own SaaS business with Teamital?', "Yes. Teamital's White Label program allows you to launch a branded workforce management software business, manage customer companies, and offer your own subscription packages."],
      ['Can I use my own business name, logo, and domain?', 'Yes. You can customize the platform with your business name, logo, brand colors, and custom domain. Teamital also helps with the initial platform setup.'],
      ['Can I set my own subscription prices?', 'Yes. White Label Partners have complete control over the prices they charge customers.'],
      ['How does Teamital White Label pricing work?', 'Partners pay Teamital a fixed monthly or yearly platform fee. Contact our team for partnership pricing details.'],
      ['Who collects subscription payments from customers?', 'White Label Partners collect customer payments directly and manage their own billing relationships.'],
      ['Can I manage multiple companies from one account?', 'Yes. Teamital provides a dedicated Partner Portal where you can add and manage multiple customer companies.'],
      ['Does Teamital offer AI-powered workforce management?', 'Yes. Teamital includes Community & AI features that allow users to interact with AI and manage supported workforce activities using prompts.'],
      ['Do I need to develop or maintain the software myself?', "You don't need to develop the underlying platform. Teamital provides the software, assists with setup, and offers 24/7 technical support. Partners manage their customers and provide customer-facing support."],
      ['Which platforms does Teamital support?', 'Teamital supports Web, Android, iOS, and Windows. White Label branding capabilities may differ between the web platform and applications.'],
      ['How can I become a White Label Partner?', 'Schedule a demo, discuss your requirements, finalize the partnership agreement, and work with our team to configure your White Label account before onboarding customers.'],
    ] as Array<[string, string]>,
  },
};
