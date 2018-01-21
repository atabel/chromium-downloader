const fs = require('fs');
const path = require('path');
const program = require('commander');
const download = require('./chromium-downloader');
const getCurrentPlatform = require('./platform');
const getProgressHandler = require('./download-progress-handler');

const availablePlatforms = ['mac', 'linux', 'win32', 'win64'];
const availablePlatformsStr = availablePlatforms.map(p => `"${p}"`).join(', ');

program
    .version(require('../package.json').version)
    .option('-o, --output <path>', 'Download folder path')
    .option(
        '-p, --platform [platform]',
        `OS, one of ${availablePlatformsStr}. By default the current platform is detected`,
        getCurrentPlatform()
    )
    .option('-r, --revision <number>', 'Chromium revision number')
    .parse(process.argv);

if (!program.output) {
    console.error('You must specify a download folder with -o <path>');
    program.help();
}

if (!program.revision) {
    console.error('You must specify a Chromium revision to download with -r <number>');
    program.help();
}

if (!availablePlatforms.includes(program.platform)) {
    console.error(`${program.platform} is not a supported platform.`);
    console.error('You must specify one of the supported platforms:', availablePlatformsStr);
    program.help();
}

const folderPath = path.resolve(program.output);
const revision = program.revision;
const platform = program.platform;

const isDownloaded = fs.existsSync(folderPath);

if (isDownloaded) {
    console.log(
        'The expecified output folder already exists. Maybe you have already downloaded Chromium in that folder'
    );
    process.exit(0);
}

console.log(`Downloading Chromium r${revision} for ${platform} to ${folderPath}`);
download({folderPath, revision, platform, onProgress: getProgressHandler()})
    .then(({revision, executablePath}) => {
        console.log(`Chromium r${revision} downloaded to ${executablePath}`);
    })
    .catch(error => {
        console.error(`ERROR: Failed to download Chromium r${revision}!`);
        console.error(error);
        process.exit(1);
    });
