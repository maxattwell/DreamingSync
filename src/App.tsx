import Auth from './components/auth'
import { ContextProvider } from './context'

function App() {
  return (
    <div className="w-[320px] flex flex-col bg-gradient-to-b from-blue-50 to-orange-50 shadow-lg rounded-lg overflow-hidden">
      {/* Header with title - shown in both logged-in and logged-out states */}
      <header className="w-full bg-gradient-to-r from-orange-500 to-amber-500 py-3 px-4 shadow-md">
        <h1 className="text-2xl font-bold text-white text-center tracking-wide">
          DreamingSync
        </h1>
      </header>

      <ContextProvider>
        <Auth />
      </ContextProvider>
    </div>
  )
}

export default App
