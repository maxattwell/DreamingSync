import { SetupVideos } from './video.js'

const main = document.getElementById('main')
const token = localStorage.getItem('token')

if (token) {
  SetupVideos(main)
} else {
  const preLoginButton = document.getElementById("pre-login-btn")
  preLoginButton.style.display = "inline"
  let tempToken

  preLoginButton.addEventListener('click', () => {
    fetch("https://www.dreamingspanish.com/.netlify/functions/newEphemeralAccount")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok " + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        tempToken = data.token
        document.getElementById('login-container').style.display = "inline";
        preLoginButton.style.display = "none"
      })
      .catch((error) => {
        document.getElementById('login-btn').innerText = "Error"
        console.error("There was a problem with the fetch operation:", error);
      });
  })

  const loginContainer = document.getElementById("login-container")
  const loginButton = document.getElementById("login-btn")
  const loginInput = document.getElementById("login-input")

  const verifyContainer = document.getElementById('verify-container')
  const verifyButton = document.getElementById("verify-btn")
  const verifyInput = document.getElementById("verify-input")

  let email = ""
  let code = undefined

  loginButton.addEventListener('click', () => {
    email = loginInput.value

    fetch('https://www.dreamingspanish.com/.netlify/functions/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify({ email })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        } else {
          loginContainer.style.display = "none";
          verifyContainer.style.display = "inline";
        }
        return response.json();
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  })

  verifyButton.addEventListener('click', () => {
    code = verifyInput.value

    fetch('https://www.dreamingspanish.com/.netlify/functions/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify({ code, email })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        } else {
          loginContainer.style.display = "none";
          verifyContainer.style.display = "none";
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('token', data.token)
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  })

}
