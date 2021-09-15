import { ipcMain, dialog } from "electron"
import path from 'path'
import draco from '../libs/draco'

function initObj2Drc() {
  ipcMain.on("obj_drc_input", openInputPath)
  ipcMain.on("obj_drc_output", openOutputPath)
  ipcMain.on("obj_drc_start", startConvert)
}

function openInputPath(e) {
  dialog
    .showOpenDialog({
      filters: [
        { name: 'OBJ File', extensions: ['obj'] }
      ],
      properties: ["openFile", 'multiSelections']
    })
    .then(result => {
      let { canceled, filePaths } = result;
      if (canceled) {
        return;
      } else {
        e.reply("drc_input_path_success", filePaths)
      }
    })
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
        e.reply("drc_output_path_success", path);
      }
    });
}

function startConvert(e, options) {
  let {inputs, compress_level, outputPath} = options
  let total = inputs.length
  let currentIndex = 0
  let args = ['-cl', compress_level]
  inputs.forEach(fullpath => {
    let objname = path.basename(fullpath).split(".")[0];
    let objpath = path.dirname(fullpath);

    draco.encode(fullpath, path.resolve(outputPath || objpath, `${objname}.drc`), args).then(() => {
      currentIndex++;
      e.reply("obj_drc_progress", ((currentIndex / total) * 100).toFixed(2));
    });
  })
}

export default initObj2Drc;