import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";
import { useLanguage } from "@/i18n/context";
import { localizePath } from "@/i18n/editions";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } =
    options ?? {};

  const navigate = useNavigate();
  const { lang } = useLanguage();

  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate(localizePath(redirectPath, lang));
    },
  });

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(localizePath(redirectPath, lang));
      }
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath, lang]);

  // If auth.me errored (e.g. server returned 401 because the cookie expired or
  // got dropped by browser tracking protection), React Query keeps the old
  // `data` cached. Treat any error as "not authenticated" so the UI doesn't
  // show a stale user.
  const effectiveUser = error ? null : (user ?? null);

  return useMemo(
    () => ({
      user: effectiveUser,
      isAuthenticated: !!effectiveUser,
      isLoading: isLoading || logoutMutation.isPending,
      error,
      logout,
      refresh: refetch,
    }),
    [effectiveUser, isLoading, logoutMutation.isPending, error, logout, refetch],
  );
}
