import { Container, Stack, Text, Title } from "@mantine/core";
import Section from "../../../layout/section/Section";
import classes from "./Features01.module.css";
import TextImage from "../../common/textImage/TextImage";
import SectionTitle from "../../../layout/section/SectionTitle";

type Features01Props = {
  title: string;
  description: string;
  id: string;
  features?: any;
  mediaConfig?: any;
};

const Features01 = ({
  title,
  description,
  features,
  mediaConfig,
  id,
}: Features01Props) => {
  return (
    <Section id={id}>
      <Container>
        <SectionTitle title={title} description={description} />
      </Container>
      {features.map((feature: any, index: number) => (
        <Container key={index}>
          <TextImage
            eyebrow={feature.eyebrow}
            title={feature.title}
            description={feature.description}
            bulletPoints={feature.bulletPoints}
            imageLeft={index % 2 === 0}
            media={feature.media}
            imageConfig={mediaConfig}
          />
        </Container>
      ))}
    </Section>
  );
};

export default Features01;
