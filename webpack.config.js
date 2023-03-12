const path = require('path');
const fs = require("fs");

const webpack = require('webpack');

const job = async () => {

    const environment = process.env.NODE_ENV;
    console.log('environment:::::', environment);

    const ENVIRONMENT_VARIABLES = {};
    /*
        Use synchronous or asynchronous processes to load environment variables into
        the ENVIRONMENT_VARIABLES object here.
        E.g.
            1. Read .env files using fs in synchronous/asynchronous fashion
            2. Iterate over secrets asynchronously from Cloud Secret Manager.
    */

    const allFileContents = fs.readFileSync('.env', 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line => {
        if (line.trim() == '')
            return;
        const strings = line.split(" = ");
        const key = `process.env.${strings[0]}`;
        const val = JSON.stringify(strings[1]);
        ENVIRONMENT_VARIABLES[key] = val;
    });

    console.log(ENVIRONMENT_VARIABLES);

    return {
        entry: './src/index.ts',
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        target: 'node',
        output: {
            filename: 'api.bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new webpack.DefinePlugin(ENVIRONMENT_VARIABLES),
        ],
    };
}
module.exports = job;