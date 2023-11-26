/* eslint-disable import/newline-after-import */
// Based on https://github.com/MauricioRobayo/nextjs-google-analytics
// but it currently not have full support for Next.js 13
// and it uses next/router instead of next/navigation, which not working in `app/`
// next/router used for tracking page activity, which already covered by google analytics
// possible to remove this component when https://github.com/MauricioRobayo/nextjs-google-analytics/issues/304 will be fixed
import React from 'react'

import type { ScriptProps } from 'next/script'
import Script from 'next/script' // not allow lazy load component

interface GoogleAnalyticsProps {
  gaMeasurementId?: string
  gtagUrl?: string
  strategy?: ScriptProps['strategy']
  debugMode?: boolean
}

type WithPageView = GoogleAnalyticsProps & {
  trackPageViews?: boolean
}

type WithIgnoreHashChange = GoogleAnalyticsProps & {
  trackPageViews?: {
    ignoreHashChange: boolean
  }
}

export default function GoogleAnalytics({
  debugMode = false,
  gaMeasurementId,
  gtagUrl = 'https://www.googletagmanager.com/gtag/js',
  strategy = 'afterInteractive',
}: WithPageView | WithIgnoreHashChange): JSX.Element | null {
  const _gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId

  if (!_gaMeasurementId) {
    return null
  }

  return (
    <>
      <Script src={`${gtagUrl}?id=${_gaMeasurementId}`} strategy={strategy} />
      <Script id="nextjs-google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${_gaMeasurementId}', {
              page_path: window.location.pathname,
              ${debugMode ? `debug_mode: ${debugMode},` : ''}
            });
          `}
      </Script>
    </>
  )
}
