const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : './',
    productionSourceMap: process.env.NODE_ENV !== 'production',
    // 对node_modules下的文件babel转换
    transpileDependencies: [
        /[/\\]node_modules[/\\]_superstruct@1.0.3@superstruct[/\\]/
    ],
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
            .set('public', resolve('public'))
        config.module
            .rule('compile')
            .test(/\.mjs$/)
            .include
            .add(path.join(__dirname, './node_modules/_superstruct@1.0.3@superstruct'))
            .add(path.join(__dirname, './node_modules/@metamask'))
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({
                presets: [
                    ['@babel/preset-env', { modules: false }]
                ]
            })
    },
    devServer: {
        https: true
    }
}
