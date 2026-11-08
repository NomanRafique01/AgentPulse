const { app, BrowserWindow, screen } = require("electron");

function createWindow() {
  const width = 360, height = 160;
  const { workArea } = screen.getPrimaryDisplay();

  const win = new BrowserWindow({
    width, height,
    x: Math.round(workArea.x + (workArea.width - width) / 2),  // top center
    y: workArea.y,
    frame: false,            // no title bar
    transparent: true,       // only the signal is visible
    backgroundColor: "#00000000",
    resizable: false,
    alwaysOnTop: true,       // floats above other apps
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: { autoplayPolicy: "no-user-gesture-required" }
  });

  win.setAlwaysOnTop(true, "screen-saver");
  win.loadFile("index.html");

  // No title bar, so press Esc to close the app
  win.webContents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown" && input.key === "Escape") app.quit();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
