import net from 'net';

// Fetch raw WHOIS data
async function whois(query, server = 'whois.verisign-grs.com') {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(43, server, () => client.write(query + '\r\n'));
    let data = '';
    client.on('data', chunk => data += chunk.toString());
    client.on('end', () => resolve(parseWhois(data)));
    client.on('error', err => reject(err));
  });
}

// Clean and parse WHOIS into JSON
function parseWhois(rawText) {
  const lines = rawText.split(/\r?\n/);
  const result = {};

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('%') || line.startsWith('#')) continue;

    const sepIndex = line.indexOf(':');
    if (sepIndex === -1) continue;

    let key = line.slice(0, sepIndex).trim().toLowerCase().replace(/ /g, '_');
    let value = line.slice(sepIndex + 1).trim();

    // Skip boilerplate ICANN text
    if (/^>>>|notice|terms of use|for more information|comment|visit|inaccuracy|terms_of_use|dnssec/i.test(key) || key=="to") continue;

    // Deduplicate entries
    if (result[key]) {
      if (!Array.isArray(result[key])) result[key] = [result[key]];
      if (!result[key].includes(value)) result[key].push(value);
    } else {
      result[key] = value;
    }
  }

  // Normalize arrays with only 1 entry back to string
  for (const key in result) {
    if (Array.isArray(result[key]) && result[key].length === 1) {
      result[key] = result[key][0];
    }
  }

  return result;
}

export default whois;
