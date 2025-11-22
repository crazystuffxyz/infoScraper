import checkPorts from "./checkPorts.js";
import geoLocate from "./geoLocate.js";
import scrapeRecords from "./scrapeRecords.js";
import vpnProbability from "./vpnProbability.js";
import whois from "./whois.js";

async function gatherInfo(ip) {
  const baseTasks = [
    geoLocate(ip),
    vpnProbability(ip),
    checkPorts(ip, [80, 443, 53, 22, 8080]),
    whois(ip)
  ];

  // try reverse lookup
  let domain = null;
  try {
    const dns = await scrapeRecords(ip); 
    if (dns && dns.ptr && dns.ptr.length > 0) {
      domain = dns.ptr[0];
    }
  } catch {
    // ignore
  }

  let domainTasks = [];
  if (domain) {
    domainTasks = [
      scrapeRecords(domain),
      whois(domain)
    ];
  }

  const [
    geo,
    vpnProb,
    portScan,
    whoisIP,
    ...domainResults
  ] = await Promise.all([...baseTasks, ...domainTasks]);

  let domainScrape = null;
  let domainWhois = null;

  if (domainResults.length === 2) {
    domainScrape = domainResults[0];
    domainWhois = domainResults[1];
  }

  return {
    ip,
    domain: domain || null,
    geo,
    vpnProbability: vpnProb < 0 ? 0 : vpnProb,
    portScan,
    whoisIP,
    domainInfo: domain
      ? {
          domain,
          scrape: domainScrape,
          whois: domainWhois
        }
      : null
  };
}

export default gatherInfo;
