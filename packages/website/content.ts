import { IconChecklist } from '@tabler/icons-react';
export const PageContent = {
  hero: {
    title: 'Get things done. Elevate your team.',
    eyeBrow: 'Project management software that actually helps to get things done.',
    description:
      'Zauberproject is the most sophisticated project management tool in the world. It is the only tool that you will ever need to manage your projects.',
    cta: [
      {
        label: 'Request a demo',
        link: '/#contact',
        variant: 'default',
        iconHandle: 'IconPlayerTrackNext',
      },
      {
        label: 'Get started for free',
        link: 'https://app.zauberstack.com/sign-up',
        variant: 'filled',
      },
    ],
  },
  logoCloud: {
    title: 'Trusted by these lovely companies',
    logos: [
      {
        alt: 'Random Corp',
        src: '/logos/logo06.svg',
      },
      {
        alt: 'Random Corp',
        src: '/logos/logo02.svg',
      },
      {
        alt: 'Random Corp',
        src: '/logos/logo03.svg',
      },
      {
        alt: 'Random Corp',
        src: '/logos/logo04.svg',
      },
      {
        alt: 'Random Corp',
        src: '/logos/logo05.svg',
      },
      {
        alt: 'Random Corp',
        src: '/logos/logo01.svg',
      },
    ],
  },
  features01: {
    title: 'The only work management platform where scalability is not a problem.',
    description: 'With Zauberproject you can set enterprise-wide goals, manage strategic planning, and get work done on a single platform.',
    features: [
      {
        title: 'More clarity and accountability.',
        description: 'Linking work to enterprise-wide goals ensures that all participants focus on truly important tasks and enables faster, better decision-making based on real-time data.',
        eyebrow: 'Better team management',
        media: {
          src: '/features/feature01.png',
          alt: 'Random Corp',
        },
        bulletPoints: [
          'Seamless Integration: Effortlessly connect tasks and projects to overarching company objectives for a cohesive workflow.',
          'Enhanced Focus: Facilitate concentration on critical tasks by aligning them with enterprise-wide goals, promoting efficiency and effectiveness.',
          'Real-time Data Insights: Enable quicker and informed decision-making through the utilization of real-time data, fostering a proactive approach to business management.',
        ],
      },
      {
        title: 'Reliable scaling',
        description: 'Connect teams and tools throughout your entire company with security, data management, and control mechanisms at the highest level.',
        eyebrow: 'Security as a priority',
        media: {
          src: '/features/feature01.png',
          alt: 'Random Corp',
        },
        bulletPoints: [
          'Reliable Scaling: Ensure dependable scalability by securely linking teams and tools throughout your entire organization.',
          'Advanced Security Measures: Implement top-notch security, data management, and control mechanisms to safeguard the integrity of your interconnected teams and tools.',
          'Elevated Data Governance: Uphold a high level of data governance by integrating robust security protocols and control mechanisms, fostering a secure and reliable interconnected environment.',
        ],
      },
      {
        title: 'A better workflow',
        description: 'Create custom workflows and automations, even without programming skills. It has never been easier to implement reliable, error-free processes in your company.',
        eyebrow: 'Get things done',
        media: {
          src: '/features/feature01.png',
          alt: 'Random Corp',
        },
        bulletPoints: [
          'Limitless Customization: Design workflows tailored to your specific needs without any restrictions, allowing for a highly personalized approach to automation.',
          'User-Friendly Automation: Easily create automated processes without the need for programming expertise, making workflow implementation accessible to everyone in the organization.',
          'Reliability and Precision: Ensure the introduction of dependable and error-free processes, promoting efficiency and accuracy in your business operations.',
        ],
      },
      {
        title: 'Cross-Tool Capture and Automation',
        description: 'Standardize the capture of work processes and seamlessly move them from one phase to the next. Automate as much as possible, even between different tools.',
        eyebrow: 'Faster and better',
        media: {
          src: '/features/feature01.png',
          alt: 'Random Corp',
        },
        bulletPoints: [
          'Centralized Process Monitoring: Gain a comprehensive overview of all your processes in a centralized location, facilitating a clear understanding of their effectiveness and allowing for immediate adjustments.',
          'Efficient Standardization: Standardize the capture of work processes, ensuring a consistent and streamlined approach that can be easily replicated across different phases.',
          'Seamless Cross-Tool Automation: Automate workflows seamlessly between various tools, promoting a cohesive and integrated working environment for enhanced efficiency.',
        ],
      }
    ]
  },
  features02: {
    title: 'Faster Progress with These Features',
    description: 'Create stress-free workflows so that teams can spend less time on coordination and more time on critical business tasks.',
    tabContent: [
      { content: "Yo Tab 1", iconHandle: "IconForms", name: 'Inputs', description: '20+ input components' },
      { content: "Tab 2", iconHandle: "IconForms", name: 'Forms', description: 'Better stuff for everyone' },
    ]
  },
  features03: {
    title: 'Faster progress with these features',
    description: 'Create stress-free workflows so that teams can spend less time on coordination and more time on critical business tasks.',
    features: [
      {
        title: 'Forms',
        description: 'Standardize work requests so that your team has all the essential information right from the beginning.',
        iconHandle: 'IconChecklist',
      },
      {
        title: 'Monitoring',
        description: 'Automate routine tasks to accomplish more work at a faster pace.',
        iconHandle: 'IconActivity',
      },
      {
        title: 'Reports',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
        iconHandle: 'IconPlayerTrackNext',
      },
      {
        title: 'Dashboards and Reports',
        description: 'Capture your team`s work status using real-time data.',
        iconHandle: 'IconChartPie',
      },
      {
        title: 'Resource Management',
        description: 'Gain the transparency you need to create accurate schedules, adjust workloads, and achieve your strategic goals.',
        iconHandle: 'IconZoomScan',
      },
      {
        title: 'Synchronization through a Central Hub',
        description: 'Ensure accountability by organizing projects and tasks in one place, providing an overview of upcoming work processes to achieve your goals.',
        iconHandle: 'IconRefresh',
      },
    ]
  },
  pricing01: {
    title: 'Organizing stuff can be so easy. Start today.',
    description: 'Use the advanced functinality of zauberproject. Start today. No credit card needed.',
    plans: [
      {
        planName: 'Free',
        planPrice: '0 EUR',
        planInterval: 'Month',
        planDescription: 'Take a look around. But don’t stay too long.',
        benefitsDescription: 'Only the features that make you want more.',
        benefits: [
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
        ],
        ctaLink: 'https://app.zauberstack.com/sign-up',
      },
      {
        planName: 'Pro',
        planPrice: '19 EUR',
        planInterval: 'Month',
        planDescription: 'The plan we actually want you to choose.',
        benefitsDescription: 'Features that actually make sense.',
        benefits: [
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
        ],
        ctaLink: 'https://app.zauberstack.com/sign-up',
      },
      {
        planName: 'Expert',
        planPrice: '49 EUR',
        planInterval: 'Month',
        planDescription: 'The plan for expert user. Do you dare?',
        benefitsDescription: 'Advanced features that make you smile. But only if you are an expert.',
        benefits: [
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
          { label: 'Few projects' },
        ],
        ctaLink: 'https://app.zauberstack.com/sign-up',
      },

    ]
  },

  testimonials01: {
    title: 'Over 60,000 teams are leveraging the zauber that is happening with zauberproject',
    description: 'Discover the impact our solutions have made through the experiences of our valued customers.',
    testimonials: [
      {
        author: {
          name: 'John Ranzen',
          image: '/testimonials/User01.png',
          company: 'Random Corp',
        },
        content: 'Zauberproject has been a game-changer for our team! It seamlessly organizes tasks and timelines, allowing us to collaborate effortlessly. Our productivity has skyrocketed since adopting this incredible app.',
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User02.png',
          company: 'Random Corp',
        },
        content: "I can't imagine managing projects without Zauberproject now. It's intuitive, user-friendly, and has completely transformed the way we work. Highly recommended!",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User03.png',
          company: 'Random Corp',
        },
        content: "Zauberproject is pure magic for project managers. It simplifies complex workflows, and its real-time updates keep everyone on the same page. Our projects are running smoother than ever.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User04.png',
          company: 'Random Corp',
        },
        content: "As a small business owner, Zauberproject has been a lifesaver. It's like having a virtual project manager. It's efficient, easy to use, and has boosted our team's overall performance.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User05.png',
          company: 'Random Corp',
        },
        content: "Zauberproject has exceeded our expectations. It's not just a project management app; it's a strategic tool that has empowered us to meet deadlines and exceed client expectations consistently.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User06.png',
          company: 'Random Corp',
        },
        content: "We've tried several project management apps, and Zauberproject stands out. Its customization options, coupled with its powerful features, have significantly improved our project planning and execution.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User07.png',
          company: 'Random Corp',
        },
        content: "Zauberproject is the secret ingredient to our project success. Its collaborative features have brought our team closer, and the real-time updates ensure everyone is aligned and focused.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User08.png',
          company: 'Random Corp',
        },
        content: "In the fast-paced world of marketing, Zauberproject keeps us ahead of the game. It's incredibly adaptive, making it easy to manage multiple campaigns simultaneously. A true gem for project management.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User09.png',
          company: 'Random Corp',
        },
        content: "Switching to Zauberproject was a decision we'll never regret. The visual project timelines and intuitive interface make it easy to keep our team on track, resulting in consistently successful deliveries.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User10.png',
          company: 'Random Corp',
        },
        content: "Zauberproject has made project management a breeze for our remote team. It's user-friendly, promotes accountability, and ensures that everyone stays connected, no matter where they are.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User11.png',
          company: 'Random Corp',
        },
        content: "We were drowning in spreadsheets before Zauberproject came along.Now, our project data is organized, accessible, and presented in a visually appealing way.It's a project manager's dream.",
      },
      {
        author: {
          name: 'John Doe',
          image: '/testimonials/User12.png',
          company: 'Random Corp',
        },
        content: "Zauberproject doesn't just manage projects; it elevates them. Our project outcomes have become more predictable, deadlines are met with ease, and the stress of project management has become a thing of the past.",
      },
    ]
  },
  faq01: {
    title: 'FAQ',

    faqs: [
      {
        title: "How can Zauberproject benefit my team's collaboration?",
        content: 'Zauberproject enhances collaboration by providing a centralized platform where team members can easily share updates, collaborate on tasks, and have real-time visibility into project progress.',
      },
      {
        title: "Is Zauberproject suitable for small businesses with limited resources?",
        content: 'Absolutely! Zauberproject is designed to be scalable and adaptable, making it an ideal choice for small businesses. It offers powerful project management features without overwhelming complexity.',
      },
      {
        title: "Can Zauberproject integrate with other tools we are currently using?",
        content: 'Yes, Zauberproject supports seamless integration with various third-party tools. This ensures that your team can continue using the tools they`re familiar with while leveraging the enhanced capabilities of Zauberproject.',
      },
      {
        title: "How does Zauberproject prioritize security for sensitive project data?",
        content: 'Security is a top priority for Zauberproject. We employ industry-standard encryption protocols and robust security measures to safeguard your project data, ensuring confidentiality and integrity.',
      },
      {
        title: "Is there training required to use Zauberproject effectively?",
        content: 'Zauberproject is designed with user-friendliness in mind. While we provide resources for users to get started, the intuitive interface minimizes the learning curve. Most users find themselves comfortably navigating the app in no time.',
      },

    ]
  },

  contact01: {
    title: 'Let´s get this thing started',
    description: 'We´ll answer within the next 48 hours!',
    image: {
      alt: 'Random Corp',
      src: '/faq/faq01.png',
    }
  },
  footer01: {
    brandclaim: 'Zauberweb is the most sophisticated project management tool in the world. It is the only tool that you will ever need to manage your projects.',
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About', link: '/about' },
          { label: 'Blog', link: '/blog' },
          { label: 'Careers', link: '/careers' },
          { label: 'Contact', link: '/contact' },
        ]
      },
      {
        title: 'Product',
        links: [
          { label: 'Features', link: '/features' },
          { label: 'Pricing', link: '/pricing' },
          { label: 'Security', link: '/security' },
          { label: 'Terms', link: '/terms' },
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Terms', link: '/terms' },
          { label: 'Privacy', link: '/privacy' },
          { label: 'Cookies', link: '/cookies' },
        ]
      },
    ]
  }


};
