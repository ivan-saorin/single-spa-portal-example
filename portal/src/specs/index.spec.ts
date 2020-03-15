import {Builder, WebDriver, By, WebElement, until} from 'selenium-webdriver';
import * as helpers from './helpers';
import edge from 'selenium-webdriver/edge'
import chrome from 'selenium-webdriver/chrome'

const rootURL = 'http://localhost:8080';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

//console.log('[HOST] variables',  process.argv);
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
    let builder = new Builder().forBrowser(driverName);
    if (driverName == 'MicrosoftEdge') {
      let service = new edge.ServiceBuilder('C:\\Users\\ivans\\git\\single-spa-portal-example\\portal\\msedgedriver.exe');
      builder.setEdgeService(service);
    }
    driver = builder.build();
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
      let element = await helpers.querySelector(driver, 'home[class^="portal-page show"]')
      element = await helpers.waitElementVisible(driver, element)
      expect(element).toBeTruthy();
      const elements = await helpers.querySelectorsAll(driver, '*[class^="hide"]')
      expect(elements).toBeTruthy();
      expect(elements.length).toBeGreaterThanOrEqual(3);
      let names = await helpers.getTagNameAndClasses(elements);
      expect(names).toContainEqual('loading.hide')
      expect(names).toContainEqual('error.hide')
      expect(names).toContainEqual('content.hide')
      const elements2 = await helpers.querySelectorsAll(driver, '*[class^="portal-page hide"]')
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
        await verifyInternalPortalPage(driver, true, to, null, expected1, expected2, expected3);
    })
  })

  describe('Navigation to Protected Portal Pages without JWT Token', () => {
    test.each`
      to             | route          | expected1      | expected2      | expected3
      ${'protected'} | ${'login'}     | ${'protected'} | ${'contact'}   | ${'home'}
      // add new test cases here
    `('navigate to $to',
      async ({ to, route, expected1, expected2, expected3 } ) => {
        await verifyInternalPortalPage(driver, true, to, route, expected1, expected2, expected3);
    })
  })

  describe('Navigation to Protected External Apps without JWT Token', () => {
    test.each`
      to                | route          | expected1      | expected2      | expected3 | contentExpected
      ${'app1Angular8'} | ${'login'}     | ${'protected'} | ${'contact'}   | ${'home'} | ${false}
      ${'app2Angular9'} | ${'login'}     | ${'protected'} | ${'contact'}   | ${'home'} | ${false}
      ${'app3Vue'}      | ${'app3Vue'}   | ${'protected'} | ${'contact'}   | ${'home'} | ${true}
      ${'app4React'}    | ${'login'}     | ${'protected'} | ${'contact'}   | ${'home'} | ${false}
      // add new test cases here
    `('navigate to $to',
      async ({ to, route, expected1, expected2, expected3, contentExpected } ) => {
        await verifyInternalPortalPage(driver, true, to, route, expected1, expected2, expected3, contentExpected);
    })
  })

  describe('Navigation to Protected Portal Pages with JWT Token', () => {
    test('Do login', async () => {
      await verifyInternalPortalPage(driver, true, 'protected', 'login', 'protected', 'contact', 'home');
      await doLogin(driver, 'admin', 'demo');
      await verifyInternalPortalPage(driver, false, 'protected', 'protected', 'login', 'contact', 'home');
    })

    describe('Navigation to Protected External Apps with JWT Token', () => {
      test.each`
        to                | route              | expected1      | expected2      | expected3 | contentExpected | postMessageSelector
        ${'app1Angular8'} | ${'app1Angular8'}  | ${'protected'} | ${'contact'}   | ${'home'} | ${true}         | ${'host-message p'}
        ${'app2Angular9'} | ${'app2Angular9'}  | ${'protected'} | ${'contact'}   | ${'home'} | ${true}         | ${'host-message p'}
        ${'app3Vue'}      | ${'app3Vue'}       | ${'protected'} | ${'contact'}   | ${'home'} | ${true}         | ${'.host-message'}
        ${'app4React'}    | ${'app4React'}     | ${'protected'} | ${'contact'}   | ${'home'} | ${true}         | ${'.host-message'}
        // add new test cases here
      `('navigate to $to',
        async ({ to, route, expected1, expected2, expected3, contentExpected, postMessageSelector } ) => {
          await verifyInternalPortalPage(driver, true, to, route, expected1, expected2, expected3, contentExpected, postMessageSelector);
      })
    })
  
    test.each`
      to             | route          | expected1      | expected2      | expected3
      ${'home'}      | ${null}        | ${'login'}     | ${'protected'} | ${'contact'}
      ${'protected'} | ${'protected'} | ${'login'}     | ${'contact'}   | ${'home'}
      // add new test cases here
    `('navigate to $to',
      async ({ to, route, expected1, expected2, expected3 } ) => {
        await verifyInternalPortalPage(driver, true, to, route, expected1, expected2, expected3);
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
    const anchor = await helpers.querySelector(driver, '[href=\'/en-US/firefox/\']')
    const actual = await anchor.getText()
    const expected = 'Firefox'
    expect(actual).toEqual(expected)
  });

  afterAll(async () => {
    await driver.quit();
  });

});

