import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionRole } from '@/lib/auth/roles';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password';
import { ROLE_LABEL } from '@/lib/auth/role-meta';
import ChangePasswordForm from './ChangePasswordForm';

/** Open to every role — everyone with a login can change their own password. */
export default async function AccountPage() {
  const session = await getSessionRole();
  if (!session) redirect('/sign-in');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your account</h1>
        <p className="mt-2 text-gray-600">
          Signed in as {session.email} —{' '}
          {ROLE_LABEL[session.role].toLowerCase()}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>
            Changing your password signs you out of every other browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm minLength={MIN_PASSWORD_LENGTH} />
        </CardContent>
      </Card>
    </div>
  );
}
