import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useUser({
  redirectTo = '',
  redirectIfFound = false,
} = {}) {
  const { data, error } = useSWR('/api/auth/me', fetcher);
  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;

    if (
      (redirectTo && !redirectIfFound && !hasUser) ||
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);

  return { user, isLoading: !finished, error };
}