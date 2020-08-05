const deepai = require('deepai');
deepai.setApiKey(process.env.DEEPAI);
const base = "https://source.unsplash.com/1920x1080/?nature,water";
const https = require('https');
const fs = require('fs');

getImage();

async function getImage(times = 10) {
    url = base;
    for (var i = 1; i <= times; i++) {
        url = await style(url);
    }
    url = await deepai.callStandardApi("deepdream ", {image: url}).output_url;
    let file = fs.createWriteStream("bg.png");
    let request = https.get(url, function(response) {
        response.pipe(file);
    });
}

async function style(url) {
    var result = await deepai.callStandardApi("fast-style-transfer", {
        content: url,
        style: base + "&r=" + Math.random()
    });
    return result.output_url;
}
