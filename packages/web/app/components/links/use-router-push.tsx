import React from "react";
import { useRouter } from "next/navigation";
import { usePageTransitionContext } from "../../store/page-transition-context";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

/**
 * Provides a custom "router.push" function that will handle internal route changes to start page loading.
 * @returns The tuple of modified push function and the original router.
 */
export default function useRouterPush(): [push: (href: string) => void, router: AppRouterInstance] {
  const router = useRouter();
  const [pageLoading, setPageLoading] = usePageTransitionContext();

  const push = React.useCallback(
    (href: string) => {
      router.push(href);
      setPageLoading(href);
    },
    [router, setPageLoading]
  );

  return [push, router];
}
