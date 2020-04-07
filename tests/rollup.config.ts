import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import path from 'path';

const pkg = require('../package.json');

const banner = `/*
 * ${pkg.title} ${pkg.version} <${pkg.homepage}>
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.url}>
 * Released under ${pkg.license} License
 */`;

const extensions = [ '.js', '.ts', '.jsx', '.tsx', '.mjs' ];

export default {
    input: `tests/testrunner.ts`,
    output: [
        {
            file: path.resolve(__dirname, '../build/testrunner.js'),
            name: 'testrunner',
            format: 'iife',
            banner,
            sourcemap: true
        }
    ],
    external: [],
    watch: {
        include: 'tests/**'
    },
    plugins: [
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve({
            mainFields: [ 'module', 'main', 'browser' ],
            extensions
        }),
        // Allow json resolution
        json(),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs({
            namedExports: {
                'node_modules/platform/platform.js': ['name', 'version'],
                'node_modules/es6-promise/dist/es6-promise.js': ['Promise']
            }
        }),
        // Compile TypeScript files
        babel({
            exclude: 'node_modules/**',
            extensions
        }),

        // Resolve source maps to the original source
        sourceMaps()
    ]
};
