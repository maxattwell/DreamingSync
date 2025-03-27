import { MouseEventHandler, ReactNode } from 'react'

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>
  color?: 'blue' | 'orange'
  loading?: boolean
  disabled?: boolean
  className?: string
  type?: 'submit'
  children: ReactNode
}

function Button({
  onClick,
  color = 'blue',
  loading = false,
  disabled = false,
  className = '',
  type,
  children
}: ButtonProps) {
  // Define color classes to avoid Tailwind purge issues
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    orange: 'bg-orange-500 hover:bg-orange-600'
  }

  return (
    <button
      type={type}
      className={`${colorClasses[color]} text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
