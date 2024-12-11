import { useMutation } from '@apollo/client';
import { Anchor, Group, Loader, Space, Title } from '@mantine/core';
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MUTATION_SIGN_IN_WITH_MAGICLINK } from '../../api/mutations';
import ErrorWrangler from '../../components/common/ErrorWrangler';
import useAuthContext from '../../hooks/useAuthContext';
import { Paths } from '../../routes/paths';
import AuthPageLayout from '../layouts/authPage/AuthPageLayout';

const MagicLinkPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const authContext = useAuthContext();

  const [signInWithMagic, { loading, error }] = useMutation(
    MUTATION_SIGN_IN_WITH_MAGICLINK,
    {
      variables: {
        data: {
          token,
        },
      },
      onCompleted: ({ signInWithMagicLink }) => {
        authContext.signIn(signInWithMagicLink.accessToken);
      },
    },
  );

  useEffect(() => {
    signInWithMagic();
  }, []);

  return (
    <AuthPageLayout>
      <Title order={1} size="h1">
        {loading && 'Signing you in...'}
        {error && 'That didn´t work out, here is why:'}
      </Title>
      <Space h="lg" />
      {loading && <Loader />}
      <ErrorWrangler error={error} />
      <Space h="lg" />
      <Group justify="space-between" mb="md">
        <Anchor size="xs" component={Link} to={Paths.SignUp}>
          Don&apos;t have an account yet? Sign up!
        </Anchor>
        <Anchor size="xs" component={Link} to={Paths.ForgotPassword}>
          Try to reset your password?
        </Anchor>
      </Group>
    </AuthPageLayout>
  );
};

export default MagicLinkPage;
