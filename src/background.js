'use strict'

import { app, protocol, BrowserWindow } from 'electron'
// const {ipcMain} = require('electron')
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

import store from './store'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })
  if (!isDevelopment) {
    win.removeMenu()
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // Open Dev Tools
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
  win.maximize()
  win.on('closed', () => {
    win = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  startSMTPServer()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function startSMTPServer () {
  const SMTPServer = require('smtp-server').SMTPServer;
  const simpleParser = require('mailparser').simpleParser;

  const server = new SMTPServer({
    authOptional: true,
    maxAllowedUnauthenticatedCommands: 1000,
    onMailFrom(address, session, cb) {
      cb();
    },
    onAuth(auth, session, callback) {
      callback(null, {
        user: auth.username
      });
    },
    onData(stream, session, callback) {
      parseEmail(stream).then(
        mail => {
          store.dispatch('addMail', {
            mail: mail
          });

          callback();
        },
        callback
      );
    }
  });

  function parseEmail(stream) {
    return simpleParser(stream).then(email => {
      email.headers = formatHeaders(email.headers);
      console.log(email)
      return email;
    });
  }

  function formatHeaders(headers) {
    const result = {};
    for (const [key, value] of headers) {
      result[key] = value;
    }
    return result;
  }

  server.on('error', err => {
    console.error(err)
  });

  server.listen(2525, '0.0.0.0');
}
