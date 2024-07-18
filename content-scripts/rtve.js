chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {

    const data = {
      site: 'rtve play',
      page: document.title,
    };

    const videoCurrent = document.querySelector('div.vjs-current-time-display').innerText
    const videoRemaining = document.querySelector('div.vjs-remaining-time-display').innerText

    if (videoCurrent !== '') {
      const watchedSeconds = convertToSeconds(videoCurrent)
      data.watchedSeconds = watchedSeconds
      if (videoRemaining !== '') data.lengthSeconds = watchedSeconds + convertToSeconds(videoRemaining.replaceAll('-', ''))
    }

    sendResponse(data);
  }
  return true;
});
