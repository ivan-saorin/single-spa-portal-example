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
    let pageLoaded = await helpers.waitPageLoad(driver);
    expect(pageLoaded).toBeTruthy();
    let actual = await driver.getTitle();
    const expected = 'Portal';
    expect(actual).toEqual(expected);
  });

  test('Redirection from "/" to "/home" worked correctly', async () => {
      const actual = await driver.getCurrentUrl();
      const expected = `http://localhost:8080/#/home`;
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
  });
  
  describe('Navigation to Unprotected Portal Pages', () => {
    test.each`
      to             | expected1      | expected2      | expected3
      ${'contact'}   | ${'login'}     | ${'protected'} | ${'home'}
      ${'home'}      | ${'login'}     | ${'protected'} | ${'contact'}
      // add new test cases here
    `('navigate to $to',
      async ({ to, expected1, expected2, expected3 } ) => {
        await verify(driver, true, to, null, expected1, expected2, expected3);
    })
  })

  describe('Navigation to Protected Portal Pages without JWT Token', () => {
    test.each`
      to             | route          | expected1      | expected2      | expected3
      ${'protected'} | ${'login'}     | ${'protected'} | ${'contact'}   | ${'home'}
      // add new test cases here
    `('navigate to $to',
      async ({ to, route, expected1, expected2, expected3 } ) => {
        await verify(driver, true, to, route, expected1, expected2, expected3);
    })
  })

  describe('Navigation to Protected Portal Pages with JWT Token', () => {
    test('Do login', async () => {
      await verify(driver, true, 'protected', 'login', 'protected', 'contact', 'home');
      await doLogin(driver, 'admin', 'demo');
      await verify(driver, false, 'protected', 'protected', 'login', 'contact', 'home');
    })

    test.each`
      to             | route          | expected1      | expected2      | expected3
      ${'home'}      | ${null}        | ${'login'}     | ${'protected'} | ${'contact'}
      ${'protected'} | ${'protected'} | ${'login'}     | ${'contact'}   | ${'home'}
      // add new test cases here
    `('navigate to $to',
      async ({ to, route, expected1, expected2, expected3 } ) => {
        await verify(driver, true, to, route, expected1, expected2, expected3);
    })
  })

/*
describe('currencyFormatter', () => {
  test.each`
    input     | expectedResult
    ${'abc'}  | ${undefined}
    ${1.59}   | ${'£1.59'}
    ${1.599}  | ${'£1.60'}
    ${1599}   | ${'£1,599.00'}
    // add new test cases here
  `('converts $input to $expectedResult', ({ input, expectedResult }) => {
    expect(currencyFormatter(input)).toBe(expectedResult)
  })
})

import currencyFormatter from 'utils/currencyFormatter'

describe('currencyFormatter', () => {
  test.each`
    input    | configObject | expectedResult | configDescription
    ${'abc'} | ${undefined} | ${undefined}   | ${'none'}
    ${5.1}   | ${undefined} | ${'£5.10'}     | ${'none'}
    ${5.189} | ${undefined} | ${'£5.19'}     | ${'none'}
    ${5}     | ${{dec: 0}}  | ${'£5'}        | ${'dec: 0'}
    ${5.01}  | ${{dec: 0}}  | ${'£5'}        | ${'dec: 0'}
    // add new test cases here
  `('converts $input to $expectedResult with config: $configDescription',
    ({ input, configObject, expectedResult} ) => {
      expect(currencyFormatter(input, configObject)).toBe(expectedResult)
    }
  )
})
*/



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

async function doLogin(driver: WebDriver, username: string, password: string) {
  const userInput = await helpers.querySelector('#user', driver)
  const passwordInput = await helpers.querySelector('#password', driver)
  const anchor = await helpers.querySelector('#submit', driver)
  await userInput.sendKeys(username)
  await passwordInput.sendKeys(password)
  await anchor.click();
}

async function verify(driver: WebDriver, navigate: boolean, to: string, route: string, expected1: string, expected2: string, expected3: string) {
  let routing = to;
  if (route) {
    routing = route;
  }
  const current = `${rootURL}/#/${to}`;
  const expected = `${rootURL}/#/${routing}`;
  await driver.get(current);
  let pageLoaded = await helpers.waitPageLoad(driver);
  expect(pageLoaded).toBeTruthy();
  const actual = await driver.getCurrentUrl();
  expect(actual).toEqual(expected);
  let element = await helpers.querySelector(`${routing}[class^="portal-page show"]`, driver);
  element = await helpers.waitElementVisible(element, driver);
  expect(element).toBeTruthy();
  const elements = await helpers.querySelectorsAll('*[class^="hide"]', driver);
  expect(elements).toBeTruthy();
  expect(elements.length).toBeGreaterThanOrEqual(3);
  let names = await helpers.getTagNameAndClasses(elements);
  expect(names).toContainEqual('loading.hide');
  expect(names).toContainEqual('error.hide');
  expect(names).toContainEqual('content.hide');
  const elements2 = await helpers.querySelectorsAll('*[class^="portal-page hide"]', driver);
  expect(elements2).toBeTruthy();
  expect(elements2.length).toBeGreaterThanOrEqual(3);
  let names2 = await helpers.getTagNameAndClasses(elements2);
  expect(names2).toContainEqual(`${expected1}.portal-page.hide`);
  expect(names2).toContainEqual(`${expected2}.portal-page.hide`);
  expect(names2).toContainEqual(`${expected3}.portal-page.hide`);
}
