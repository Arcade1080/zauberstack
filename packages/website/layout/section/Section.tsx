import { Stack } from "@mantine/core";
import classes from "./Section.module.css";
type SectionProps = {
  children: React.ReactNode;
  bg?: string;
  id?: string;
};

const Section = ({ children, ...BoxProps }: SectionProps) => {
  return (
    <Stack {...BoxProps} className={classes.section}>
      {children}
    </Stack>
  );
};

export default Section;
