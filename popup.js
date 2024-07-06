chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'getData' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      document.getElementById('data').innerText = 'Error getting videos.';
    } else {
      const dataDiv = document.getElementById('data')
      document.getElementById('site-name').innerText = response.site
      document.getElementById('page').innerText = response.page

      console.log('response.videos')
      console.log(response.videos)
      if (response.videos) {
        for (const video of response.videos) {
          // Select the div where you want to add the button
          const videoContainer = document.getElementById('video-container');

          const newVideo = document.createElement('div')

          const newVideoTitle = document.createElement('p')
          newVideoTitle.innerText = video.title

          // Create a new button elements
          const lengthButton = document.createElement('button');
          const watchedButton = document.createElement('button');
          lengthButton.innerText = video.length;
          watchedButton.innerText = video.watched;
          // newButton.addEventListener('click', () => {
          //   console.log('New button clicked');
          // });

          // Add the new button to the selected div
          newVideo.appendChild(newVideoTitle)
          newVideo.appendChild(lengthButton);
          newVideo.appendChild(watchedButton);
          videoContainer.appendChild(newVideo)
        }
      }
    }
  });
});
