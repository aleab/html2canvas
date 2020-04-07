import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";

const pkg = require('./package.json');

const banner = `/*!
 * ${pkg.title} ${pkg.version} <${pkg.homepage}>
 * Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name} <${pkg.author.url}>
 * Released under ${pkg.license} License
 */`;

const extensions = [ '.js', '.ts', '.jsx', '.tsx', '.mjs' ];

export default {
    input: `src/index.ts`,
    output: [
        { file: `dist/${pkg.name}.js`, name: pkg.name, format: 'umd', banner, sourcemap: true },
        {
            file: `dist/${pkg.name}.min.js`,
            name: pkg.name,
            format: 'umd',
            banner,
            plugins: [terser({
                compress: true,
                mangle: true,
                output: {
                    comments: /^!/
                }
            })]
        },
        { file: `dist/${pkg.name}.esm.js`, format: 'esm', banner, sourcemap: true },
    ],
    external: [],
    watch: {
        include: 'src/**',
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
        commonjs(),
        // Compile TypeScript files
        babel({
            exclude: 'node_modules/**',
            extensions
        }),
        // Resolve source maps to the original source
        sourceMaps(),
    ],
}
