import NavbarUI from './navbar-ui';
import { getAuthUser } from '@/access-data/user/get-auth-user';

const Navbar = async () => {
  const user = await getAuthUser();

  return <NavbarUI user={user} />;
};

export default Navbar;
