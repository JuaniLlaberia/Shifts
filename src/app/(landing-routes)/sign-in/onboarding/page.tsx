import OnboardingForm from './(components)/onboarding-form';
import UserInvitationsList from './(components)/user-invitations-list';

const AuthOnboardingPage = () => {
  return (
    <section className='w-full max-w-lg px-4 space-y-6 py-8 md:py-16 min-h-[50dvh]'>
      <OnboardingForm userInvitationsList={<UserInvitationsList />} />
    </section>
  );
};

export default AuthOnboardingPage;
