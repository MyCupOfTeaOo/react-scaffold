const PuppeteerEnvironment = require('jest-environment-puppeteer');
const { BASE_URL } = require('./config');

function menuDataFlatMap(menuData, menuId2Url, root = '') {
  menuData.forEach(item => {
    const path = root + item.menuUrl;
    // eslint-disable-next-line
    menuId2Url[item.menuId] = path;
    if (Array.isArray(item.menus)) {
      menuDataFlatMap(item.menus, menuId2Url, path);
    }
  });
}

class CustomEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();
    await this.global.page.goto(BASE_URL);
    await this.global.page.focus('input[area-form-id=username]');
    await this.global.page.keyboard.type('admin');
    await this.global.page.focus('input[area-form-id=password]');
    await this.global.page.keyboard.type('123456');
    await this.global.page.focus('input[area-form-id=captcha]');
    await this.global.page.keyboard.type('1111');
    await this.global.page.click('button[type=submit]');
    const response = await this.global.page.waitForResponse(
      `${BASE_URL}/api/permission/api/SysRole2menu/getMenus`,
    );
    const data = await response.json();
    this.global.menuId2Url = {};
    menuDataFlatMap(data.data, this.global.menuId2Url);
  }

  async teardown() {
    await super.teardown();
  }
}

module.exports = CustomEnvironment;
