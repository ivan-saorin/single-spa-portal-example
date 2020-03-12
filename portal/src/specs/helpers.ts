import { By, until, WebDriver, WebElement } from 'selenium-webdriver';

const waitUntilTime = 20000

export async function waitPageLoad(driver: WebDriver): Promise<boolean> {
  return await driver.wait(function() {
    return driver.executeScript('return document.readyState').then(function(readyState) {
      return readyState === 'complete';
    });
  });
}

export async function querySelector(selector: string, driver: WebDriver) {
  const el = await driver.wait(
    until.elementLocated(By.css(selector)),
    waitUntilTime
  )
  return el;
}

export async function waitElementVisible(element: WebElement, driver: WebDriver) {
  return await driver.wait(until.elementIsVisible(element), waitUntilTime)
}

export async function querySelectorsAll(selector: string, driver: WebDriver): Promise<WebElement[]> {
  const els = await driver.wait(
    until.elementsLocated(By.css(selector)),
    waitUntilTime
  )
  return els;
}

export async function waitElementsVisible(elements: WebElement[], driver: WebDriver): Promise<WebElement[]> {
  let res: Promise<WebElement>[] = [];
  elements.forEach((el) => {
    res.push(driver.wait(until.elementIsVisible(el), waitUntilTime));
  });    
  return await Promise.all(res);
}

export async function getTagNameAndClasses(elements: WebElement[]): Promise<string[]> {
  let names = elements.map(async (element) => {
    let a: Promise<string>[] = [];
    a.push(element.getTagName())
    a.push(element.getAttribute('class'))
    let s: string[] = await Promise.all(a);
    //console.log('s[0]: ', s[0], 's[1]', s[1])
    return s[0] + '.' + s[1].replace(' ', '.')
  });
  return await Promise.all(names);
} 