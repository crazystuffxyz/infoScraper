import express from "express";
import gatherInfo from "./gatherInfo.js";
import getIP from "./getIP.js";

const app = express();
const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const isIPv4 = ip => ipv4Regex.test(ip);

app.use(async (req, res, next) => {
    if(isIPv4(req.url.slice(1))){
        res.json(await gatherInfo(req.url.slice(1)));
    } else if(isIPv4(getIP(req.headers))){
        res.json({"headers": req.headers, ...await gatherInfo(getIP(req.headers))});
    } else {
        res.json({"headers": req.headers, "error": "no IP to get info on"})
    }
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});