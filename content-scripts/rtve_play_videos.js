chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {
    selectEpisodiosLink()
    setTimeout(() => {

      const videoCurrent = document.querySelector('div.vjs-current-time-display').innerText
      const videoRemaining = document.querySelector('div.vjs-remaining-time-display').innerText

      const watchedSeconds = convertToSeconds(videoCurrent)
      const lengthSeconds = watchedSeconds + convertToSeconds(videoRemaining.replaceAll('-', ''))

      const data = {
        site: 'rtve play',
        page: document.title,
        watchedSeconds,
        lengthSeconds
      };
      sendResponse(data);
    }, 200)
  }
  return true;
});
