import axios from "axios";

async function geoLocate(ip = "8.8.8.8") {
  try {
    const url = `https://geo-dev.opentracker.net/GeoIpEngine/${encodeURIComponent(ip)}`;
    var responseText = await axios.get(url, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        dnt: "1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      },
      timeout: 9900,
    });
    var response = {data : {}};
    responseText.data.trim().split("\n").filter(line => line.includes(":")).forEach(line => {
      response.data[line.split(":")[0].trim()] = line.slice(line.indexOf(":") + 1).trim();
    });
    return response.data;
  } catch (error) {
    return {"error": error.message};
  }
}

export default geoLocate;