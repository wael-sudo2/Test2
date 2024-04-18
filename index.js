const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const crypto = require('crypto');
const fs = require('fs');

async function run() {
  // Add Stealth Plugin with defaults
  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({args: ['--start-maximized' ], headless: true});
  const page = await browser.newPage();

  await page.goto('https://www.pascalcoste-shopping.com/esthetique/fond-de-teint.html', { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('.uk-cover');
  const element = await page.$('.uk-cover')
 
  const elements = await page.$(".uk-active");
  const href = await elements.$eval('a', el => el.getAttribute('href'))
  const src = await elements.$eval('img', el => el.getAttribute('src'))
  console.log("redirection_url:",href);
  console.log('id:',src);

  // Create image id
  const md5Hash = crypto.createHash('md5').update(src).digest('hex');
  console.log('MD5 hash of img_link:', md5Hash);

  // Save The Screenshot
  await element.screenshot({ path: './Screenshots/' + md5Hash + '.png' });
  
  // Create an object with extracted details
  const dataToSave = {
    id: md5Hash,
    redirection_url: href,
    img_link: src,
    image_url: './Screenshots/' + md5Hash + '.png',
    format: "Left Side Banner"
  };

  // Write the object to a JSON file
  const jsonFilePath = './Data.json';
  fs.writeFileSync(jsonFilePath, JSON.stringify(dataToSave, null, 2));

  await browser.close();
}

// Call the async function
run();