async function doLogin(driver: WebDriver, username: string, password: string) {
  const userInput = await helpers.querySelector(driver, '#user')
  const passwordInput = await helpers.querySelector(driver, '#password')
  const anchor = await helpers.querySelector(driver, '#submit')
  await userInput.sendKeys(username)
  await passwordInput.sendKeys(password)
  await anchor.click();
}

async function verifyInternalPortalPage(driver: WebDriver, navigate: boolean, to: string, route: string, expected1: string, expected2: string, expected3: string, contentExpected?: boolean, postMessageSelector?: string) {
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
  if (!contentExpected) {
    let element = await helpers.querySelector(driver, `${routing}[class^="portal-page show"]`);
    element = await helpers.waitElementVisible(driver, element);
    expect(element).toBeTruthy();
  }
  else {
    let content = await helpers.querySelector(driver, `content[class^="show"]`);
    content = await helpers.waitElementVisible(driver, content);
    expect(content).toBeTruthy();  
  }
  const elements = await helpers.querySelectorsAll(driver, '*[class^="hide"]');
  expect(elements).toBeTruthy();
  expect(elements.length).toBeGreaterThanOrEqual(contentExpected ? 2 : 3);
  let names = await helpers.getTagNameAndClasses(elements);
  expect(names).toContainEqual('loading.hide');
  expect(names).toContainEqual('error.hide');
  if (!contentExpected) {
    expect(names).toContainEqual('content.hide');
  }
  const elements2 = await helpers.querySelectorsAll(driver, '*[class^="portal-page hide"]');
  expect(elements2).toBeTruthy();
  expect(elements2.length).toBeGreaterThanOrEqual(3);
  let names2 = await helpers.getTagNameAndClasses(elements2);
  expect(names2).toContainEqual(`${expected1}.portal-page.hide`);
  expect(names2).toContainEqual(`${expected2}.portal-page.hide`);
  expect(names2).toContainEqual(`${expected3}.portal-page.hide`);
  let iframes: WebElement[] = await driver.findElements(By.tagName("iframe"));
  expect(iframes.length).toEqual(1)
  if (contentExpected && postMessageSelector) {
    await driver.sleep(500) // Very Important
    let postMessage = await helpers.querySelector(driver, `a[class^="postmsg"]`);
    await postMessage.click()  

    let iFrame = await helpers.querySelector(driver, `#mfc`);
    await driver.switchTo().frame(iFrame);

    //postMessageSelector
    let iFrameMsg = await helpers.querySelector(driver, postMessageSelector);
    await helpers.waitElementVisible(driver, iFrameMsg)
    let iFrameText = await iFrameMsg.getText();
    expect(iFrameText).toBeDefined();    
    
    // Switch back to parent frame (top)
    await driver.switchTo().parentFrame();
    await driver.switchTo().defaultContent();

    let portalMsg = await helpers.querySelector(driver, 'message');
    await helpers.waitElementVisible(driver, portalMsg)
    let portalText = await portalMsg.getText();

    if (iFrameText.startsWith('[')) {
      iFrameText = iFrameText.split(']')[1];
    }
    else {
      iFrameText = ' ' + iFrameText;
    }
    portalText = portalText.split(':')[1];
    expect(iFrameText).toEqual(portalText); 
  }
}
