'use strict'

var gulp = require('gulp'),
    fs = require('fs'),
    spritesmith = require('gulp.spritesmith');


gulp.task('check', function(cb){
    var exists = fs.existsSync('./src/images');
    if (!exists) 
        fs.mkdirSync('./src/images');
    cb();
});

//sprite 图片和生成图片对应css
gulp.task('sprite', function(cb){
    var files = fs.readdirSync('./src/assets/');
    files.forEach(function(fileName){
        if (fileName !== 'bg') {
            gulp.src('./src/assets/'+fileName+'/*.png').pipe(spritesmith({
                imgName: fileName+'.png',
                cssName: fileName+'.css',
                // cssTemplate: 'scss.template.mustache',
                // cssOpts: fileName+'Src',
                padding: 8
            })).pipe(gulp.dest('./src/images'));
        }
    });
    cb();
});
//合成一个css文件
gulp.task('precss', function(){
    fs.unlinkSync("./src/less/precss.css");
    var files = fs.readdirSync('./src/images');
    files.forEach(function(fileName){
        if (fileName.indexOf(".css") > -1) {
            var text = fs.readFileSync('./src/images/'+fileName, 'utf8');
            var imgName = fileName.replace("css", "png");
            fs.appendFile('./src/less/precss.css', text.replace(new RegExp(imgName, "g"), "../images/"+imgName), 'utf8');
            fs.unlinkSync("./src/images/"+fileName);
        }
    });
});

gulp.task('png', ['check', 'sprite']);