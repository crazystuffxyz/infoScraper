import axios from "axios";

async function vpnProbability(ip = "8.8.8.8") {
  try {
    const url = `https://check.getipintel.net/check.php?ip=${ip}&contact=testpython230@gmail.com`;
    var response = await axios.get(url, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        dnt: "1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      },
      timeout: 9900,
    });
    return parseFloat(response.data);
  } catch (error) {
    return -10;
  }
}

export default vpnProbability;