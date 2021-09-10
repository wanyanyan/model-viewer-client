import { ipcMain, dialog } from "electron"
import server from './server'
var window = null

export const initModelImport = (win) => {
  window = win
  ipcMain.on("open_local_model", openLocalModel)
}

export const openLocalModel = (e) => {
  server.remove();
  dialog
    .showOpenDialog({
      filters: [
        { name: "All Model Files", extensions: ["gltf", "glb", "obj", "drc", "json"] },
        { name: "GLTF", extensions: ["gltf", "glb"] },
        { name: "OBJ", extensions: ["obj"] },
        { name: "DRC", extensions: ["drc"] },
        { name: "ModelSet", extensions: ["json"] }
      ],
      properties: ["openFile"]
    })
    .then(result => {
      let { canceled, filePaths } = result;
      if (canceled) {
        return;
      } else {
        let path = filePaths[0];
        let arr = path.split("\\");
        let file = arr.pop().split(".");
        let info = {
          baseUrl: arr.join("\\"),
          filename: file[0],
          filetype: file[1]
        };
        server.create(info.baseUrl, () => {
          if (e) {
            e.reply("selected_local_models", info);
          } else {
            window.webContents.send("selected_local_models", info);
          }
        });
      }
    });
}
