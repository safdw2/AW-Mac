const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow
let splash
let firstLoad = true

function createWindow() {

  const logoPath = path.join(__dirname, 'assets', 'icon.png')
  const logoBase64 = fs.readFileSync(logoPath).toString('base64')
  const logoUrl = `data:image/png;base64,${logoBase64}`

  // 🟡 SPLASH SCREEN (PRO)
  splash = new BrowserWindow({
    width: 520,
    height: 360,
    frame: false,
    alwaysOnTop: true,
    backgroundColor: '#ffffff',
    resizable: false
  })

  splash.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
<html>
<head>
<style>
body{
  margin:0;
  background:#fff;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  font-family:sans-serif;
}

.container{
  text-align:center;
}

.logo{
  width:120px;
  height:120px;
  animation:spin 2.4s infinite ease-in-out;
}

@keyframes spin{
  0%{transform:rotate(0deg)}
  70%{transform:rotate(360deg)}
  100%{transform:rotate(360deg)}
}

.bar{
  width:320px;
  height:8px;
  background:#eee;
  border-radius:20px;
  overflow:hidden;
  margin-top:15px;
}

.fill{
  width:0%;
  height:100%;
  background:linear-gradient(90deg,#00aaff,#00ffcc);
  transition: width .1s linear;
}
</style>
</head>

<body>
  <div class="container">
    <img class="logo" src="${logoUrl}">
    <div class="bar"><div class="fill" id="bar"></div></div>
  </div>

<script>
let p = 0
let smooth = 0

window.int = setInterval(() => {

  p += Math.random() * 1.5 + 0.5
  if (p > 100) p = 100

  smooth += (p - smooth) * 0.08

  document.getElementById('bar').style.width = smooth + '%'

  if (p >= 100) clearInterval(window.int)

}, 40)
</script>
</body>
</html>
`))

  // 🖥 MAIN WINDOW
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      devTools: false,
      partition: "persist:awapp"
    }
  })

  mainWindow.loadURL('https://www.2aclassweb.com/')

  // clean app feel
  mainWindow.setMenuBarVisibility(false)

  mainWindow.webContents.on('context-menu', e => e.preventDefault())

  // 🧠 FIRST LOAD TRANSITION (PRO STYLE)
  mainWindow.webContents.on('did-finish-load', () => {

    if (!firstLoad) return
    firstLoad = false

    mainWindow.show()

    if (splash && !splash.isDestroyed()) {

      splash.webContents.executeJavaScript(`
        clearInterval(window.int);
        document.getElementById("bar").style.width = "100%";

        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = "0";
      `).catch(() => {})

      setTimeout(() => {
        if (splash && !splash.isDestroyed()) splash.close()
      }, 600)
    }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})