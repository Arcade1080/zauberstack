import { DynamicModule, Provider } from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeService } from './stripe.service';

export class StripeModule {
  static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(apiKey, config);

    const stripeProvider: Provider = {
      provide: 'STRIPE_CLIENT',
      useValue: stripe,
    };
    return {
      module: StripeModule,
      providers: [stripeProvider, StripeService],
      exports: [stripeProvider, StripeService],
      global: true,
    };
  }
}
