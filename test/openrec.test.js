import OpenrecAPI from "../src/openrec-api.js";

const openrec = new OpenrecAPI();
const movieInfo = await openrec.getMovieInfo("oekaki");
console.log(movieInfo['0']);
/*describe("all openrec api request return expected status code", () => {
  it("MovieInfo equal to expected status code", async () => {
    const movieInfo = await openrec.getMovieInfo("oekaki");
    expect(movieInfo.code).toEqual(0);
  });
});*/
