import { getIronSession } from 'iron-session';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'reusa-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(req, res) {
  const session = await getIronSession(req, res, sessionOptions);
  return session;
}