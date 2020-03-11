import {Builder, WebDriver} from 'selenium-webdriver';
import * as helpers from './helpers';

const rootURL = 'https://www.mozilla.org/en-US/'
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5

//console.log('variables',  process.argv);
let driverName: string;
if (process.argv.length > 2) {
  let kvp = process.argv[3].split('=');
  if (kvp.length > 1) {
    driverName = process.argv[3].split('=')[1];
  }
}

describe(`Executing tests with ${driverName} driver.`, () => {
  let driver: WebDriver;

  beforeAll(async () => {
    if (!driverName) {
      driverName = 'chrome';
    }
    driver = driver = new Builder().forBrowser(driverName).build();
    driver.get(rootURL);
  });

  test('should click on navbar button to display a drawer1', async () => {
    const anchor = await helpers.querySelector('[href=\'/en-US/firefox/\']', driver)
    const actual = await anchor.getText()
    const expected = 'Firefox'
    expect(actual).toEqual(expected)
  });

  test('should click on navbar button to display a drawer2', async () => {
    const anchor = await helpers.querySelector('[href=\'/en-US/firefox/\']', driver)
    const actual = await anchor.getText()
    const expected = 'Firefox'
    expect(actual).toEqual(expected)
  });

  afterAll(async () => {
    await driver.quit();
  });

});