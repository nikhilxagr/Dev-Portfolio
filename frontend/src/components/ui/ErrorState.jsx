import Button from '@/components/ui/Button'

const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => {
  return (
    <div className="card-surface rounded-2xl p-6 text-center">
      <h3 className="text-lg font-semibold text-rose-200">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{message}</p>
      {onRetry ? (
        <div className="mt-4">
          <Button variant="ghost" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default ErrorState
