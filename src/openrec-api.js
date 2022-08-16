import https from "https";
import endpoints from "./constants/endpoints.js";

class OpenrecAPI {
  constructor() {}

  /**
   * getRequest()
   * Send GET request.
   *
   * @param {string} url
   * @returns {Promise<object>}
   */
  async getRequest(url) {
    const promise = new Promise((resolve, reject) => {
      const req = https.get(url, (res) => {
        let chunks = [];
        res.on("data", (data) => {
          chunks.push(data);
        });

        res.on("end", () => {
          // eslint-disable-next-line no-undef
          const data = Buffer.concat(chunks);
          resolve(data);
        });
      });

      req.on("error", (error) => {
        reject(error.toString());
      });

      req.end();
    })
      .then((data) => {
        return JSON.parse(data.toString());
      })
      .catch((error) => {
        throw Error(error);
      });

    return promise;
  }

  async getMovieInfo(userId) {
    const url = endpoints.getMovieList(userId);
    const movieInfo = await this.getRequest(url);
    return movieInfo ? movieInfo : {};
  }

  async getLiveInfo(userId) {
    const movieInfo = await this.getMovieInfo(userId)
    const liveInfo = movieInfo['0']
    return liveInfo ? liveInfo : {};
  }

  async isLive(userId) {
    const liveInfo = this.getLiveInfo(userId)
    return Boolean(liveInfo["is_live"]);
  }
}

export default OpenrecAPI;
