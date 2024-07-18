chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {

    const data = {
      site: 'YouTube',
      page: document.title,
    };

    const videoDuration = document.querySelector('span.ytp-time-duration').innerText
    const videoCurrent = document.querySelector('span.ytp-time-current').innerText

    if (videoDuration !== '') data.lengthSeconds = convertToSeconds(videoDuration)
    if (videoCurrent !== '') data.watchedSeconds = convertToSeconds(videoCurrent)

    sendResponse(data);
  }
  return true;
});
