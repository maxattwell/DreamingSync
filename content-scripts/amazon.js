chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {

    const data = {
      site: 'Prime Video',
      page: document.title,
    };

    const videoTime = document.querySelector('.atvwebplayersdk-timeindicator-text').innerText
    console.log({ videoTime })
    const [ videoCurrent, videoRemaining ] = videoTime.split(' / ')
    console.log({ videoCurrent })
    console.log({ videoRemaining })

    if (videoCurrent !== '') {
      const watchedSeconds = convertToSeconds(videoCurrent)
      data.watchedSeconds = watchedSeconds
      if (videoRemaining !== '') data.lengthSeconds = watchedSeconds + convertToSeconds(videoRemaining.replaceAll('-', ''))
    }

    sendResponse(data);
  }
  return true;
});
