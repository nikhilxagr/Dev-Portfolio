import { useCallback, useEffect, useState } from 'react'

const useAsyncData = (asyncFn, immediate = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState('')

  const run = useCallback(
    async (...args) => {
      setLoading(true)
      setError('')
      try {
        const result = await asyncFn(...args)
        setData(result)
        return result
      } catch (err) {
        setError(err.message || 'Unable to load data at the moment.')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [asyncFn],
  )

  useEffect(() => {
    if (!immediate) {
      return
    }

    run().catch(() => undefined)
  }, [immediate, run])

  return { data, loading, error, run, setData, setError }
}

export default useAsyncData
