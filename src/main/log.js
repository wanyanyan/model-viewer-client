import { app, dialog } from "electron";
import log from "electron-log";
let date = new Date().toJSON().split('T')[0]
log.transports.file.file = `.\\logs\\${date}.txt`;
log.catchErrors({
  showDialog: false,
  onError(error) {
    dialog
      .showMessageBox({
        title: "An error occurred",
        message: error.message,
        detail: error.stack,
        type: "error",
        buttons: ["忽略", "退出程序"]
      })
      .then(result => {
        if (result.response === 2) {
          app.quit();
        }
      });
  }
});

console.log = log.log;
Object.assign(console, log.functions);