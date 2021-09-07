const { Menu } = require('electron')
var window = null

function createMenu(win) {
  window = win
  let template = getTemplate()
  var list = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(list)
}

function getTemplate() {
  return [{
      label: '文件',
      submenu: [{
        label: '打开本地文件'
      }, {
        label: '国际新闻'
      }]
    },
    {
      label: '工具',
      submenu: [
        {
          label: 'obj转gltf/glb'
        },
        {
          label: 'obj转drc'
        },
        { type: 'separator' },
        {
          label: '生成配置文件',
          click: () => {
            window.webContents.send('generate_preference_dlg', 'whoooooooh!')
          }
        }
      ]
    },
    {
    label: '视图',
    submenu: [
      { label: '重新加载', role: 'reload' },
      { label: '打开开发者工具', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: '全屏', role: 'togglefullscreen' }
    ]
  }
]
}
export default createMenu
