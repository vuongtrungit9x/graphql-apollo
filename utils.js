const fs = require('fs');

const loadConfigFromFile = () => {
  const argv = require('minimist')(process.argv.slice(2));
  const confUri = argv.conf || 'server.json'

  if (!confUri) {
    throw 'Missing "conf" command line parameter';
  }
  
  console.log('Reading config from ' + confUri + '...');
  let data = fs.readFileSync(confUri, 'utf8');

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      throw 'Error converting loaded data to JSON: ' + e.toString();
    }
  }

  return data
};

module.exports = {
  loadConfigFromFile
}