import puppeteer from 'puppeteer';
import http from 'http';
import url from 'url';

const targetUrl = 'https://www.freecodecamp.org/news/';

export async function getMetaData(url: string): Promise<{ image?: string; description?: string; title?: string }> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url);

  const metaData = await page.evaluate(() => {
    const metaTags = document.querySelectorAll<HTMLMetaElement>('meta[property^="og:"]');
    const data: { image?: string; description?: string; title?: string } = {};

    metaTags.forEach(tag => {
      const property = tag.getAttribute('property');
      const content = tag.getAttribute('content');

      if (property && content) {
        if (property === 'og:image') {
          data.image = content;
        } else if (property === 'og:description') {
          data.description = content;
        } else if (property === 'og:title') {
          data.title = content;
        }
      }
    });

    return data;
  });

  await browser.close();
  return metaData;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || '', true);

  if (parsedUrl.pathname === '/metadata') {
    // Handle metadata request
    getMetaData(targetUrl)
      .then(metaData => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(metaData));
      })
      .catch(error => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error: ${error.message}`);
      });
  } else {
    // Handle other requests
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3001;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/metadata`);
});
