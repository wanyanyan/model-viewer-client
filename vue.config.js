module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("iview")
      .loader("iview-loader")
      .options({ prefix: false });
  }
};
