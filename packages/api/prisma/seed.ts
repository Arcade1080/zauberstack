import { PrismaClient, ProgressStatus } from '@prisma/client';

// Create the stripe customer in stripe dashboard first
const STIPE_DEMO_CUSTOMER_ID = 'cus_QENjXJz8RXDrWr';
const ADMIN_USER_EMAIL = 'admin@zauberstack.com';

const demoPendingInviations = [
  {
    email: 'karl.spencer@gmail.com',
    role: 'author',
  },
  {
    email: 'cary.knowles@gmx.com',
    role: 'author',
  },
  {
    email: 'ron.carlson@gmail.com',
    role: 'author',
  },
  {
    email: 'jim.smith@gmail.com',
    role: 'author',
  },
];

const demoUsersWithTasksAndTags = [
  {
    base: {
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'alice@zauberstack.com',
      avatar: 'User19.png',
    },
    tasks: [
      {
        title: 'Meeting with Client',
        description:
          'Schedule and conduct a meeting with the client to discuss project requirements.',
        status: 'open',
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        tags: [
          {
            name: 'Client Meeting',
          },
          {
            name: 'Priority',
          },
        ],
      },
      {
        title: 'Create Project Proposal',
        description:
          'Draft a comprehensive project proposal outlining timelines, milestones, and deliverables.',
        status: 'done',
        tags: [
          {
            name: 'Proposal',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Bob',
      lastname: 'Smith',
      email: 'bob@zauberstack.com',
      avatar: 'User01.png',
    },
    tasks: [
      {
        title: 'Research Market Trends',
        description:
          'Conduct market research to identify current trends and competitor strategies.',
        status: 'done',
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        tags: [
          {
            name: 'Market Research',
          },
          {
            name: 'Analysis',
          },
        ],
      },
      {
        title: 'Prepare Sales Presentation',
        description:
          'Create a compelling sales presentation highlighting key product features and benefits.',
        status: 'open',
        tags: [
          {
            name: 'Sales',
          },
          {
            name: 'Presentation',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Charlie',
      lastname: 'Williams',
      email: 'charlie@zauberstack.com',
      avatar: 'User02.png',
    },
    tasks: [
      {
        title: 'Coordinate Team Workshop',
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        description:
          'Organize a team workshop to enhance collaboration and communication.',
        status: 'open',
        tags: [
          {
            name: 'Team Building',
          },
          {
            name: 'Workshop',
          },
        ],
      },
      {
        title: 'Review Project Milestones',
        description:
          'Review and update project milestones based on recent developments.',
        status: 'done',
        tags: [
          {
            name: 'Project Management',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'David',
      lastname: 'Miller',
      email: 'david@zauberstack.com',
      avatar: 'User03.png',
    },
    tasks: [
      {
        title: 'Code Review',
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        description:
          "Conduct a code review for User04's latest software implementation.",
        status: 'open',
        tags: [
          {
            name: 'Code Review',
          },
          {
            name: 'Development',
          },
        ],
      },
      {
        title: 'Bug Fixing',
        description: 'Address and fix reported bugs in the software.',
        status: 'done',
        tags: [
          {
            name: 'Bug Fix',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Emily',
      lastname: 'Jones',
      email: 'emily@zauberstack.com',
      avatar: 'User20.png',
    },
    tasks: [
      {
        title: 'Social Media Campaign',
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        description:
          "Launch a social media campaign to promote User05's latest product release.",
        status: 'done',
        tags: [
          {
            name: 'Marketing',
          },
          {
            name: 'Social Media',
          },
        ],
      },
      {
        title: 'Customer Feedback Analysis',
        description: 'Analyze customer feedback for insights and improvements.',
        status: 'done',
        tags: [
          {
            name: 'Analysis',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Frank',
      lastname: 'Taylor',
      email: 'frank@zauberstack.com',
      avatar: 'User04.png',
    },
    tasks: [
      {
        title: 'User Interface Design',
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        description:
          "Design a user-friendly interface for User06's new mobile application.",
        status: 'open',
        tags: [
          {
            name: 'UI/UX',
          },
          {
            name: 'Design',
          },
        ],
      },
      {
        title: 'Mobile App Development',
        description:
          'Initiate the development phase for the mobile application.',
        status: 'open',
        tags: [
          {
            name: 'Development',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Grace',
      lastname: 'Harrison',
      email: 'grace@zauberstack.com',
      avatar: 'User21.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Content Creation',
        description:
          "Create engaging content for User07's blog to increase online visibility.",
        status: 'done',
        tags: [
          {
            name: 'Content Creation',
          },
          {
            name: 'Blogging',
          },
        ],
      },
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'SEO Optimization',
        description:
          'Optimize website content for improved search engine rankings.',
        status: 'open',
        tags: [
          {
            name: 'SEO',
          },
          {
            name: 'Optimization',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Henry',
      lastname: 'Clark',
      email: 'henry@zauberstack.com',
      avatar: 'User05.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Financial Report',
        description:
          "Generate a comprehensive financial report for User08's business analysis.",
        status: 'open',
        tags: [
          {
            name: 'Finance',
          },
          {
            name: 'Analysis',
          },
        ],
      },
      {
        title: 'Budget Planning',
        description:
          'Plan and allocate budgets for upcoming projects and initiatives.',
        status: 'done',
        tags: [
          {
            name: 'Budgeting',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Ivy',
      lastname: 'Adams',
      email: 'ivy@zauberstack.com',
      avatar: 'User22.png',
    },
    tasks: [
      {
        title: 'Training Workshop',
        description:
          "Organize a training workshop for User09's team to enhance skills and knowledge.",
        status: 'open',
        tags: [
          {
            name: 'Training',
          },
          {
            name: 'Workshop',
          },
        ],
      },
      {
        title: 'Performance Evaluation',
        description: 'Conduct performance evaluations for team members.',
        status: 'done',
        tags: [
          {
            name: 'Performance',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Jack',
      lastname: 'Evans',
      email: 'jack@zauberstack.com',
      avatar: 'User06.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Product Launch Event',
        description:
          "Plan and execute a successful product launch event for User10's new product.",
        status: 'open',
        tags: [
          {
            name: 'Event Planning',
          },
          {
            name: 'Product Launch',
          },
        ],
      },
      {
        title: 'Media Outreach',
        description:
          'Reach out to media outlets to secure coverage for the product launch.',
        status: 'open',
        tags: [
          {
            name: 'Media Relations',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Katherine',
      lastname: 'Turner',
      email: 'katherine@zauberstack.com',
      avatar: 'User23.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Software Testing',
        description:
          "Perform thorough testing of User11's software to identify and fix any bugs.",
        status: 'done',
        tags: [
          {
            name: 'Testing',
          },
          {
            name: 'Quality Assurance',
          },
        ],
      },
      {
        title: 'Documentation Update',
        description:
          'Update project documentation to reflect recent changes and improvements.',
        status: 'open',
        tags: [
          {
            name: 'Documentation',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Leo',
      lastname: 'Carter',
      email: 'leo@zauberstack.com',
      avatar: 'User07.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Client Presentation',
        description:
          "Prepare and deliver a presentation to showcase User12's services to potential clients.",
        status: 'open',
        tags: [
          {
            name: 'Presentation',
          },
          {
            name: 'Client Relations',
          },
        ],
      },
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Negotiation Session',
        description:
          'Participate in a negotiation session with a potential business partner.',
        status: 'done',
        tags: [
          {
            name: 'Negotiation',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Mia',
      lastname: 'Foster',
      email: 'mia@zauberstack.com',
      avatar: 'User24.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Social Impact Initiative',
        description:
          "Initiate a social impact initiative for User13's community engagement.",
        status: 'open',
        tags: [
          {
            name: 'Community',
          },
          {
            name: 'Social Impact',
          },
        ],
      },
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Volunteer Recruitment',
        description: 'Recruit volunteers for upcoming community events.',
        status: 'done',
        tags: [
          {
            name: 'Volunteerism',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Noah',
      lastname: 'Baker',
      email: 'noah@zauberstack.com',
      avatar: 'User08.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'User Feedback Survey',
        description:
          "Create and distribute a user feedback survey for User14's product improvement.",
        status: 'open',
        tags: [
          {
            name: 'User Feedback',
          },
          {
            name: 'Survey',
          },
        ],
      },
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Implement Feedback Changes',
        description:
          'Implement changes based on user feedback received from the survey.',
        status: 'open',
        tags: [
          {
            name: 'Implementation',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Olivia',
      lastname: 'Parker',
      email: 'olivia@zauberstack.com',
      avatar: 'User25.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Product Photography',
        description: "Coordinate a photoshoot for User15's new product line.",
        status: 'done',
        tags: [
          {
            name: 'Photography',
          },
          {
            name: 'Product Launch',
          },
        ],
      },
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Social Media Promotion',
        description:
          'Promote product photos on social media platforms for increased visibility.',
        status: 'open',
        tags: [
          {
            name: 'Social Media',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Preston',
      lastname: 'Cooper',
      email: 'preston@zauberstack.com',
      avatar: 'User09.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Data Analysis',
        description:
          "Conduct data analysis to identify trends and insights for User16's business strategy.",
        status: 'done',
        tags: [
          {
            name: 'Data Analysis',
          },
          {
            name: 'Business Strategy',
          },
        ],
      },
      {
        title: 'Report Presentation',
        description:
          'Create a presentation to communicate data analysis findings to stakeholders.',
        status: 'open',
        tags: [
          {
            name: 'Presentation',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Quinn',
      lastname: 'Davis',
      email: 'quinn@zauberstack.com',
      avatar: 'User10.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Employee Training Program',
        description:
          "Develop a comprehensive training program for User17's company employees.",
        status: 'open',
        tags: [
          {
            name: 'Training',
          },
          {
            name: 'Employee Development',
          },
        ],
      },
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Training Session',
        description:
          'Conduct a training session on the new employee training program.',
        status: 'done',
        tags: [
          {
            name: 'Training',
          },
        ],
      },
    ],
  },
  {
    base: {
      firstname: 'Riley',
      lastname: 'Morgan',
      email: 'riley@zauberstack.com',
      avatar: 'User26.png',
    },
    tasks: [
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Website Redesign',
        description:
          'Redesign website for a modern and user-friendly appearance.',
        status: 'done',
        tags: [
          {
            name: 'Web Design',
          },
          {
            name: 'Redesign',
          },
        ],
      },
      {
        createdAt: new Date(
          new Date().setMonth(
            new Date().getMonth() - Math.floor(Math.random() * 6),
          ),
        ).toISOString(),
        title: 'Content Migration',
        description: 'Migrate existing content to the redesigned website.',
        status: 'done',
        tags: [
          {
            name: 'Content Migration',
          },
        ],
      },
    ],
  },
];

const prisma = new PrismaClient();

export const ROLES = ['admin', 'author'];

export const PERMISSIONS = {
  admin: [
    'manage-organization',
    'manage-subscriptions',
    'create-tags',
    'read-tags',
    'update-tags',
    'delete-tags',
    'create-tasks',
    'read-tasks',
    'update-tasks',
    'delete-tasks',
    'edit-users',
    'invite-users',
    'edit-account',
    'delete-account',
    'read-subscriptions',
    'edit-subscriptions',
    'upload-media',
    'view-media',
    'delete-media',
  ],
  author: [
    'create-tags',
    'read-tags',
    'update-tags',
    'delete-tags',
    'create-tasks',
    'read-tasks',
    'update-tasks',
    'delete-tasks',
    'view-media',
  ],
};

async function wipeDatabase() {
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.media.deleteMany();
  await prisma.account.deleteMany();
  await prisma.task.deleteMany();
  await prisma.tag.deleteMany();

  console.log(`Wiped db`);
}

async function seedRolesAndPermissions() {
  for (const roleName of ROLES) {
    const role = await prisma.role.create({
      data: {
        name: roleName,
        permissions: {
          // @ts-ignore
          create: PERMISSIONS[roleName].map((permission: any) => ({
            name: permission,
          })),
        },
      },
    });
    console.log(`Role "${role.name}" seeded.`);
  }
}

async function createAuthorWithAccount() {
  const authorRole = await prisma.role.findUnique({
    where: { name: 'author' },
  });

  // Seed account w/ organization
  const Account = await prisma.account.create({
    data: {
      organization: {
        create: {
          name: 'Author United',
          line1: 'Fake Street',
          line2: '123',
          zip: '45655',
          city: 'Springfield',
          country: 'USA',
        },
      },
    },
  });

  const authorUser = await prisma.user.create({
    data: {
      email: 'author@author.com',
      firstname: 'Anton',
      lastname: 'Author',
      status: 'ACTIVE',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42,
      tasks: {
        createMany: {
          data: [
            {
              description: 'Do author stuff to get stuff done.',
              title: 'Do author stuff',
            },
            {
              description: 'Do more author stuff to get more stuff done,',
              title: 'Do more author stuff to get stuff done',
            },
          ],
        },
      },
      account: {
        connect: {
          id: Account.id,
        },
      },
      role: {
        connect: { id: authorRole?.id },
      },
    },
  });

  console.log(
    `Author user "${authorUser.firstname} ${authorUser.lastname}" seeded with some tasks.`,
  );
}

async function createTeamMembers() {
  const authorRole = await prisma.role.findUnique({
    where: { name: 'author' },
  });

  const adminAccount = await prisma.account.findFirst({
    where: {
      owner: {
        email: ADMIN_USER_EMAIL,
      },
    },
  });

  for (let i = 0; i < demoUsersWithTasksAndTags.length; i++) {
    const demoUser = demoUsersWithTasksAndTags[i];
    const { base, tasks } = demoUser;

    const user = await prisma.user.create({
      data: {
        email: base.email,
        firstname: base.firstname,
        lastname: base.lastname,
        status: 'ACTIVE',
        avatar: {
          create: {
            filename: base.avatar,
            mimeType: 'image',
            size: 200,
            path: '/uploads/' + base.avatar,
          },
        },
        password:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42,
        tasks: {
          createMany: {
            data: tasks.map((task) => ({
              createdAt: task.createdAt,
              description: task.description,
              title: task.title,
              status: ProgressStatus.done,
            })),
          },
        },
        account: {
          connect: {
            id: adminAccount?.id,
          },
        },
        role: {
          connect: { id: authorRole?.id },
        },
      },
    });

    const userTasks = await prisma.task.findMany({
      where: {
        createdBy: {
          id: user.id,
        },
      },
    });

    for (let j = 0; j < userTasks.length; j++) {
      const task = userTasks[j];

      for (let k = 0; k < tasks[j].tags.length; k++) {
        const tag = tasks[j].tags[k];

        const existingTag = await prisma.tag.findUnique({
          where: {
            name: tag.name,
          },
        });

        if (!existingTag) {
          // Create the tag
          await prisma.tag.create({
            data: {
              name: tag.name,
              slug: tag.name.toLowerCase().replace(' ', '-'),
              tasks: {
                connect: {
                  id: task.id,
                },
              },
              createdBy: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        }
      }
    }
  }
  console.log(`Seeded some team members, tasks and tags.`);
}

async function createAdminUserWithAccount() {
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  // Seed account w/ organization
  const Account = await prisma.account.create({
    data: {
      stripeCustomerId: STIPE_DEMO_CUSTOMER_ID,
      organization: {
        create: {
          name: 'Admin United',
          line1: 'Fake Street',
          line2: '123',
          zip: '45655',
          city: 'Springfield',
          country: 'USA',
        },
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: ADMIN_USER_EMAIL,
      firstname: 'Arnim',
      avatar: {
        create: {
          filename: 'User12.png',
          size: 200,
          path: '/uploads/User12.png',
        },
      },
      lastname: 'Admin',
      status: 'ACTIVE',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42,
      tasks: {
        createMany: {
          data: [
            {
              description: 'Do admin stuff to get stuff done.',
              title: 'Do admin stuff',
            },
            {
              description: 'Do more admin stuff to get more stuff done,',
              title: 'Do more admin stuff to get stuff done',
            },
          ],
        },
      },
      account: {
        connect: {
          id: Account.id,
        },
      },
      role: {
        connect: { id: adminRole?.id },
      },
    },
  });

  await prisma.account.update({
    where: { id: Account.id },
    data: {
      owner: {
        connect: {
          id: adminUser.id,
        },
      },
    },
  });

  console.log(
    `Admin user "${adminUser.firstname} ${adminUser.lastname}" seeded with some tasks.`,
  );
}

async function main() {
  await wipeDatabase();

  console.log('Seeding...');
  await seedRolesAndPermissions();
  await createAdminUserWithAccount();
  await createTeamMembers();
  await pendingInvitations();
  await createAuthorWithAccount();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

async function pendingInvitations() {
  const adminAccount = await prisma.account.findFirst({
    where: {
      owner: {
        email: ADMIN_USER_EMAIL,
      },
    },
    select: {
      id: true,
    },
  });

  for (let i = 0; i < demoPendingInviations.length - 1; i++) {
    await prisma.invitation.create({
      data: {
        accountId: adminAccount?.id || '2424',
        email: demoPendingInviations[i].email,
        role: 'author',
      },
    });
  }

  console.log(`Seeded some pending invitations.`);
}
