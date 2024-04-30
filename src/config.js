const isProduction = process.argv.slice(2).includes('prod');

const config = {
    production : isProduction,
    development : !isProduction,
    deployment : isProduction ? 'PRODUCTION' : 'DEVELEOPMENT',
}

export default config;