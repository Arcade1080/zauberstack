import { Image } from '@mantine/core';
import classes from './Logo.module.css';

type LogoProps = {
  link?: string;
};

const Logo = ({ link }: LogoProps) => (
  <Image src="/logo.svg" alt="Zauberstack" className={classes.logo} />
);

export default Logo;
