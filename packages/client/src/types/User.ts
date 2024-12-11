interface User {
  id: string;
  email: string;
  avatar: string;
  firstname: string;
  lastname: string;
  account: string;
  isAccountOwner: boolean;
  role: string;
  permissions: string[];
}

export default User;
