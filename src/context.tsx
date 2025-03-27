import {
  createContext,
  useContext as useReactContext,
  useEffect,
  useState
} from 'react'

export type TVideo = {
  title: string
  watchedSeconds: number
}

interface ContextType {
  token: string | null
  handleSetToken: (token: string | null) => void
  handleRemoveToken: () => void
  goalMinutes: string
  currentMinutes: string
  goalReached: boolean
  setGoalMinutes: (value: string) => void
  setCurrentMinutes: (value: string) => void
  setGoalReached: (value: boolean) => void
  videos: TVideo[]
  addHours: (title: string, duration: number) => Promise<boolean>
}

const Context = createContext<ContextType | undefined>(undefined)

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )

  const timezone = -new Date().getTimezoneOffset() / 60
  const dateString = new Date().toLocaleDateString('en-CA')

  const [goalMinutes, setGoalMinutes] = useState(
    localStorage.getItem('goalMinutes') ?? '60'
  )
  const [currentMinutes, setCurrentMinutes] = useState(
    localStorage.getItem('dateString') === dateString
      ? localStorage.getItem('currentMinutes') || '0'
      : '0'
  )
  const [goalReached, setGoalReached] = useState(
    localStorage.getItem('dateString') === dateString
      ? localStorage.getItem('goalReached') === 'true'
      : false
  )

  const [videos, setVideos] = useState<TVideo[]>([])

  const handleSetToken = (token: string | null) => {
    // This makes it accessible to background script
    chrome.storage.local.set({ token: token }, () => {
      console.log('Token saved and accessible to background script')
    })
    setToken(token)
  }

  const handleRemoveToken = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const getDayWatchedTime = async () => {
    try {
      const response = await fetch(
        `https://www.dreamingspanish.com/.netlify/functions/dayWatchedTime?date=${dateString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      return data
        ? {
            goalReached: data.dayWatchedTime.goalReached,
            timeSeconds: data.dayWatchedTime.timeSeconds
          }
        : null
    } catch (error) {
      console.error('Error fetching day watched time:', error)
      return null
    }
  }

  const getUser = async () => {
    try {
      const response = await fetch(
        `https://www.dreamingspanish.com/.netlify/functions/user?timezone=${timezone}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      return data?.user
        ? { dailyGoalSeconds: data.user.dailyGoalSeconds }
        : null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  function generateUniqueId() {
    const timestamp = Date.now()
    const randomComponent = Math.random()
    const uniqueId = `${timestamp}${randomComponent}`
    return uniqueId
  }

  async function addHours(title: string, duration: number) {
    const body = {
      date: new Date().toLocaleString('en-CA').split(',')[0],
      description: `${title} -- Logged by DreamingSync`,
      id: generateUniqueId(),
      timeSeconds: duration,
      type: 'watching'
    }

    try {
      await fetch(
        'https://www.dreamingspanish.com/.netlify/functions/externalTime',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        }
      )

      const newCurrentMinutes = String(
        Number(currentMinutes) + Math.floor(duration / 60)
      )
      setCurrentMinutes(newCurrentMinutes)
      localStorage.setItem('currentMinutes', newCurrentMinutes)

      if (newCurrentMinutes <= goalMinutes) {
        setGoalReached(true)
        localStorage.setItem('goalReached', 'true')
      }

      return true
    } catch (error) {
      console.error('Error adding time:', error)
    }
    return false
  }

  const fetchProgressData = async () => {
    const dayData = await getDayWatchedTime()
    const userData = await getUser()

    if (dayData && userData) {
      setCurrentMinutes(String(dayData.timeSeconds / 60))
      setGoalMinutes(String(userData.dailyGoalSeconds / 60))
      setGoalReached(dayData.goalReached)

      localStorage.setItem('currentMinutes', String(dayData.timeSeconds / 60))
      localStorage.setItem(
        'goalMinutes',
        String(userData.dailyGoalSeconds / 60)
      )
      localStorage.setItem('goalReached', dayData.goalReached.toString())
      localStorage.setItem('dateString', dateString)
    }
  }

  const fetchVideoData = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].id) {
        console.error("Can't find active tab")
        return
      }

      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'GET_VIDEO_DATA' },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
          } else {
            if (response) setVideos(response)
          }
        }
      )
    })
  }

  useEffect(() => {
    fetchProgressData()
    fetchVideoData()
  }, [token])

  return (
    <Context.Provider
      value={{
        token,
        handleSetToken,
        handleRemoveToken,
        goalMinutes,
        currentMinutes,
        goalReached,
        setGoalMinutes,
        setCurrentMinutes,
        setGoalReached,
        videos,
        addHours
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useContext() {
  const context = useReactContext(Context)
  if (!context)
    throw new Error('useContext must be used within a ContextProvider')
  return context
}
