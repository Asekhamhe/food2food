import axios from "axios";
import * as config from "../config";
class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const res = await axios(
      `${config.proxy}${config.url}/search?q=${this.query}`
    )
      .then((data) => {
        this.result = data.data.recipes;
      })
      .catch((err) => alert(err));
  }
}

export default Search;
