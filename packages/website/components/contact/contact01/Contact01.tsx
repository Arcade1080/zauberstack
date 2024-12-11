import { Container } from "@mantine/core";
import Image from "next/image";
import Section from "../../../layout/section/Section";
import classes from "./Contact01.module.css";
import Contact01Form from "./Contact01Form";

type Contact01Props = {
  title: string;
  id: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
};

const Contact01 = ({ image, id, title, description }: Contact01Props) => {
  return (
    <Section id={id}>
      <Container>
        <div className={classes.wrapper}>
          <div className={classes.contentWrapper}>
            <Contact01Form title={title} description={description} />
          </div>

          <div className={classes.imageWrapper}>
            <Image
              className={classes.image}
              fill
              src={image.src}
              alt={image.alt}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Contact01;
