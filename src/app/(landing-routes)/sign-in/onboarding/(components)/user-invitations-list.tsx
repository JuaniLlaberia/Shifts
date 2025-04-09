import { getTranslations } from 'next-intl/server';

import Badge from '@/components/ui/badge';
import JoinButton from './join-button';
import { getUserInvitations } from '@/access-data/user/get-user-invitation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserInvitationsList = async () => {
  const t = await getTranslations('authOnboarding.userInvitations');
  const invitations = await getUserInvitations({});

  return (
    <div className='py-8 space-y-8 md:px-0'>
      <header className='text-2xl md:text-3xl font-semibold leading-tight'>
        <h1 className='text-landing-main-text-primary'>
          {t('title.content')}{' '}
          <span className='relative z-30'>
            {t('title.span')}
            <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-0 -z-10' />
          </span>
        </h1>
        <h2 className='text-landing-main-text-secondary/75'>{t('subTitle')}</h2>
      </header>
      <ul className='bg-landing-main-card border-2 border-landing-main-border/50 rounded-xl last:border-none'>
        {invitations?.length > 0 ? (
          invitations?.map(invitation => (
            <li
              key={invitation.id}
              className='flex items-center justify-between p-6 border-b border-border'
            >
              <div className='flex items-center gap-4'>
                <Avatar className='size-10'>
                  <AvatarImage src={invitation.business.image || undefined} />
                  <AvatarFallback>
                    {invitation.business.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className='text-lg font-medium'>
                    {invitation.business.name}
                  </h4>
                  <Badge decorated color={invitation.role.color}>
                    {invitation.role.name}
                  </Badge>
                </div>
              </div>
              <JoinButton
                businessId={invitation.businessId}
                businessName={invitation.business.name}
              />
            </li>
          ))
        ) : (
          <div className='text-center'>
            <p>{t('empty')}</p>
          </div>
        )}
      </ul>
      <p className='text-sm text-landing-main-text-secondary text-center font-medium'>
        {t('disclaimer')}
      </p>
    </div>
  );
};

export default UserInvitationsList;
