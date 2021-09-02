var express = require("express");
var http = require("http");
var server = null
var port = 10024;

module.exports = {
  create(path, callback) {
    var app = express();
    app.use(
      express.static(path, {
        setHeaders: function(res, path, stat) {
          res.set("Access-Control-Allow-Origin", "*");
        }
      })
    );
    app.set("port", port);
    server = http.createServer(app);
    server.listen(port);
    server.on("error", (error) => {
      console.error(error)
    });
    server.on("listening", () => {
      console.log("Listening on http://127.0.0.1:10024");
      if (callback) {
        callback(true)
      }
    });
    server.timeout = 0;
  },
  remove() {
    if (server) {
      console.log('server removed')
      server.close()
      server = null
    }
  }
}
