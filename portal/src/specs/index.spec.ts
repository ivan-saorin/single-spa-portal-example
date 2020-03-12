import {Builder, WebDriver, By} from 'selenium-webdriver';
import * as helpers from './helpers';

const rootURL = 'http://localhost:8080';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

//console.log('variables',  process.argv);
let driverName: string;
if (process.argv.length > 2) {
  let kvp = process.argv[3].split('=');
  if (kvp.length > 1) {
    driverName = process.argv[3].split('=')[1];
  }
}

describe(`Executing tests with [${driverName}] Selenium driver.`, () => {
  let driver: WebDriver;

  beforeAll(async () => {
    if (!driverName) {
      driverName = 'chrome';
    }
    driver = driver = new Builder().forBrowser(driverName).build();
    driver.get(rootURL);
  });

  test('Title should be Portal', async () => {
    const actual = await driver.getTitle();
    const expected = 'Portal';
    expect(actual).toEqual(expected);
  });

  test('Redirection from "/" to "/home" worked correctly', async () => {
      const actual = await driver.getCurrentUrl();
      const expected = 'http://localhost:8080/#/home';
      expect(actual).toEqual(expected);
      let element = await helpers.querySelector('home[class^="portal-page show"]', driver)
      element = await helpers.waitElementVisible(element, driver)
      expect(element).toBeTruthy();
      const elements = await helpers.querySelectorsAll('*[class^="hide"]', driver)
      expect(elements).toBeTruthy();
      expect(elements.length).toBeGreaterThanOrEqual(3);
      let names = await helpers.getTagNameAndClasses(elements);
      expect(names).toContainEqual('loading.hide')
      expect(names).toContainEqual('error.hide')
      expect(names).toContainEqual('content.hide')
      const elements2 = await helpers.querySelectorsAll('*[class^="portal-page hide"]', driver)
      expect(elements2).toBeTruthy();
      expect(elements2.length).toBeGreaterThanOrEqual(3);
      let names2 = await helpers.getTagNameAndClasses(elements2);
      expect(names2).toContainEqual('login.portal-page.hide')
      expect(names2).toContainEqual('contact.portal-page.hide')
      expect(names2).toContainEqual('protected.portal-page.hide')
      
    //document.querySelectorAll('*[class^="hide"]');
    /*
    0: loading.hide
    1: error.hide
    2: content.hide
    */
    //document.querySelectorAll('*[class^="portal-page hide"]');
    /*
    0: login.portal-page.hide
    1: contact.portal-page.hide
    2: protected.portal-page.hide
    */
  });


  test.skip('should click on navbar button to display a drawer1', async () => {
    const anchor = await helpers.querySelector('[href=\'/en-US/firefox/\']', driver)
    const actual = await anchor.getText()
    const expected = 'Firefox'
    expect(actual).toEqual(expected)
  });

  afterAll(async () => {
    await driver.quit();
  });

});