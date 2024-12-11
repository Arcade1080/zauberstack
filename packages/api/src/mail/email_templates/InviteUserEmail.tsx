import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from '@react-email/components';
import * as React from 'react';
import Footer from './components/Footer';
import Header from './components/Header';

interface InviteUserProps {
  inviteLink?: string;
}

const baseUrl = process.env.WEB_CLIENT_URL
  ? `${process.env.WEB_CLIENT_URL}/`
  : '';

export const InviteUserEmail = ({ inviteLink }: InviteUserProps) => (
  <Html>
    <Head />
    <Preview>Your invitation to zauberstack</Preview>
    <Body style={main}>
      <Container style={container}>
        <Header
          logoUrl={baseUrl + '/logo.svg'}
          title="Hey! You've been invited to join Zauberstack."
        />
        <Section style={buttonContainer}>
          <Button style={button} href={inviteLink}>
            Accept invitation
          </Button>
        </Section>
        <Footer />
      </Container>
    </Body>
  </Html>
);

InviteUserEmail.PreviewProps = {
  inviteLink: 'tt226-5398x',
} as InviteUserProps;

export default InviteUserEmail;

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
