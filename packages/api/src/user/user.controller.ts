import { Controller, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/decorators/public.decorator';
import { StripeService } from '../stripe/stripe.service';

@Controller('stripe-webhook')
export class UserController {
  constructor(
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post()
  async handleStripeEvents(@Req() req: any): Promise<any> {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    // Retrieve the event by verifying the signature using the raw body and secret.
    let event: any;
    const signature = req.headers['stripe-signature'];

    try {
      event = this.stripeService.createEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return 'Something went wrong';
    }

    const eventData = event.data.object;
    const eventType = event.type;

    switch (eventType) {
      case 'checkout.session.completed':
        this.stripeService.handleStripeEventCheckoutSessionCompleted();
        break;

      case 'customer.subscription.deleted':
        this.stripeService.handleStripeEventCustomerSubscriptionDeleted(
          eventData,
        );
        break;

      case 'customer.subscription.created':
        this.stripeService.handleStripeEventCustomerSubscriptionCreated(
          eventData,
        );

        break;

      case 'customer.subscription.updated':
        this.stripeService.handleStripeEventCustomerSubscriptionUpdated(
          eventData,
        );
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  }
}
