import { Container, Title, Accordion } from "@mantine/core";
import classes from "./Faq01.module.css";
import Section from "../../../layout/section/Section";
import SectionTitle from "../../../layout/section/SectionTitle";

type Faq01Props = {
  title: string;
  description?: string;
  faqs: any;
};

const AccordeonItem = ({ title, content }: any) => {
  return (
    <Accordion.Item className={classes.item} value={content}>
      <Accordion.Control>{title}</Accordion.Control>
      <Accordion.Panel>{content}</Accordion.Panel>
    </Accordion.Item>
  );
};

const Faq01 = ({ title, description, faqs }: Faq01Props) => {
  return (
    <Section>
      <Container>
        <SectionTitle title={title} description={description} />
      </Container>
      <Container>
        <Container size="sm">
          <Accordion variant="separated">
            {faqs.map((faq: any, index: number) => (
              <AccordeonItem
                key={index}
                title={faq.title}
                content={faq.content}
              />
            ))}
          </Accordion>
        </Container>
      </Container>
    </Section>
  );
};

export default Faq01;
