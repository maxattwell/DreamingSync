chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === 'GET_VIDEO_DATA') {
    const video = document.querySelector('video')

    if (!video) {
      sendResponse()
      return true
    }

    const data = [
      {
        title: document.title,
        watchedSeconds: video.currentTime
      }
    ]

    sendResponse(data)
  }
  return true
})
