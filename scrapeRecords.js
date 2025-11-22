import dns from "dns/promises";

const RECORD_TYPES = [
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "NS",
  "TXT",
  "SOA",
  "SRV",
  "PTR",
  "CAA",
  "NAPTR"
];

/**
 * Scrape every possible DNS record for a host or IP
 * @param {string} host
 * @returns {Promise<object>}
 */
async function scrapeAllDnsRecords(host) {
  const results = {};

  for (const type of RECORD_TYPES) {
    try {
      // PTR requires reverse lookup when IP is passed
      if (type === "PTR") {
        if (isIPAddress(host)) {
          results["PTR"] = await dns.reverse(host);
        } else {
          continue; // skip PTR for non-IP input
        }
      } else {
        results[type] = await dns.resolve(host, type);
      }
    } catch {
      // No record found → ignore
    }
  }

  return results;
}

/**
 * Check if string is IPv4 or IPv6
 */
function isIPAddress(str) {
  return (
    dns.isIP?.(str) === 4 ||
    dns.isIP?.(str) === 6 ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(str)
  );
}

export default scrapeAllDnsRecords;
