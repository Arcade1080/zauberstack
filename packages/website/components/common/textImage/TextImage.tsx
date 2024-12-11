import { Image, List, Stack, Text, Title, rem } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { clsx } from "clsx";
import classes from "./TextImage.module.css";

type TextMediaProps = {
  title: string;
  description: string;
  imageLeft: boolean;
  imageConfig?: any;
  eyebrow?: string;
  bulletPoints?: string[];
  media: {
    alt: string;
    src: string;
  };
};

const TextImage = ({
  eyebrow,
  title,
  description,
  bulletPoints,
  imageLeft,
  imageConfig,
  media,
}: TextMediaProps) => {
  const bulletPointsList = (
    <List
      spacing="sm"
      size="sm"
      center
      icon={<IconCircleCheck style={{ width: rem(16), height: rem(16) }} />}
    >
      {
        // @ts-ignore
        bulletPoints.map((point, index) => (
          <List.Item lh="20px" key={index}>
            {point}
          </List.Item>
        ))
      }
    </List>
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.contentWrapper}>
        <Stack justify="center" gap="lg">
          <Text fz="md">{eyebrow}</Text>
          <Title size="h2">{title}</Title>
          <Text>{description}</Text>
          {bulletPointsList}
        </Stack>
      </div>
      <div
        className={clsx(classes.imageWrapper, imageLeft && classes.imageLeft)}
      >
        <Image {...imageConfig} fit="contain" src={media.src} alt={media.alt} />
      </div>
    </div>
  );
};

export default TextImage;
