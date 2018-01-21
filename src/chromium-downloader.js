const fs = require('fs');
const path = require('path');
const extract = require('extract-zip');
const util = require('util');
const downloadFile = require('./download-file');
const getCurrentPlatform = require('./platform');

const BASE_URL = 'https://storage.googleapis.com/chromium-browser-snapshots';
const DOWNLOAD_URL_FOR_PLATFORM = {
    linux: `${BASE_URL}/Linux_x64/%d/chrome-linux.zip`,
    mac: `${BASE_URL}/Mac/%d/chrome-mac.zip`,
    win32: `${BASE_URL}/Win/%d/chrome-win32.zip`,
    win64: `${BASE_URL}/Win_x64/%d/chrome-win32.zip`,
};

const extractZip = (zipPath, folderPath) =>
    new Promise(resolve => extract(zipPath, {dir: folderPath}, resolve));

const getDownloadUrl = (platform, revision) => {
    const url = DOWNLOAD_URL_FOR_PLATFORM[platform];
    if (!url) {
        throw new Error(`Unsupported platform: ${platform}`);
    }
    return util.format(url, revision);
};

const getExecutablePath = (platform = getCurrentPlatform()) => {
    let executablePath = '';

    if (platform === 'mac') {
        executablePath = path.join('chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium');
    } else if (platform === 'linux') {
        executablePath = path.join('chrome-linux', 'chrome');
    } else if (platform === 'win32' || platform === 'win64') {
        executablePath = path.join('chrome-win32', 'chrome.exe');
    }

    return executablePath;
};

/**
 * Downloads a Chromium revision to the expecified folderPath
 * @param  {object}    options
 * @param  {number}    options.revision
 * @param  {string}    options.[folderPath=process.cwd()]
 * @param  {string}    options.[platform=getCurrentPlatform()] one of "linux", "mac", "win32", "win64"
 * @param  {function}  options.[onProgress] (totalBytes: number, chunkBytes: number) => mixed
 * @return {Promise}
 */
const download = async ({
    revision,
    folderPath = process.cwd(),
    platform = getCurrentPlatform(),
    onProgress = () => {},
}) => {
    if (fs.existsSync(folderPath)) {
        return;
    }

    const url = getDownloadUrl(platform, revision);
    const zipPath = path.join(folderPath, `download-${platform}-${revision}.zip`);

    fs.mkdirSync(folderPath);

    try {
        await downloadFile(url, zipPath, onProgress);
        await extractZip(zipPath, folderPath);
    } finally {
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
    }

    return {
        platform,
        revision,
        executablePath: path.join(folderPath, getExecutablePath(platform)),
    };
};

module.exports = download;
