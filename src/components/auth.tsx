import Login from './login'
import Button from './button'
import Progress from './progress'
import CheckIcon from './icons/check'
import Video from './video'
import { useContext } from '../context'

function Auth() {
  const { token, handleSetToken, handleRemoveToken, videos, addHours } =
    useContext()
  return (
    <div className="flex-1 flex flex-col">
      {token ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <Progress />

          {videos.map((v, i) => (
            <Video
              key={i}
              video={v}
              onSubmit={(data) => addHours(data.title, data.watchedSeconds)}
            />
          ))}
          <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-xs">
            <div className="mb-4 text-green-600 animate-bounce-slow">
              <CheckIcon />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Logged In Successfully
            </h2>
            <p className="text-gray-600 mb-4">
              Your Dreaming Spanish account is connected and ready.
            </p>
            <Button onClick={handleRemoveToken} color="orange">
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <Login setToken={handleSetToken} />
        </div>
      )}
    </div>
  )
}
export default Auth
