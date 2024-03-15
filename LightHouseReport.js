const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs');
const desktopConfig = require('lighthouse/lighthouse-core/config/desktop-config.js');
const PORT = 8041;
const options = {
  port: PORT,
  disableStorageReset: true,
  output: 'html',
};
const optionsJson = {
  port: PORT,
  disableStorageReset: true,
  output: 'json',
};
const generatePerformanceReport = async (url, pageType) => {
  const browser2 = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true, //can be set to false
    slowMo: 50,
    // headless: false
  });

  const loginPageJsonReport = await lighthouse(url, optionsJson, desktopConfig);
  const loginPageReportJson = loginPageJsonReport.report;
  fs.writeFileSync(
    `./reports/${pageType}.json`,
    loginPageReportJson,
  );
  const jsonReport = JSON.parse(loginPageReportJson)
  console.log("largest-contentful-paint :" + jsonReport.audits["largest-contentful-paint"].displayValue)
  console.log("first-contentful-paint :" + jsonReport.audits["first-contentful-paint"].displayValue)
  console.log("cumulative-layout-shift :" + jsonReport.audits["cumulative-layout-shift"].displayValue)
  console.log("speed-index :" + jsonReport.audits["speed-index"].displayValue)
  console.log("performance score :" + jsonReport.categories["performance"].score*100)
  // console.log(jsonReport.audits["largest-contentful-paint"].displayValue + "-" + jsonReport.audits["first-contentful-paint"].displayValue + "-" + jsonReport.audits["cumulative-layout-shift"].displayValue + "-" + jsonReport.audits["speed-index"].displayValue + "-" + (jsonReport.categories["performance"].score * 100))
  await browser2.close();




  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true, //can be set to false
    slowMo: 50,
    // headless: false
  });
  // const url = "https://www.gujarattak.in/"
  const loginPageReport = await lighthouse(url, options, desktopConfig);
  // const { lhr } = await lighthouse(url, options, desktopConfig);
  const loginPageReportHtml = loginPageReport.report;

  fs.writeFileSync(
    `./reports/${pageType}.html`,
    loginPageReportHtml,
  );
  console.log(`Generating Performance report...`)
  console.log(`Performance report generated successfully for ${pageType}!!\n\n`);
  await browser.close();

};
const generatePerformanceReportMobile = async (url, pageType) => {
  const browser2 = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true, //can be set to false
    slowMo: 50,
    // headless: false
  });

  const loginPageJsonReport = await lighthouse(url, optionsJson);
  const loginPageReportJson = loginPageJsonReport.report;
  fs.writeFileSync(
    `./reports/${pageType}.json`,
    loginPageReportJson,
  );
  const jsonReport = JSON.parse(loginPageReportJson)
  console.log(jsonReport.audits["largest-contentful-paint"].displayValue + "-" + jsonReport.audits["first-contentful-paint"].displayValue + "-" + jsonReport.audits["cumulative-layout-shift"].displayValue + "-" + jsonReport.audits["speed-index"].displayValue + "-" + (jsonReport.categories["performance"].score * 100))
  await browser2.close();
  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true, //can be set to false
    slowMo: 50,
  });
  const loginPageReport = await lighthouse(url, options);
  const loginPageReportHtml = loginPageReport.report;

  fs.writeFileSync(
    `./reports/${pageType}.html`,
    loginPageReportHtml,
  );
  console.log(`Generating Performance report...`)
  console.log(`Performance report generated successfully for ${pageType}!!\n\n`);
  await browser.close();

};
(async () => {
  if (require.main === module) {
    try {
      const csvFilePath = 'lightHouseInput.csv';
      console.log("Please Put The URLS in lightHouseInput.csv In Below Sequence");
      console.log("Homepage->ArtcileDetails->ArtcleDetailsAmp->VideoDetails->VideoDetailsAmp")
      const fileContent = await fs.readFileSync(csvFilePath, 'utf-8');
      const urls = fileContent.split('\n').map(line => line.trim());
      const pageTypes = ["HomePage", "ArticleDetails", "ArticleDetailsAmp", "VideoDetails", "VideoDetailsAmp"];
      const pageTypesMobile = ["HomePage_Mobile", "ArticleDetails_Mobile", "ArticleDetailsAmp_Mobile", "VideoDetails_Mobile", "VideoDetailsAmp_Mobile"];
      let i = 0;
      for (const url of urls) {
        await generatePerformanceReportMobile(url, pageTypesMobile[i]);
        await generatePerformanceReport(url, pageTypes[i]);
        i++
      }

    } catch (e) {
      console.log(e);
    }
  } else {
    module.exports = generatePerformanceReport;
  }
})();
