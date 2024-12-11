import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from 'nestjs-prisma';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';
import { DateScalar } from '../common/scalars/date.scalar';
import config from '../config/config';
import { MailModule } from '../mail/mail.module';
import { MediaModule } from '../media/media.module';
import { StripeModule } from '../stripe/stripe.module';
import { TagModule } from '../tag/tag.module';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { AccountModule } from './../account/account.module';
////
@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', '..', 'public')
      rootPath:
        process.env.NODE_ENV === 'production'
          ? './assets'
          : join(__dirname, '..', '..', 'public'),
    }),

    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService): Promise<any> => {
        const graphqlConfig = configService.get('graphql');
        return {
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile:
            graphqlConfig.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          cors: {
            enabled: configService.get('cors').enabled,
            credentials: true,
            origin: configService.get('WEB_CLIENT_URL'),
          },
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    TagModule,
    UserModule,
    AuthModule,
    MediaModule,
    TaskModule,
    MailModule,
    AccountModule,
    StripeModule.forRoot(process.env.STRIPE_API_KEY, {
      // @ts-ignore
      apiVersion: '2023-08-16',
    }),
  ],
  providers: [DateScalar],
})
export class AppModule {}
