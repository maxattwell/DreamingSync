import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from './button'
import { TVideo } from '../context'

export type TVideoForm = {
  title: string
  watchedHours: number
  watchedMinutes: number
}

function Video({
  video,
  onSubmit
}: {
  video: TVideo
  onSubmit: (data: TVideo) => Promise<boolean>
}) {
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TVideoForm>({
    defaultValues: {
      title: video.title,
      watchedHours:
        video.watchedSeconds >= 3600
          ? Math.floor(video.watchedSeconds / 3600)
          : undefined,
      watchedMinutes:
        video.watchedSeconds % 3600 >= 60
          ? Math.floor((video.watchedSeconds % 3600) / 60)
          : undefined
    }
  })

  const onSubmitForm = async (data: TVideoForm) => {
    setStatus('pending')
    const watchedSeconds =
      (data.watchedHours || 0) * 3600 + (data.watchedMinutes || 0) * 60
    const result = await onSubmit({ title: data.title, watchedSeconds })
    setStatus(result ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <div className="p-4 bg-green-100 text-center text-lg font-bold text-green-800 rounded-lg">
          Success! Video saved.
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <div className="p-4 bg-red-100 text-center text-lg font-bold text-red-800 rounded-lg">
          Error! Failed to save.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full text-start bg-white rounded-lg shadow-md max-w-sm p-4">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2">
        <div>
          <input
            type="text"
            id="title"
            placeholder="Description"
            className={`bg-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:ring-purple-600 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="text-red-500 text-xs italic">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="flex justify-between space-x-2 items-center">
          <div className="relative">
            <input
              type="number"
              id="watchedHours"
              placeholder="0"
              className="bg-gray-200 appearance-none rounded-lg w-full py-2 px-3 text-gray-700 focus:ring pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              {...register('watchedHours', { valueAsNumber: true })}
            />
            <label className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-normal">
              Hours
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              id="watchedMinutes"
              placeholder="0"
              className="bg-gray-200 appearance-none rounded-lg w-full py-2 px-3 text-gray-700 focus:ring pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              {...register('watchedMinutes', { valueAsNumber: true })}
            />
            <label className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-normal">
              Minutes
            </label>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            color="orange"
            className="w-full my-2 font-bold text-lg"
            loading={status === 'pending'}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Video
