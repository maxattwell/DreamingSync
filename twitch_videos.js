chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {

    const videoDuration = document.querySelector('p[data-a-target="player-seekbar-duration"]').innerText
    const videoCurrent = document.querySelector('p[data-a-target="player-seekbar-current-time"]').innerText

    const data = {
      site: 'twitch',
      page: document.title,
      lengthSeconds: convertToSeconds(videoDuration),
      watchedSeconds: convertToSeconds(videoCurrent)
    };
    sendResponse(data);
  }
  return true;
});
