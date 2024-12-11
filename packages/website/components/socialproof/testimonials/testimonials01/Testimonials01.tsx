import {
  Container,
  SimpleGrid,
  Stack,
  px,
  useMantineTheme,
} from "@mantine/core";
import Section from "../../../../layout/section/Section";
import SectionTitle from "../../../../layout/section/SectionTitle";
import TestimonialCard from "../../../common/testimonialCard/TestimonialCard";

type Testimonials01Props = {
  title: string;
  description: string;
  testimonials: any;
  columns?: number;
};

const getChild = (height: number, data: any, index: any) => {
  const { content, author } = data;
  return (
    <TestimonialCard
      key={index}
      height={height}
      content={content}
      author={author}
    />
  );
};
const BASE_HEIGHT = 360;
const getSubHeight = (children: number, spacing: number) =>
  BASE_HEIGHT / children - spacing * ((children - 1) / children);

export function Testimonials01({
  title,
  description,
  testimonials,
  columns = 3,
}: Testimonials01Props) {
  const theme = useMantineTheme();

  const rows = Math.ceil(testimonials.length / columns);
  const dataInColumns = Array.from({ length: columns }, (_, i) =>
    testimonials.slice(i * rows, i * rows + rows),
  );

  return (
    <Section bg={theme.colors.gray[0]}>
      <Container>
        <SectionTitle title={title} description={description} />
      </Container>
      <Container>
        <SimpleGrid cols={{ base: 1, md: columns }}>
          {dataInColumns.map((columnData, i) => (
            <Stack key={i}>
              {columnData.map((item: any, index: number) =>
                getChild(
                  getSubHeight(2, px(theme.spacing.md) as number),
                  item,
                  index,
                ),
              )}
            </Stack>
          ))}
        </SimpleGrid>
      </Container>
    </Section>
  );
}
