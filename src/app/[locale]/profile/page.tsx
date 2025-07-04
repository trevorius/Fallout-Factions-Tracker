import { PasswordCard } from './components/password-card';
import { ProfileCard } from './components/profile-card';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
  });

  return (
    <div className='grid gap-6'>
      <ProfileCard user={user} />
      <PasswordCard />
    </div>
  );
}
