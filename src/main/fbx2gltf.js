import { ipcMain, dialog } from "electron";
import path from "path";
import fbx2gltf from "../libs/fbx2gltf";
import log from "electron-log";
log.transports.file.file = ".\\log.txt";

function initFbx2Gltf() {
  ipcMain.on("fbx_gltf_input", openInputPath);
  ipcMain.on("fbx_gltf_output", openOutputPath);
  ipcMain.on("fbx_gltf_start", startConvert);
}

function openInputPath(e) {
  dialog
    .showOpenDialog({
      filters: [{ name: "FBX File", extensions: ["fbx"] }],
      properties: ["openFile", "multiSelections"]
    })
    .then(result => {
      let { canceled, filePaths } = result;
      if (canceled) {
        return;
      } else {
        e.reply("fbx_input_path_success", filePaths);
      }
    });
}

function openOutputPath(e) {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"]
    })
    .then(result => {
      let { canceled, filePaths } = result;
      if (canceled) {
        return;
      } else {
        let path = filePaths[0];
        e.reply("fbx_output_path_success", path);
      }
    });
}

function startConvert(e, options) {
  let { inputs, binary, draco, compress_level, outputPath } = options;
  let total = inputs.length;
  let currentIndex = 0;
  let args = []
  inputs.forEach(fullpath => {
    let objname = path.basename(fullpath).split(".")[0];
    let objpath = path.dirname(fullpath);
    let filetype = 'gltf'
    if (binary) {
      args.push("--binary");
      filetype = 'glb'
    }
    if (draco) {
      args.push("--draco", "--draco-compression-level", compress_level);
    }
    fbx2gltf(fullpath, path.resolve(outputPath || objpath, `${objname}.${filetype}`), args).then(() => {
      currentIndex++;
      e.reply("fbx_gltf_progress", ((currentIndex / total) * 100).toFixed(2));
    });
  });
}

export default initFbx2Gltf;
