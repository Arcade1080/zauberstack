import { Container, Text, Title } from '@mantine/core';

export default function NotFoundPage() {
  return (
    <Container>
      <div>404</div>
      <Title>You have found a secret place.</Title>
      <Text size="lg">
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
    </Container>
  );
}
