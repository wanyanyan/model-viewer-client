import { ipcMain, dialog } from "electron";
import fs from 'fs'
import path from 'path'
import Constants from '../libs/constants'
import xlsx from 'node-xlsx'

function initReference() {
  ipcMain.on("open_model_path", openModelPath)
  ipcMain.on("open_xlsx_path", openXlsxPath)
  ipcMain.on("generate_preference_start", generatePreference)
}

function openModelPath(e) {
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
        e.reply("model_path_success", path);
      }
    });
}

function openXlsxPath(e) {
  dialog
    .showOpenDialog({
      filters: [
        { name: "XLSX", extensions: ["xlsx"] }
      ],
      properties: ["openFile"]
    })
    .then(result => {
      let { canceled, filePaths } = result;
      if (canceled) {
        return;
      } else {
        let path = filePaths[0];
        e.reply("xlsx_path_success", path);
      }
    });
}

function generatePreference(e, options) {
  let results = {
    name: '',
    bbox: null,
    origin: null,
    des: '',
    metadata: {},
    models: []
  }
  let {modelsPath, xlsxPath} = options
  let supportedFormats = Constants.formats
  let files = fs.readdirSync(modelsPath);
  files.forEach(item => {
    let info = fs.statSync(path.resolve(modelsPath, item))
    if (info.isFile()) {
      let arr = item.split(".");
      let filename = arr[0]
      let filetype = arr[1]
      if (filetype === 'json' || supportedFormats.indexOf(filetype) === -1) {
        return
      }
      if (filetype === 'glb') {
        filetype = 'gltf'
      }
      results.models.push({
        id: filename,
        type: 'model',
        name: filename,
        format: filetype,
        model: item,
        properties: {}
      })
    } else if (info.isDirectory()) {
      // 子目录
    }
  })
  // 实例化模型
  if (xlsxPath) {
    let sheet = xlsx.parse(fs.readFileSync(xlsxPath))[0]
    let obj = []
    let data = sheet['data']
    let keys = data[0]
    for(let i = 1; i < data.length;i++) {
      let row = data[i]
      let temp = {}
      for(let j=0;j<keys.length;j++) {
        temp[keys[j]] = row[j]
      }
      obj.push(temp)
    }
    obj.forEach(item => {
      if (!item.ref_name) {
        return
      }
      let refItem = obj.find(d => d.name === item.ref_name)
      results.models.push({
        id: item.name,
        type: 'virtual_model',
        name: item.name,
        ref: item.ref_name,
        location: [item.px - refItem.px, item.py - refItem.py, item.pz - refItem.pz],
        rotation: [item.rx - refItem.rx, item.ry - refItem.ry, item.rz - refItem.rz],
        properties: {}
      })
    })
  }
  let metadataPath = path.resolve(modelsPath, 'metadata.json')
  fs.writeFile(metadataPath, JSON.stringify(results, null, 2), res => {
    e.reply("generate_reference_success", metadataPath);
  })
}

export default initReference