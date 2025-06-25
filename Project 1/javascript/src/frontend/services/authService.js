export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const login = async (email, password) => {
  // Simulate user login
  const fakeUser = { id: 1, name: 'John Doe', email };
  const fakeToken = 'mock-token';

  localStorage.setItem('user', JSON.stringify(fakeUser));
  localStorage.setItem('token', fakeToken);

  return { token: fakeToken, user: fakeUser };
};

export const register = async (first, last, email, pass) => {
  const fakeUser = { id: 2, name: `${first} ${last}`, email };
  const fakeToken = 'mock-token';

  localStorage.setItem('user', JSON.stringify(fakeUser));
  localStorage.setItem('token', fakeToken);

  return { token: fakeToken, user: fakeUser };
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
