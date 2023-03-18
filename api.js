const axios = require('axios');
const { AIKEY} = process.env;

const headers = {
  'Authorization': 'Bearer '+AIKEY,
  "Content-Type": "application/json"
};

exports.postData = (urlencoded, data) => {
    axios.post('https://example.com/api/endpoint', {
        firstName: 'John',
        lastName: 'Doe'
      }, { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
}

