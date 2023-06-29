import React from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../store/slices/navigationSlice";

/**
 * Provides a custom "router.push" function that will handle internal route changes to start page loading.
 * @returns The tuple of modified push function and the original router.
 */
export default function useRouterPush(): [
  push: (href: string) => void,
  router: AppRouterInstance
] {
  const dispatch = useDispatch();
  const router = useRouter();

  const push = React.useCallback(
    (href: string) => {
      router.push(href);
      dispatch(setPageLoading(href));
    },
    [router, dispatch]
  );

  return [push, router];
}
