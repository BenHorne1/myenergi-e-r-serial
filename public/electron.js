const fs = require("fs");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { data } = require("autoprefixer");

const isDevMode = process.env.NODE_ENV !== "production";

let mainWindow;
let saveLocation;

const configPath = getConfigFilePath();
const congfigPreset = {
  config: {
    UDPPort: "8081",
    SaveLocation: "savelocation",
  },
};

function createConfig() {
  // check if the config file is present

  fs.access(configPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("config does not exist");
      console.log("creating config file");
      try {
        fs.writeFileSync(
          configPath,
          JSON.stringify(congfigPreset, null, 2),
          "utf-8"
        );

        dialog.showMessageBox(mainWindow, {
          type: "info",
          message:
            "Config initialised. Please set directory path to save CSV files to",
          title: "Config initialised",
          buttons: ["OK"],
        });
      } catch (error) {
        console.error("Error creating config file: ", error);
      }
    } else {
      console.log("Config Exists");
    }
  });
}

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

const currentDate = new Date();
const formattedDate = formatDateToYYYYMMDD(currentDate);

function createWindow() {
  const preload = path.join(__dirname, "preload.js");
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    title: "myenergy Serial Port mode",
    width: 1500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableBlinkFeatures: "Serial",
      preload,
    },
  });

  // Serial Port

  mainWindow.webContents.session.on(
    "select-serial-port",
    (event, portList, webContents, callback) => {
      console.log("SELECT-SERIAL-PORT FIRED WITH", portList);

      mainWindow.webContents.send("port:list", portList);
      //Display some type of dialog so that the user can pick a port
      // dialog.showMessageBoxSync({

      // });
      // event.preventDefault();

      let selectedPort = portList.find((device) => {
        // Automatically pick a specific device instead of prompting user
        //return device.vendorId == 0x2341 && device.productId == 0x0043;

        // Automatically return the first device
        return true;
      });
      if (!selectedPort) {
        callback("");
      } else {
        callback(selectedPort.portId);
      }
    }
  );

  mainWindow.webContents.session.on("serial-port-added", (event, port) => {
    console.log("serial-port-added FIRED WITH", port);
    event.preventDefault();

    //mainWindow.webContents.send()
  });

  mainWindow.webContents.session.on("serial-port-removed", (event, port) => {
    console.log("serial-port-removed FIRED WITH", port);
    event.preventDefault();
  });

  mainWindow.webContents.session.on("select-serial-port-cancelled", () => {
    console.log("select-serial-port-cancelled FIRED.");
  });

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      // This permission check handler is not needed by default but available if you want to limit serial requests
      console.log(`In PermissionCheckHandler`);
      console.log(`Webcontents url: ${webContents.getURL()}`);
      console.log(`Permission: ${permission}`);
      console.log(`Requesting Origin: ${requestingOrigin}`, details);
      return true;
    }
  );

  //load the index.html from a url
  mainWindow.loadURL("http://localhost:3000");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createConfig).then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// append to CSV
function appendToCSV(filePath, csvLine) {
  console.log("file path ", filePath);
  fs.appendFile(filePath, csvLine, (err) => {
    if (err) {
      console.error("Error writing to CSV file: ", err);
    } else {
      console.log("Data appended to CSV file: ", csvLine);
    }
  });
}

// update csv
ipcMain.on("csv:graphData", (e, data) => {
  console.log("Graph data ", data);

  const time = new Date();
  const timeStr = time.toLocaleTimeString();

  let logFileName = formattedDate + "serial_" +  "GraphData.csv";

  console.log(logFileName);
  appendToCSV(
    saveLocation + "\\" + logFileName,
    `${timeStr},${data.graphData.v1},${data.graphData.v2},${data.graphData.v3},${data.graphData.v4},\n`
  );
});

// Update config.json

function getConfigFilePath() {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "config.json");
}

function saveConfig(config) {
  const configPath = getConfigFilePath();
  console.log("User data path", configPath);
  config = { config };
  saveLocation = config.config.saveLocation;
  console.log("saving config", config);

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log("Configuration file saved successully");
  } catch (error) {
    console.error("Error sacing configuration fileL", error);
  }
}

function loadConfig() {
  const configPath = getConfigFilePath();

  try {
    const data = JSON.parse(fs.readFileSync(configPath, "utf-8"));
 
    saveLocation = data.config.SaveLocation;
    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      // Handle the case where the file doesn't exist (e.g., provide default config)
      return {};
    }
    console.error("Error loading configuration file: ", error);
    return {};
  }
}

ipcMain.on("SAVE_CONFIG", (e, data) => {
  saveConfig(data);
});

ipcMain.handle("loadConfig", () => {
  try {
    console.log("INVOKE!!!!!!!!!!!!!");

    const data = loadConfig();
    console.log("loading config data ", data);
    return data;
  } catch (error) {
    return error.message;
  }
});
