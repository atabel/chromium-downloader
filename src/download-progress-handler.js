const ProgressBar = require('progress');

const toMegabytes = bytes => {
    const mb = bytes / 1024 / 1024;
    return `${Math.round(mb * 10) / 10} MiB`;
};

const getProgressHandler = () => {
    let progressBar = null;
    const onProgress = (bytesTotal, delta) => {
        if (!progressBar) {
            progressBar = new ProgressBar(`${toMegabytes(bytesTotal)} [:bar] :percent :etas `, {
                complete: '=',
                incomplete: ' ',
                width: 20,
                total: bytesTotal,
            });
        }
        progressBar.tick(delta);
    };

    return onProgress;
};

module.exports = getProgressHandler;
