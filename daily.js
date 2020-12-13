const deepai = require('deepai');
deepai.setApiKey(process.env.DEEPAI);
const https = require('https');
const fs = require('fs');
const limit = 4001;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

getImage();

async function getImage(times = 2) {
    url = "https://imgapi.ndev.workers.dev/?subject=art";
    await sleep(5000);
    for (var i = 1; i <= times; i++) {
        url = await style(url);
        await sleep(5000);
    }
    url = await deepdream(url);
    if (fs.existsSync("bg.png")) {
        fs.renameSync("bg.png", "art_"+Date.now()+".png");
    }
    let file = fs.createWriteStream("bg.png");
    let request = https.get(url, function(response) {
        response.pipe(file);
    });
}

async function style(url) {
    let nature = "https://imgapi.ndev.workers.dev/?subject=city";
    var result = await deepai.callStandardApi("neural-style", {
        content: url,
        style: nature
    });
    return result.output_url;
}

async function deepdream(url) {
    var result = await deepai.callStandardApi("deepdream", {
        image: url
    });
    return result.output_url;
}
