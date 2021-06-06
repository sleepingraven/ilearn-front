const LearnChapter = require('./src/mock/data/learn-chapter.js');
const LearnDiscussion = require('./src/mock/data/learn-discussion');

module.exports = {
  runtimeCompiler: true,
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
        headers: {
          host: 'http://localhost:8090',
          origin: 'http://localhost:8090',
        },
      },
    },
    before(app) {
      // 开发数据模拟
      // 修改后需要重启
      app.get('/api/learn-chapter', (req, res) => {
        res.json(LearnChapter.chapters);
      });
      app.get('/api/learn-discussion', (req, res) => {
        res.json(LearnDiscussion.posts);
      });
    },
  },
};
