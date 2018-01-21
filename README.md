# Chromium downloader

CLI to download a specified Chromium revision.

```
Usage: chromium-downloader -o <path> -r <number> [options]


  Options:

    -V, --version              output the version number
    -o, --output <path>        Download folder path
    -p, --platform [platform]  OS, one of "mac", "linux", "win32", "win64". By default the current platform is detected (default: linux)
    -r, --revision <number>    Chromium revision number
    -h, --help                 output usage information
```

## Node Api

You can also use the chrome-downloader node api:

```javascript
const download = require('./src/chromium-downloader');

let totalDownloaded = 0;
const onProgress = (totalBytes, chunkBytes) => {
    totalDownloaded += chunkBytes;
    console.log(`Downloaded ${100 * totalDownloaded / totalBytes}%`);
};

const options = {
    folderPath: './downloads',
    revision: 515411,
    platform: 'linux',
    onProgress,
};

download(options)
    .then(({revision, executablePath}) => {
        console.log(`Chromium r${revision} downloaded to ${executablePath}`);
    })
    .catch(error => {
        console.error(`ERROR: Failed to download Chromium!`, error);
    });
```
