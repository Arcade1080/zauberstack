import { Image } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import classes from './Logo.module.css';

type LogoProps = {
  link?: string;
};

const Logo = ({ link }: LogoProps) => (
  <NavLink to={link || '/'}>
    <Image src={logo} alt="Zauberstack" className={classes.logo} />
  </NavLink>
);

export default Logo;
