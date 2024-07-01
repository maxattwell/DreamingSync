chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addToDreamingSpanish') {
    // Assuming the Dreaming Spanish page is open in a tab
    chrome.tabs.query({ url: "https://www.dreamingspanish.com/*" }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: addHours,
          args: [message.title, message.duration]
        }).then(() => console.log("Injected function."));
      } else {
        console.warn('Dreaming Spanish progress page is not open.');
      }
    });
  }
});

function addHours(title, duration) {
  function generateUniqueId() {
    const timestamp = Date.now();
    const randomComponent = Math.random();
    const uniqueId = `${timestamp}${randomComponent}`;
    return uniqueId;
  }

  const body = {
    date: new Date().toISOString().split('T')[0],
    description: title,
    id: generateUniqueId(),
    timeSeconds: duration,
    type: "watching"
  }

  const token = localStorage.getItem('token')

  fetch('https://www.dreamingspanish.com/.netlify/functions/externalTime', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
