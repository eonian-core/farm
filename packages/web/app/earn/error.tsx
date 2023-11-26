'use client'

import React from 'react'
import IconWarning from '../components/icons/icon-warning'
import { useMonitoringContext } from '../providers/monitoring'
import styles from './layout.module.scss'

export default function Error({ error }: { error: Error }) {
  const { reportError } = useMonitoringContext()

  // Manually send handled exception to LogRocket
  React.useEffect(() => {
    reportError(error, 'earn')
  }, [reportError, error])

  return (
    <div className={styles.error}>
      <IconWarning width="3em" height="3em" />
      <div className={styles.errorMessage}>
        Error occured: <b>{error.message}</b>
      </div>
    </div>
  )
}
