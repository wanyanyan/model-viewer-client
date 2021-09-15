import { ipcMain, dialog } from "electron"
import fs from 'fs'
import path from 'path'
import obj2gltf from '@wanyanyan/obj2gltf'
import gltfPipeline from '@wanyanyan/gltf-pipeline'
import log from 'electron-log'

function initObj2Gltf() {
  ipcMain.on("obj_gltf_input", openInputPath)
  ipcMain.on("obj_gltf_output", openOutputPath)
  ipcMain.on("obj_gltf_start", startConvert)
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
        e.reply("input_path_success", filePaths)
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
        e.reply("output_path_success", path);
      }
    });
}

function startConvert(e, options) {
  let {inputs, binary, draco, compress_level, outputPath} = options
  let total = inputs.length
  let currentIndex = 0
  inputs.forEach(fullpath => {
    let objname = path.basename(fullpath).split('.')[0]
    let objpath = path.dirname(fullpath)
    if (binary) {
      obj2gltf(fullpath, { binary: true }).then(function (glb) {
        if (draco) {
          gltfPipeline.processGlb(glb, {
            dracoOptions: {
              compressionLevel: compress_level
            }
          }).then(results => {
            fs.writeFile(path.resolve(outputPath || objpath, `${objname}.glb`), results.glb, cb)
          }).catch(err => {
            log.error(err.message);
          })
        } else {
          fs.writeFile(path.resolve(outputPath || objpath, `${objname}.glb`), glb, cb)
        }
      })
    } else {
      obj2gltf(fullpath).then(function (gltf) {
        const data = Buffer.from(JSON.stringify(gltf))
        if (draco) {
          gltfPipeline.processGltf(data, {
            dracoOptions: {
              compressionLevel: compress_level
            }
          }).then(results => {
            fs.writeFile(path.resolve(outputPath || objpath, `${objname}.gltf`), results.gltf, cb)
          }).catch(err => {
            log.error(err.message);
          })
        } else {
          fs.writeFile(path.resolve(outputPath || objpath, `${objname}.gltf`), data, cb)
        }
      })
    }
  })

  function cb() {
    currentIndex++;
    e.reply("obj_gltf_progress", ((currentIndex / total) * 100).toFixed(2));
  }
}

export default initObj2Gltf