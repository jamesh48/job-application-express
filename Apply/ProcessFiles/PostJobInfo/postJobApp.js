const axios = require('axios');

module.exports = {
  postJobApp: async (jobInfoObj) => {
    try {
      const { data: result } = await axios.post('http://localhost:8500/dump', null, { params: jobInfoObj });
      console.log(result);
    } catch (err) {
      console.log(err);
    };
    return;
  }
}