import { useMutation, useQuery } from '@apollo/client';
import {
  Badge,
  Box,
  Button,
  LoadingOverlay,
  SimpleGrid,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import {
  MUTATION_GET_CHECKOUT_URL,
  MUTATION_GET_CUSTOMER_PORTAL_URL,
} from '../../../../api/mutations';
import { QUERY_GET_ACTIVE_SUBSCRIPTION_AND_AVAILABLE_PLANS } from '../../../../api/queries';
import ErrorWrangler from '../../../../components/common/ErrorWrangler';
import SectionHeader from '../../../../components/page/SectionHeader';
import PricingCard from '../../../../components/pricing/PricingCard';
import DateService from '../../../../utils/TimeService';
import { NotificationType, showNotification } from '../../../../utils/utils';

type PlanFeatures = {
  label: string;
};

type Plan = {
  description: string;
  featuresDescription: string;
  features: PlanFeatures[];
};

const PLAN_TO_FEATURES_MAP: Record<string, Plan> = {
  Free: {
    description: 'Take a look around.',
    featuresDescription: 'Only the features that make you want more.',
    features: [
      {
        label: 'Few projects',
      },
      {
        label: 'Few collaborators',
      },
      {
        label: 'Few storage',
      },
      {
        label: 'Few fun',
      },
    ],
  },
  Starter: {
    description: 'Try a little more.',
    featuresDescription: 'Features that fuel your productivity.',
    features: [
      {
        label: 'More projects',
      },
      {
        label: 'More collaborators',
      },
      {
        label: 'More storage',
      },
      {
        label: 'More fun',
      },
    ],
  },
  Pro: {
    description: 'The full experience.',
    featuresDescription: 'Next level features to make your business thrive.',
    features: [
      {
        label: 'Unlimited projects',
      },
      {
        label: 'Unlimited collaborators',
      },
      {
        label: 'Unlimited storage',
      },
      {
        label: 'Unlimited fun',
      },
    ],
  },
};

const SubscriptionPage = () => {
  const { loading, error, data } = useQuery(
    QUERY_GET_ACTIVE_SUBSCRIPTION_AND_AVAILABLE_PLANS,
  );
  const [getCustomerPortalUrl] = useMutation(MUTATION_GET_CUSTOMER_PORTAL_URL);
  const [getCheckoutUrl] = useMutation(MUTATION_GET_CHECKOUT_URL);

  const onGetCheckoutUrl = async (productId: string) => {
    try {
      const { data: checkoutData } = await getCheckoutUrl({
        variables: {
          productId,
        },
      });

      window.location.href = checkoutData.requestCheckoutUrl;
    } catch (e) {
      showNotification({
        notificationType: NotificationType.SUCCESS,
        title: 'Something went wrong:',
        error: e,
      });
    }
  };

  const onGetCustomerPortalUrl = async () => {
    try {
      const { data: customerPortalData } = await getCustomerPortalUrl();
      window.location.href = customerPortalData.requestCustomerPortalUrl;
    } catch (e) {
      showNotification({
        notificationType: NotificationType.SUCCESS,
        title: 'Something went wrong:',
        error: e,
      });
    }
  };

  const { getActiveSubscription, getAvailablePlans } = data || {};

  const handleUpgrade = (productId: any) => {
    onGetCheckoutUrl(productId);
  };

  const isFreePlan = (planProductId: string) => planProductId === 'free';

  const isCurrentPlan = (planProductId: string) => {
    const a = planProductId === getActiveSubscription?.stripeProductId;
    return a;
  };

  const hasSubscription = () => getActiveSubscription !== null;

  const availablePlans = getAvailablePlans?.map((plan: any, index: number) => {
    const { currency, interval, productName, productId, price } = plan;
    const { stripeCancelAtPeriodEnd, stripeCurrentPeriodEnd, stripeCancelAt } =
      getActiveSubscription || {};
    const isCanceled = stripeCancelAtPeriodEnd;

    const getTopBadge = () => {
      if (!hasSubscription() && isFreePlan(productId)) {
        return (
          <Badge color="grape" variant="light">
            Current plan
          </Badge>
        );
      }

      if (isCurrentPlan(productId)) {
        return (
          <Badge color="grape" variant="light">
            Current plan {isCanceled && '(Canceled)'}
          </Badge>
        );
      }

      return null;
    };

    const getCTA = () => {
      if (!hasSubscription() && !isFreePlan(productId)) {
        return (
          <Button size="md" onClick={() => handleUpgrade(productId)}>
            Upgrade
          </Button>
        );
      }
      return null;
    };

    const getPlanStatusText = () => {
      if (!isCurrentPlan(productId)) {
        return undefined;
      }

      return isCanceled
        ? `Your plan will be canceled on ${DateService.getReadableDate(
            stripeCancelAt,
          )}`
        : `Your plan automatically renews on ${DateService.getReadableDate(
            stripeCurrentPeriodEnd,
          )}`;
    };

    return (
      <PricingCard
        key={index}
        plan={productName}
        topBadge={getTopBadge()}
        price={`${price} ${currency.toUpperCase()}`}
        interval={interval.charAt(0).toUpperCase() + interval.slice(1)}
        description={PLAN_TO_FEATURES_MAP[productName]?.description}
        cta={getCTA()}
        featuresLabel="Features"
        planStatusText={getPlanStatusText()}
        featuresDescription={
          PLAN_TO_FEATURES_MAP[productName]?.featuresDescription
        }
        features={PLAN_TO_FEATURES_MAP[productName]?.features}
      />
    );
  });

  return (
    <>
      <SectionHeader
        title="Subscription"
        description="Manage your subscription and billing information below."
      />
      <Space h="xl" />
      <Box pos="relative">
        <LoadingOverlay visible={loading} />
        <ErrorWrangler error={error} />
        <SimpleGrid
          pos="relative"
          cols={{
            base: 1,
            md: 3,
          }}
        >
          {availablePlans}
        </SimpleGrid>
        <Space h="xl" />
        {hasSubscription() && (
          <Stack gap="xs" align="flex-start">
            <Button size="md" onClick={onGetCustomerPortalUrl}>
              Manage subscription
            </Button>
            <Text c="gray" fz="sm">
              You will be redirected to the stripe customer portal.
            </Text>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default SubscriptionPage;
