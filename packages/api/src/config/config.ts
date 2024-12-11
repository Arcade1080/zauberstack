import { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 4000,
  },
  cors: {
    enabled: true,
    credentials: true,
  },
  graphql: {
    playgroundEnabled: false,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    // 15 minutes (in seconds)
    // TODO Auth token add speaking name
    expiresIn: 60 * 15,
    // 32 days (in seconds)
    // TODO add Refresh token speaking name
    refreshIn: 60 * 60 * 24 * 32,
    // 1 day (in seconds)
    resetTokenExpiresIn: 60 * 60 * 24,
    inviteTokenExpiresIn: 60 * 60 * 24,
    bcryptSaltOrRound: 10,
  },
  mail: {
    enablePreview: false,
  },
  stripe: {
    preferredLocale: 'en-US',
  },
  subscriptionLimits: {
    free: {
      tasks: 20,
      teamMembers: 10,
    },
    starter: {
      tasks: 50,
      teamMembers: 20,
    },
    pro: {
      tasks: 50,
      teamMembers: 30,
    },
  },
};

export default (): Config => config;
