'use strict';

module.exports = {
  json: {
    files: ['src/api/*.json'],
    tasks: ['copy:json']
  },
  images: {
    files: [
      'src/img/dest/*.*'
    ],
    tasks: ['newer:copy:images']
  },
  css: {
    files: ['src/css/**/*.css'],
    tasks: ['copy:css']
  },
  less: {
    files: [
      'src/css/**/*.less',
      'src/components/**/*.less'
    ],
    tasks: ['less:devbuild']
  },
  htmljs: {
    files: ['src/index.html', 'src/**/*.{js,html}'],
    tasks: ['useminPrepare', 'copy:build', 'concat', 'copy:temptobuild', 'usemin', 'newer:jshint:all']
  },
//    grunt: {
//        files: [
//            'Gruntfile.js',
//            'grunt/**/*.js'
//        ],
//        tasks: ['build:dev']
//    },
  templates: {
    files: [
      'src/**/*.html'
    ],
    tasks: ['newer:copy:templates']
  },
  livereload: {
    options: {
      livereload: true
    },
    files: [
      '.build/**/*.*'
    ]
  }
};