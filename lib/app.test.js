const exp = require("constants");
const { getMetaData } = require("./app");

describe("Web Scraping App", () => {
  test("should extract meta data correctly", async () => {
    const targetUrl =
      "https://www.freecodecamp.org/news/";
    const metaData = await getMetaData(targetUrl);

    expect(metaData).toHaveProperty("image");
    expect(metaData).toHaveProperty("description");
    expect(metaData).toHaveProperty("title");

      }, 10000);
});