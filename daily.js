const deepai = require('deepai');
deepai.setApiKey(process.env.DEEPAI);
const https = require('https');
const fs = require('fs');
const key = process.env.FLICKR;
const limit = 4001;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

getImage();

async function getImage(times = 5) {
    url = await getURL("waterfall");
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
    let nature = await getURL("waterfall");
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

function API(subject, count = 1, dateupload = 0) {
	return new Promise((resolve, reject) => {
        https.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+key+"&format=json&per_page=1&extras=owner_name,url_o,date_upload&max_upload_date="+dateupload+"&page="+count+"&text="+subject+"&license=9&nojsoncallback=1", (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
				try {
					var photos = JSON.parse(data);
				} catch {
					reject();
				}
                resolve(photos);
            });
        }).on("error", (err) => {
            reject();
        });
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getURL(subject) {
  var count = 1;
	try {
        var result = await API(subject, count);
		if(result.stat !== "ok") return null
		var pages = result.photos.pages;
		if(pages < 1) return null
	} catch {
        return null
	}
    count = Math.floor(getRandomInt(1, pages));
	  var result = await getPhoto(subject, count);
    return result.photos.photo[0].url_o;
}

async function getPhoto(subject, count = 1) {
	var requests = Math.floor(count/limit);
	// Flickr API limit workaround.
    var index = (requests > 0) ? (count - limit * requests) + 1 : count;
	var dateupload = 0;
	for (requests < 0; requests--;) {
		let result = await API(subject, limit, dateupload);
		if(result.stat !== "ok") continue
		try {
			dateupload = result.photos.photo[0].dateupload;
		} catch {
			continue
		}
	}
	return await API(subject, index, dateupload);
}
