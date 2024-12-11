import {
  Avatar,
  Group,
  Paper,
  Stack,
  Text,
  TypographyStylesProvider,
} from '@mantine/core';

import classes from './TestimonialCard.module.css';

type TestimonialCardProps = {
  content: string;
  height: number;
  author: {
    name: string;
    image: string;
    role: string;
    company: string;
  };
};

const TestimonialCard = ({ content: body, author }: TestimonialCardProps) => {
  return (
    <Paper h="auto" withBorder radius="md" className={classes.card}>
      <Stack>
        <Group>
          <Avatar src={author.image} alt={author.name} radius="xl" />
          <div>
            <Text fz="sm">{author.name}</Text>
            <Text fz="xs" c="dimmed">
              {author.role} {author.company}
            </Text>
          </div>
        </Group>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </Stack>
    </Paper>
  );
};

export default TestimonialCard;
