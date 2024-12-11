import * as React from 'react';

import { Heading, Img } from '@react-email/components';

interface HeaderProps {
  logoUrl: string;
  title: string;
}

const Header = ({ logoUrl, title }: HeaderProps) => {
  return (
    <>
      <Img
        src={logoUrl}
        width="44"
        height="44"
        alt="Zauberstack"
        style={logo}
      />
      <Heading style={heading}>{title}</Heading>
    </>
  );
};

const logo = {
  borderRadius: 21,
  width: 42,
  height: 42,
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

export default Header;
