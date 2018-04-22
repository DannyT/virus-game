'use strict'

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')


// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'src/phaser.js')

module.exports = {
  entry: { 
        app: ['./src/index.js'],
        vendor: ['phaser']
  },
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.DefinePlugin({
        WEBGL_RENDERER: true,
        CANVAS_RENDERER: true
    }),
    new CopyWebpackPlugin([
        {   
            from:path.resolve(__dirname,'assets'), 
            to:path.resolve(__dirname, 'dist', 'assets')
        },
        'index.html'
    ])
    ],
    module: {
        rules: [
            { 
                test: [/\.vert$/, /\.frag$/], 
                use: 'raw-loader' 
            }
        ]
    },
};