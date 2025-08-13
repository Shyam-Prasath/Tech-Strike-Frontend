import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUp() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}