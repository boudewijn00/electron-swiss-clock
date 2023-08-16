const { app, BrowserWindow, ipcMain} = require('electron')
const https = require('https');
const path = require('path')

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 1200,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()

    ipcMain.handle('get-location', async (event) => {
        try {
            const response = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=e0f69c584aa94229b513cbfcb4fd892c')
            const data = await response.text()

            return JSON.parse(data)
          } catch (error) {
            throw new Error('An error occurred in the main process');
          }
    })

    ipcMain.handle('get-weather', async (event, location) => {
        try {
            const response = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat='+location.latitude+'&lon='+location.longitude)
            const data = await response.text()

            return JSON.parse(data)
          } catch (error) {
            throw new Error('An error occurred in the main process');
          }
    })

    ipcMain.handle('get-time', async (event, ...args) => {
        try {
            const result = await getTime(...args)
            return result
          } catch (error) {
            throw new Error('An error occurred in the main process');
          }
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function getTime(...args) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          const result = args.join(', ')
          resolve(result)
        }, 1000);
      })
}
