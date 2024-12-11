import Contact01 from "../components/contact/contact01/Contact01";
import Faq01 from "../components/faq/faq01/Faq01";
import Features01 from "../components/features/features01/Features01";
import Features03 from "../components/features/features03/Features03";
import Header01 from "../components/headers/header01/Header01";
import Hero01 from "../components/heroes/hero01/Hero01";
import Pricing01 from "../components/pricing/pricing01/Pricing01";
import Logocloud01 from "../components/socialproof/logocloud/Logocloud01";
import { Testimonials01 } from "../components/socialproof/testimonials/testimonials01/Testimonials01";
import { PageContent } from "../content";
import Footer01 from "../components/footer/footer01/Footer01";

const Home = () => {
  return (
    <>
      <Header01 fixed />
      <Hero01
        title={PageContent.hero.title}
        eyebrow={PageContent.hero.eyeBrow}
        description={PageContent.hero.description}
        cta={PageContent.hero.cta}
        media={undefined}
        id="home"
      />
      <Logocloud01
        title={PageContent.logoCloud.title}
        logos={PageContent.logoCloud.logos}
      />
      <Features01
        title={PageContent.features01.title}
        description={PageContent.features01.description}
        features={PageContent.features01.features}
        id="features"
        mediaConfig={{
          maw: {
            sm: 600,
          },
        }}
      />
      <Features03
        title={PageContent.features03.title}
        description={PageContent.features03.description}
        features={PageContent.features03.features}
      />
      {/* <Features02
        title={PageContent.features02.title}
        description={PageContent.features02.description}
        tabContent={PageContent.features02.tabContent}
      /> */}
      <Pricing01
        title={PageContent.pricing01.title}
        description={PageContent.pricing01.description}
        plans={PageContent.pricing01.plans}
        id="pricing"
      />
      <Testimonials01
        title={PageContent.testimonials01.title}
        description={PageContent.testimonials01.description}
        testimonials={PageContent.testimonials01.testimonials}
      />
      <Faq01 title={PageContent.faq01.title} faqs={PageContent.faq01.faqs} />
      <Contact01
        title={PageContent.contact01.title}
        description={PageContent.contact01.description}
        image={PageContent.contact01.image}
        id="contact"
      />
      <Footer01
        columns={PageContent.footer01.columns}
        brandclaim={PageContent.footer01.brandclaim}
      />
    </>
  );
};

export default Home;
