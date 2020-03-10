import { By, until, WebDriver } from 'selenium-webdriver';

const waitUntilTime = 20000

export async function querySelector(selector: string, driver: WebDriver) {
  const el = await driver.wait(
    until.elementLocated(By.css(selector)),
    waitUntilTime
  )
  return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}
