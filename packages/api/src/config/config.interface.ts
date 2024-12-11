export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  mail: MailConfig;
  stripe: StripeConfig;
  subscriptionLimits: SubscriptionLimitsConfig;
}

export interface SubscriptionLimitsConfig {
  free: SubscriptionLimitConfig;
  starter: SubscriptionLimitConfig;
  pro: SubscriptionLimitConfig;
}

export interface SubscriptionLimitConfig {
  tasks: number;
  teamMembers: number;
}

export interface MailConfig {
  enablePreview: boolean;
}

export interface StripeConfig {
  preferredLocale: string;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
  credentials: boolean;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  expiresIn: number;
  refreshIn: number;
  resetTokenExpiresIn: number;
  inviteTokenExpiresIn: number;
  bcryptSaltOrRound: string | number;
}
