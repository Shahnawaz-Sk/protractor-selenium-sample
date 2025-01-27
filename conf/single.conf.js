
username= process.env.bamboo_LT_USERNAME,
accessKey=  process.env.bamboo_LT_ACCESS_KEY,
buildName = process.env.bamboo_LT_BUILD_NAME,
tunnelName =  process.env.bamboo_LT_TUNNEL_NAME
exports.config = {
  'specs': ['../specs/single.js'],

  seleniumAddress: 'https://'+ username +':'+ accessKey  +'@hub.lambdatest.com/wd/hub',

  'capabilities': {
    'build': buildName,
    'browserName': 'chrome',
    'version':'latest',
    'platform': 'Windows 10',
    'tunnel': true,
    'tunnelName':tunnelName
  },
  onPrepare: () => {

    myReporter = {
        specStarted: function(result) {
          specStr= result.id
          spec_id = parseInt(specStr[specStr.length -1])
          browser.getProcessedConfig().then(function (config) {
            var fullName = config.specs[spec_id];
            browser.executeScript("lambda-name="+fullName.split(/(\\|\/)/g).pop())
          });
        }
      };
      jasmine.getEnv().addReporter(myReporter);
  },
  onComplete: (passed) => {
    if(passed)
      browser.executeScript("lambda-status=passed");
    else 
      browser.executeScript("lambda-status=failed");
    browser.quit();
  }

};
