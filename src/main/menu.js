const { Menu } = require('electron')
const template = [{
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
          label: '生成配置文件'
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

function createMenu() {
  var list = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(list)
}

export default createMenu
