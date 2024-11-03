const api = 'http://localhost:3000';

export const environment = {
  production: true,

  // Danger
  delete_account: api + '/account/user/delete',

  // Auth
  auth: api + '/auth/login',
  register: api + '/auth/create',

  // Account
  account: api + '/account/user/profile',
};
