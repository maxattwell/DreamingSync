chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'getData' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      document.getElementById('data').innerText = 'Error getting videos.';
    } else {
      const dataDiv = document.getElementById('data')
      document.getElementById('site-name').innerText = response.site
      document.getElementById('page').innerText = response.page

      if (response.lengthSeconds && response.watchedSeconds) {
        const mainVideo = {
          title: response.page,
          lengthSeconds: response.lengthSeconds,
          watchedSeconds: response.watchedSeconds
        }
        setVideoButtons(mainVideo)
      }

      // if (response.videos) {
      //   for (const video of response.videos) {
      //     setVideoButtons(video)
      //   }
      // }
    }
  });
});


function setVideoButtons(video) {
  const videoContainer = document.getElementById('video-container');

  const newVideo = document.createElement('div')

  const newVideoTitle = document.createElement('p')
  newVideoTitle.innerText = video.title
  newVideo.appendChild(newVideoTitle)

  const watchedButton = document.createElement('button');
  watchedButton.innerText = '+ ' + formatTime(video.watchedSeconds);
  watchedButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'addToDreamingSpanish',
      title: `${video.title} -- Logged by DreamingSync`,
      duration: Math.floor(video.watchedSeconds)
    }, function(response) {
      if (response.success) watchedButton.innerText = 'Added'
      else watchedButton.innerText = 'Error'
    });
  });
  newVideo.appendChild(watchedButton);

  const lengthButton = document.createElement('button');
  lengthButton.innerText = '+ ' + formatTime(video.lengthSeconds);
  lengthButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'addToDreamingSpanish',
      title: `${video.title} -- Logged by DreamingSync`,
      duration: Math.floor(video.lengthSeconds)
    }, function(response) {
      if (response.success) lengthButton.innerText = 'Added'
      else lengthButton.innerText = 'Error'
    });
  });
  newVideo.appendChild(lengthButton);

  videoContainer.appendChild(newVideo)
}

// document.getElementById('get-data').addEventListener('click', () => {
//   chrome.tabs.sendMessage(tabs[0].id, { action: 'getData' }, (response) => {
//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError.message);
//       document.getElementById('data').innerText = 'Error getting videos.';
//     } else {
//       const dataDiv = document.getElementById('data')
//       document.getElementById('site-name').innerText = response.site
//       document.getElementById('page').innerText = response.page

//       if (response.lengthSeconds && response.watchedSeconds) {
//         const mainVideo = {
//           title: response.page,
//           lengthSeconds: response.lengthSeconds,
//           watchedSeconds: response.watchedSeconds
//         }
//         console.log({ mainVideo })
//         setVideoButtons(mainVideo)
//       }

//       console.log('response')
//       console.log(response)
//       if (response.videos) {
//         for (const video of response.videos) {
//           setVideoButtons(response.videos)
//         }
//       }
//     }
//   });
// })
