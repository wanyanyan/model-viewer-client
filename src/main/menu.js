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
      label: '编辑',
      submenu: [{
        label: '国内新闻',
        submenu: [{
            label: '北京新闻'
        }, {
            label: '河南新闻'
        }]
      }, {
          label: '国际新闻'
      }]
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
