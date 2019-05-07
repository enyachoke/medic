const commonElements = require('../../page-objects/common/common.po.js'),
      contactPage = require('../../page-objects/contacts/contacts.po.js'),
      helper = require('../../helper'),
      utils = require('../../utils');

describe('Add new person tests : ', () => {
  afterEach(done => {
    utils.resetBrowser();
    done();
  });

  afterAll(utils.afterEach);

  it('should add new person', () => {
    commonElements.goToPeople();
    expect(commonElements.isAt('contacts-list'));
    contactPage.addNewDistrict('BedeDistrict'); // TODO restore this to its former glory, creating a person as part of the district creation!
    contactPage.completeNewPersonForm('Bede');
    const firstInLHS = element(by.css('#contacts-list .content-row:first-child'));
    helper.waitUntilReady(firstInLHS);
    firstInLHS.click();
    const district = element(by.css('.card h2'));
    helper.waitUntilReady(district);
    expect(district.getText()).toBe('BedeDistrict');
    const name = element(by.css('.children h4 span'));
    helper.waitUntilReady(name);
    expect(name.getText()).toBe('Bede');
  });
});
