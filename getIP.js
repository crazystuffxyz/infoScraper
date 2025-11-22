function extractClientIP(headers) {
  const result = {
    ip: null,
    allMatches: []
  };

  // IPv4 regex (strict enough to avoid false positives)
  const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // Common headers used by proxies/CDN/load balancers
  const priorityHeaders = [
    "x-forwarded-for",
    "cf-connecting-ip",
    "true-client-ip",
    "x-real-ip",
    "fastly-client-ip",
    "x-cluster-client-ip",
    "forwarded"
  ];

  // 1. Check priority headers first
  for (const key of priorityHeaders) {
    const val = headers[key];
    if (!val) continue;

    const matches = val.match(ipv4Regex);
    if (matches && matches.length) {
      result.ip = matches[0];
      result.allMatches.push(...matches);
      return result; // priority — stop early
    }
  }

  // 2. Scan every header value
  for (const key in headers) {
    const val = headers[key];
    if (typeof val !== "string") continue;

    const matches = val.match(ipv4Regex);
    if (matches) {
      if (!result.ip) result.ip = matches[0];
      result.allMatches.push(...matches);
    }
  }

  return result;
}

export default extractClientIP;