chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {

    const data = {
      site: 'twitch',
      page: document.title,
    };

    const videoDuration = document.querySelector('p[data-a-target="player-seekbar-duration"]').innerText
    const videoCurrent = document.querySelector('p[data-a-target="player-seekbar-current-time"]').innerText


    if (videoDuration !== '') data.lengthSeconds = convertToSeconds(videoDuration)
    if (videoCurrent !== '') data.watchedSeconds = convertToSeconds(videoCurrent)

    sendResponse(data);
  }
  return true;
});
