chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getData'}, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            document.getElementById('data').innerText = 'Error getting videos.';
        } else {
          const dataDiv = document.getElementById('data')
          console.log('response.videos')
          console.log(response.videos)
          for (const video of response.videos) {
                // Select the div where you want to add the button
                const buttonContainer = document.getElementById('button-container');

                // Create a new button element
                const newButton = document.createElement('button');
                newButton.innerText = video.title;
                newButton.addEventListener('click', () => {
                    console.log('New button clicked');
                });

                // Add the new button to the selected div
                buttonContainer.appendChild(newButton);
          }
          document.getElementById('data').innerText = `Title: ${response.title}\nURL: ${response.url} vidInfo: ${response.videos}`;
        }
    });
});
