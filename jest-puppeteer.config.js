// ps https://github.com/GoogleChrome/puppeteer/issues/3120
module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-zygote',
      '--no-sandbox',
    ],
  },
};
