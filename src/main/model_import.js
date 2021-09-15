import { ipcMain, dialog } from "electron"
import server from './server'
var window = null

export const initModelImport = (win) => {
  window = win
  ipcMain.on("open_local_model", openLocalModel)
}

function openFileSelect(e, mode) {
  server.remove();
  dialog
    .showOpenDialog({
      filters: [
        {
          name: "All Model Files",
          extensions: ["gltf", "glb", "obj", "drc", "fbx", "json"]
        },
        { name: "GLTF", extensions: ["gltf", "glb"] },
        { name: "OBJ", extensions: ["obj"] },
        { name: "FBX", extensions: ["fbx"] },
        { name: "DRC", extensions: ["drc"] },
        { name: "ModelSet", extensions: ["json"] }
      ],
      properties: ["openFile", "multiSelections"]
    })
    .then(result => {
      let { canceled, filePaths } = result;
      if (canceled) {
        return;
      } else {
        let path = filePaths[0];
        let arr = path.split("\\");
        arr.pop();
        let info = {
          mode,
          paths: filePaths,
          baseUrl: arr.join("\\")
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


export const openLocalModel = (e) => {
  openFileSelect(e, 'open')
}

export const importLocalModel = (e) => {
  openFileSelect(e, "add")
}