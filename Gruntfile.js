/* jshint esversion: 6 */
/*global module:false*/

const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const pug = require('pug');
const path = require('path');

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    'babel': {
      options: {
        sourceMap: true,
        minified: true,
        comments: false
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/demo/js',
          src: ['*.js'],
          dest: 'demo/js/',
          ext: '.js'      
        },{
          expand: true,
          cwd: 'build/js',
          src: ['*.js'],
          dest: 'dist/js/',
          ext: '.js'
        },{
          expand: true,
          cwd: 'build/js',
          src: ['*.js'],
          dest: 'demo/js/',
          ext: '.js'
        }]
      }
    },
    browserify: {
      apiclient: {
        files: {
          'build/js/metamind-client-bundle.js': ['src/browser/main.js']
        }
      }
    }
  });
  
  grunt.registerTask('default', ['browserify:apiclient', 'babel' ]);
};