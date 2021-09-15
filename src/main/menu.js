const { Menu } = require('electron')
import { openLocalModel, importLocalModel } from "./model_import";
var window = null

function createMenu(win) {
  window = win
  let template = getTemplate()
  var list = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(list)
}

function getTemplate() {
  return [
    {
      label: "文件",
      submenu: [
        {
          label: "打开",
          click: () => {
            openLocalModel();
          }
        },
        {
          label: "打开网络模型",
          click: () => {
            window.webContents.send("open_from_network");
          }
        },
        { type: "separator" },
        {
          label: "导入",
          click: () => {
            importLocalModel();
          }
        },
        {
          label: "导入网络模型",
          click: () => {
            window.webContents.send("import_from_network");
          }
        }
      ]
    },
    {
      label: "工具",
      submenu: [
        {
          label: "obj转gltf/glb",
          click: () => {
            window.webContents.send("obj_gltf_dlg");
          }
        },
        {
          label: "fbx转gltf/glb",
          click: () => {
            window.webContents.send("fbx_gltf_dlg");
          }
        },
        {
          label: "obj转drc",
          click: () => {
            window.webContents.send("obj_drc_dlg");
          }
        },
        { type: "separator" },
        {
          label: "生成配置文件",
          click: () => {
            window.webContents.send("generate_preference_dlg", "whoooooooh!");
          }
        }
      ]
    },
    {
      label: "视图",
      submenu: [
        { label: "重新加载", role: "reload" },
        { label: "打开开发者工具", role: "toggleDevTools" },
        { type: "separator" },
        { label: "全屏", role: "togglefullscreen" }
      ]
    }
  ];
}
export default createMenu
