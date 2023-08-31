import React from 'react'
import Spinner from '../../../components/spinner/spinner'

function FlowDiagramLoader() {
  return <div className="flex h-96 items-center justify-center">
    <Spinner size={40} />
  </div>
}

export default FlowDiagramLoader
