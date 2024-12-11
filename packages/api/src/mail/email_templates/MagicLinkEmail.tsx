import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import Footer from './components/Footer';
import Header from './components/Header';

interface MagicLinkProps {
  magicLink?: string;
}

const baseUrl = process.env.WEB_CLIENT_URL
  ? `${process.env.WEB_CLIENT_URL}/`
  : '';

export const MagicLinkEmail = ({ magicLink }: MagicLinkProps) => (
  <Html>
    <Head />
    <Preview>Sign in with this magic link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Header
          logoUrl={baseUrl + '/logo.svg'}
          title="Sign in with this magic link"
        />
        <Section style={buttonContainer}>
          <Button style={button} href={magicLink}>
            Sign in to Zauberstack
          </Button>
        </Section>
        <Text style={paragraph}>
          This link will only be valid for the next 5 minutes. If you didn't
          requested this link, you can safely ignore this email.
        </Text>
        <Footer />
      </Container>
    </Body>
  </Html>
);

MagicLinkEmail.PreviewProps = {
  magicLink: 'tt226-5398x',
} as MagicLinkProps;

export default MagicLinkEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,Inter,Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#343A40',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
};
