// // var path = require('path');
// // const Pageres = require('pageres');
//
// // console.log('Started grab-screenshots.js');
// // const pageres = new Pageres({delay: 2})
// //         .src('mggwxyz.github.io/pixelpad', ['1280x1024', '1920x1080', '320x568'])
// //         .dest(__dirname)
// //         .run()
// //         .then(function(){ console('Finished grab-screenshots.js');});
//
// var page = require('webpage');
// page.create().open('http://mggwxyz.github.io/pixelpad', function() {
//     page.render('pixelpad.png');
//     phantom.exit();
// });