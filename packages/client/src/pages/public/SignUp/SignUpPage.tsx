import { useSearchParams } from 'react-router-dom';
import AuthPageLayout from '../../layouts/authPage/AuthPageLayout';
import SignUpForm from './SignUpForm';

const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  return (
    <AuthPageLayout>
      <SignUpForm invitational={!!token} token={token} email={email} />
    </AuthPageLayout>
  );
};

export default SignUpPage;
