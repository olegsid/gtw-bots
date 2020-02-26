var express = require('express');
var path = require('path');
var app = express();
const puppeteer = require('puppeteer');


const browserPages = [];

app.set('views', path.join(__dirname, '../views'));
let browser;
(async () => {
    browser  = await puppeteer.launch({
        headless: true
    });
    console.log('started');


})();

const waitTillWebinarStart = async (page, url) => {
    let noStarted = true;
    do {
        await page.goto(url, {waitUntil: 'domcontentloaded'});
        noStarted = await page.evaluate(() => {
            return /notStarted/.test(window.location.href)
        });

        console.log({noStarted});
    } while (noStarted);
    let isStartButtonVisible;
    do {
        await page.goto(url, {waitUntil: 'domcontentloaded'});
        await page.waitFor(1000);
        const btn = await page.$('.btn.btn-primary.btn-block.btn-lg');
        isStartButtonVisible = await btn.evaluate(btn => btn.style.display);
        await btn.evaluate(btn => btn.click());
        console.log({isStartButtonVisible});
    } while (isStartButtonVisible);
};


app.get('/', function (req, res) {
    res.render('index.ejs', {title: 'vue-express starter'});
});

app.post('/start', async function (req, res) {
    const data = req.body;
    if (browserPages.find(page => page.id == data.id)) res.send('already started');

    const newPage ={
      id:data.id,
      page:await browser.newPage()
    };
    browserPages.push(newPage);
    console.log(data.joinUrl);
    await waitTillWebinarStart(newPage.page, data.joinUrl);

    res.send('started');
});


app.post('/stop', async function (req, res) {
    const data = req.body;
    const browserPage = browserPages.find(page => page.id == data.id);

    if (!browserPage) res.send('already stopped');

    const index = browserPages.indexOf(browserPage);
    browserPages.splice(index,1);
    await browserPage.page.close();

    res.send('closed');
});

module.exports = app;