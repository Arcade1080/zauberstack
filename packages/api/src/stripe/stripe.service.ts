/*

https://stripe.com/docs/billing/subscriptions/build-subscriptions

https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements


See user.controller for webhook implementation

Test stripe locally
++++++++++++++++++++

stripe login
stripe listen --forward-to localhost:4000/webhook
copy signing secret to user controller (whsec_....)
*/
type CreateSubscriptionDTO = {
  stripeSubscriptionId: string;
  stripeCreated: Date;
  stripeCurrentPeriodStart: Date;
  stripeCurrentPeriodEnd: Date;
  stripeProductName: string;
  stripeProductId: string;
  stripeProductPrice: number;
  stripeProductCurrency: string;
  stripeSubscriptionStatus: StripeSubscriptionStatus;
  stripeCanceledAt: Date;
  stripeCancelAtPeriodEnd: boolean;
  stripeCancelAt: Date;
};

type StripeSubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

enum StripeError {
  InvalidRequest = 'StripeInvalidRequestError',
  ResourceMissing = 'resource_missing',
}

export default StripeError;

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe;
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService, // @Inject("STRIPE_CLIENT") private stripe: Stripe
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_API_KEY'), {
      // @ts-ignore
      apiVersion: '2023-08-16',
    });
  }

  public createEvent(rawBody, signature, webhookSecret) {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    return event;
  }

  public createCustomer(account: any): Promise<Stripe.Customer> {
    const customerParams = this.getCustomerParams(account);
    return this.stripe.customers.create(customerParams);
  }

  public getProductById(productId: string) {
    return this.stripe.products.retrieve(productId);
  }

  public deleteStripeCustomer(customerId: string) {
    return this.stripe.customers.del(customerId);
  }

  private getCustomerParams(account: any) {
    const { owner, organization, billingAddress } = account;

    const params = {
      email: owner.email,
      description: organization.name,
      address: {
        line1: billingAddress?.line1,
        line2: billingAddress?.line2,
        postal_code: billingAddress?.zip,
        city: billingAddress?.city,
        country: billingAddress?.country,
      },
      preferred_locales: [this.configService.get('stripe').preferredLocale],
    };

    if (billingAddress?.vat_id) {
      params['tax_info'] = {
        tax_id: billingAddress.vat_id,
        type: 'vat',
      };
    }

    return params;
  }

  public async createCheckoutSessionUrl(productId: string, currentUser: any) {
    // check if acting user is an account owner
    const ownerAccount = await this.prismaService.account.findFirst({
      where: {
        owner: {
          id: currentUser.id,
        },
      },
      include: {
        owner: true,
        organization: true,
      },
    });

    // if not, throw error
    if (!ownerAccount) {
      throw new BadRequestException('User is not an account owner');
    }

    let stripeCustomerId = ownerAccount.stripeCustomerId;

    if (!stripeCustomerId) {
      try {
        const stripeCustomer = await this.createCustomer(ownerAccount);
        stripeCustomerId = stripeCustomer.id;

        await this.prismaService.account.update({
          where: {
            id: ownerAccount.id,
          },
          data: {
            stripeCustomerId,
          },
        });
      } catch (e) {
        throw new BadRequestException('Error creating stripe customer');
      }
    }
    // get price for passed product id
    const prices = await this.stripe.prices.list({
      // lookup_keys: [{id:}],
      expand: ['data.product'],
    });

    const price = prices.data
      .filter((price: any) => price.product.id === productId)
      .pop();

    const session = await this.stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: price.id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      metadata: {
        userId: currentUser.id,
      },
      customer: stripeCustomerId,
      mode: 'subscription',
      success_url: `${this.configService.get(
        'WEB_CLIENT_URL',
      )}/settings/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get(
        'WEB_CLIENT_URL',
      )}/settings/subscription?canceled=true`,
    });

    return session.url;
  }

  public async createPortalSessionUrl(currentUser: any) {
    // check if acting user is an account owner
    const ownerAccount = await this.prismaService.account.findFirst({
      where: {
        owner: {
          id: currentUser.id,
        },
      },
    });

    if (!ownerAccount) {
      throw new BadRequestException('User is not an account owner');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: ownerAccount.stripeCustomerId,
      return_url: `${this.configService.get(
        'WEB_CLIENT_URL',
      )}/settings/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
    });

    return session.url;
  }

  async getPlans() {
    try {
      const plans = await this.stripe.plans.list({
        active: true,
        expand: ['data.product'],
      });

      const result = [];
      for (const plan of plans.data) {
        const product = plan.product;
        result.push({
          // @ts-ignore
          productId: product.id,
          planId: plan.id,
          // @ts-ignore
          productName: product.name,
          price: plan.amount / 100,
          currency: plan.currency,
          interval: plan.interval,
        });
      }
      // add free Plan
      result.push({
        productId: 'free',
        planId: 'free',
        productName: 'Free',
        price: 0,
        currency: 'eur',
        interval: 'month',
      });

      // sort by price ascending
      result.sort((a, b) => a.price - b.price);

      return result;
    } catch (error) {
      throw new BadRequestException('Error retrieving plans');
    }
  }

  async handleStripeEventCustomerSubscriptionDeleted(eventData: any) {
    try {
      this.deleteStripeSubscriptionInDb(eventData);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteStripeSubscriptionInDb(eventData: any) {
    const customerId = eventData?.customer;

    const account = await this.prismaService.account.findFirst({
      where: {
        stripeCustomerId: customerId,
      },
      select: {
        id: true,
      },
    });

    if (!account) {
      throw new Error('Account for user id not found');
    }

    await this.prismaService.subscription.delete({
      where: {
        stripeSubscriptionId: eventData.id,
      },
    });
  }

  async handleStripeEventCheckoutSessionCompleted() {
    try {
      console.info('Checkout completed');
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleStripeEventCustomerSubscriptionUpdated(eventData: any) {
    try {
      const subscription = this.updateStripeSubscriptionInDb(eventData);
      return subscription;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleStripeEventCustomerSubscriptionCreated(eventData: any) {
    try {
      const subscription = await this.createStripeSubscriptionInDb(eventData);
      return subscription;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createStripeSubscriptionInDb(eventData: any) {
    const customerId = eventData?.customer;

    const account = await this.prismaService.account.findFirst({
      where: {
        stripeCustomerId: customerId,
      },

      select: {
        id: true,
      },
    });

    if (!account) {
      throw new Error('Account for user id not found');
    }

    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      eventData.id,
      { expand: ['plan.product'] },
    );

    if (!stripeSubscription) {
      throw new Error('Stripe subscription not found');
    }

    const formatedSubscriptionData =
      this.formatSubscriptionData(stripeSubscription);

    return this.prismaService.subscription.create({
      data: {
        ...formatedSubscriptionData,
        account: {
          connect: { id: account.id },
        },
      },
    });
  }

  async updateStripeSubscriptionInDb(eventData: any) {
    const customerId = eventData?.customer;

    const account = await this.prismaService.account.findFirst({
      where: {
        stripeCustomerId: customerId,
      },
      select: {
        id: true,
      },
    });

    if (!account) {
      throw new Error('Account for user id not found');
    }

    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      eventData.id,
      { expand: ['plan.product'] },
    );

    if (!stripeSubscription) {
      throw new Error('Stripe subscription not found');
    }

    const formatedSubscription =
      this.formatSubscriptionData(stripeSubscription);

    return this.prismaService.subscription.update({
      where: {
        stripeSubscriptionId: stripeSubscription.id,
      },
      data: {
        ...formatedSubscription,
      },
    });
  }

  public formatSubscriptionData(
    stripeSubscription: any,
  ): CreateSubscriptionDTO {
    const { plan } = stripeSubscription;
    const { product } = plan;

    return {
      stripeSubscriptionId: stripeSubscription.id,
      stripeCreated: new Date(stripeSubscription.created * 1000),
      stripeCurrentPeriodStart: new Date(
        stripeSubscription.current_period_start * 1000,
      ),
      stripeCurrentPeriodEnd: new Date(
        stripeSubscription.current_period_end * 1000,
      ),
      stripeProductName: product.name,
      stripeProductId: product.id,
      stripeProductPrice: plan.amount,
      stripeProductCurrency: plan.currency,
      stripeSubscriptionStatus: stripeSubscription.status,
      stripeCanceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
      stripeCancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      stripeCancelAt: stripeSubscription.cancel_at
        ? new Date(stripeSubscription.cancel_at * 1000)
        : null,
    };
  }
}
