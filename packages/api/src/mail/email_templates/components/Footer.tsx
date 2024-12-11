import { Hr, Link } from '@react-email/components';
import * as React from 'react';

const Footer = () => {
  return (
    <>
      <Hr style={hr} />
      <Link href={process.env.WEB_CLIENT_URL} style={reportLink}>
        Zauberstack
      </Link>
    </>
  );
};

const reportLink = {
  fontSize: '14px',
  color: '#b4becc',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};

export default Footer;
