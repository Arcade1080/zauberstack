import { Stack, Text } from '@mantine/core';
import classes from './SectionTitle.module.css';

type SectionTitleProps = {
  title: string;
  description?: string;
};

const SectionTitle = ({ title, description }: SectionTitleProps) => {
  return (
    <>
      <Stack align="center" gap="md" className={classes.wrapper}>
        <h1 className={classes.title}>{title}</h1>
        {description && (
          <Text className={classes.description}>{description}</Text>
        )}
      </Stack>
    </>
  );
};

export default SectionTitle;
