import { useContext } from '../context'
import CheckIcon from './icons/check'

function Progress() {
  const { goalMinutes, currentMinutes, goalReached } = useContext()

  return (
    <div className="w-full text-center bg-white rounded-lg shadow-md max-w-xs p-4">
      <div className="text-lg font-semibold text-gray-800 mb-2">
        {Math.floor(Number(currentMinutes))}/{Math.floor(Number(goalMinutes))}{' '}
        min
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 relative">
        <div
          className="bg-violet-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(100, 100 * (Number(currentMinutes) / Number(goalMinutes)))}%`
          }}
        ></div>
        {goalReached && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-green-600 bg-white rounded-full">
            <CheckIcon />
          </div>
        )}
      </div>
    </div>
  )
}

export default Progress
