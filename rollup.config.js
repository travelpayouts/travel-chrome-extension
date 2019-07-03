import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: [
        'js/index.js',
    ],
    treeshake: true,

    manualChunks(id) {
        if (id.includes('node_modules')) {
            return 'vendor';
        }
    },
    output: {
        dir: 'build',
        format: 'es',
        compact: false,
        chunkFileNames: '[name].js'
    },
    plugins: [
        resolve({
            mainFields: ['module', 'main'],
            browser: true
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        postcss({
            minimize: false,
            extract: 'build/style.css'
        }),
        copy({
            targets: [
                'manifest.json',
                'locales',
                'img',
                'html/bg.html',
                'html/index.html',
                'js/cities_data.js',
                'js/booking_reviews.js',
                'js/storage.js',
                'node_modules/keen-tracking/dist/keen-tracking.min.js',
                'js/initKeen.js',
                'js/iata_codes.js',
                'js/background.js',
                'js/config.js',
                'js/currencies.js',
                'scss/fonts',
                './scss/awesomplete.css'
            ],
            outputFolder: 'build'
        })
    ],
    external: ['./config.js']
};