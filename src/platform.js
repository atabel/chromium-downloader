const os = require('os');

const getCurrentPlatform = () => {
    const platform = os.platform();
    if (platform === 'darwin') return 'mac';
    if (platform === 'linux') return 'linux';
    if (platform === 'win32') return os.arch() === 'x64' ? 'win64' : 'win32';
    return '';
};

module.exports = getCurrentPlatform;
