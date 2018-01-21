const fs = require('fs');
const URL = require('url');

const httpRequest = (url, method, response) => {
    const options = URL.parse(url);
    options.method = method;

    const driver = options.protocol === 'https:' ? 'https' : 'http';
    const request = require(driver).request(options, response);
    request.end();
    return request;
};

const downloadFile = (url, destinationPath, progressCallback) =>
    new Promise((resolve, reject) => {
        const request = httpRequest(url, 'GET', response => {
            if (response.statusCode !== 200) {
                // consume response data to free up memory
                response.resume();
                reject(
                    new Error(
                        `Download failed: server returned code ${response.statusCode}. URL: ${url}`
                    )
                );
                return;
            }
            const file = fs.createWriteStream(destinationPath);
            file.on('finish', () => resolve());
            file.on('error', reject);

            response.pipe(file);

            const totalBytes = Number(response.headers['content-length']);
            if (progressCallback) {
                response.on('data', chunk => progressCallback(totalBytes, chunk.length));
            }
        });
        request.on('error', reject);
    });

module.exports = downloadFile;
