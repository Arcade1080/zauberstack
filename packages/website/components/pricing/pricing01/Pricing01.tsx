import { Button, Container, SimpleGrid } from "@mantine/core";
import Link from "next/link";
import Section from "../../../layout/section/Section";
import SectionTitle from "../../../layout/section/SectionTitle";
import PricingCard from "../../common/pricingCard/PricingCard";

type Pricing01Props = {
  title: string;
  id: string;
  description: string;
  plans?: any;
};

const Pricing01 = ({ title, id, description, plans }: Pricing01Props) => {
  const _plans = plans.map((plan: any, index: any) => {
    const {
      planName,
      planPrice,
      ctaLink,
      planInterval,
      planDescription,
      benefitsDescription,
      benefits,
    } = plan;

    return (
      <PricingCard
        key={index}
        plan={planName}
        price={planPrice}
        interval={planInterval}
        description={planDescription}
        cta={
          <Button component={Link} href={ctaLink} size="md">
            Start now
          </Button>
        }
        featuresLabel="Features"
        featuresDescription={benefitsDescription}
        features={benefits}
      />
    );
  });

  return (
    <Section id={id}>
      <Container>
        <SectionTitle title={title} description={description} />
      </Container>
      <Container>
        <SimpleGrid cols={{ base: 1, md: 3 }}>{_plans}</SimpleGrid>
      </Container>
    </Section>
  );
};

export default Pricing01;
