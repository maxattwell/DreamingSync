chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {

    const data = {
      site: 'YouTube - History',
      page: document.title,
      videos: getPageVideos()
    };
    sendResponse(data);
  }
  return true;
});

function getPageVideos() {
  const videos = document.querySelectorAll('ytd-video-renderer');
  const videosData = []

  videos.forEach(video => {

    const videoDuration = video.querySelector('.badge-shape-wiz__text').innerText;
      const videoProgress = video.querySelector('#progress').style.width

      console.log(convertToSeconds(videoDuration))
      console.log(calculateWatchedTime(videoDuration, videoProgress))
    videosData.push({
      title: video.querySelector('#video-title').innerText,
      lenghtSeconds: convertToSeconds(videoDuration),
      watchedSeconds: calculateWatchedTime(videoDuration, videoProgress)
    })
  });
  return videosData
}
