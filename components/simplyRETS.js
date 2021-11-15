const axios = require("axios").default;

class SimplyRETS {
  constructor(username, password, baseUrl, defaultTimeoutMs) {
    this.auth = { 
        username: username, 
        password: password 
    };
    this.baseUrl = baseUrl;
    this.timeout = defaultTimeoutMs;
  }
  
  /**
   * @param {*} city 
   * @returns property listings
   */
  async properties(city) {
    var config = {
      url:
        city && typeof city === "string"
          ? `${this.baseUrl}properties` +
            `?cities=${encodeURIComponent(city.trim())}&count=true`
          : `${this.baseUrl}properties`,
      auth: this.auth,
      timeout: this.timeout
    };

    const result = await axios(config);
    if (result.status === 200) {
      return result.data;
    } else {
      throw new Error(`SimplyRETS failed with status ${result.status}`);
    }
  }
}

module.exports = SimplyRETS;
