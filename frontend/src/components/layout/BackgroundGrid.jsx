import { memo } from 'react'

const BackgroundGrid = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-mesh-grid bg-[size:48px_48px] opacity-25"
      aria-hidden="true"
    />
  )
}

const MemoizedBackgroundGrid = memo(BackgroundGrid)
MemoizedBackgroundGrid.displayName = 'BackgroundGrid'

export default MemoizedBackgroundGrid
