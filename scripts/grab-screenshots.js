const Pageres = require('pageres');

console.log('Started grab-screenshots.js');
const pageres = new Pageres({delay: 2})
        .src('mggwxyz.github.io/frontend-nanodegree-arcade-game', ['1280x1024', '1920x1080', '320x568'])
        .dest(__dirname)
        .run()
        .then(function(){ console.log('Finished grab-screenshots.js');});