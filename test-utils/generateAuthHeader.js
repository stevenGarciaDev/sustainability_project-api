export default async (server, user) => {
  const payload = {
    username: user.username,
    password: 'password',
  };
  const res = await server.inject({
    method: 'post',
    url: '/login',
    payload,
  });
  const { token } = await JSON.parse(res.payload);
  return `Bearer ${token}`;
};
