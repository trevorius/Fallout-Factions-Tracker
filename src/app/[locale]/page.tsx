import { getUserOrganizations } from '@/app/actions/user';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }
  
  const t = await getTranslations('organization');

  const organizations = await getUserOrganizations();

  // If user has no organizations, show message
  if (organizations.length === 0) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>{t('noOrganizations')}</h1>
          <p className='mt-2 text-muted-foreground'>
            {t('noOrganizationsDesc')}
          </p>
        </div>
      </div>
    );
  }

  // If user has exactly one organization, redirect to it
  if (organizations.length === 1) {
    redirect(`/${locale}/organizations/${organizations[0].id}`);
  }

  // If user has multiple organizations, show selector
  return (
    <div className='flex h-full items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>{t('selectOrganization')}</h1>
        <p className='mt-2 mb-4 text-muted-foreground'>
          {t('selectOrganizationDesc')}
        </p>
      </div>
    </div>
  );
}
