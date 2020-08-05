const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

main();

async function main() {
	await discord("bg.png");
}

async function discord(filename) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filename));
    const res = await axios.post("https://ptb.discordapp.com/api/webhooks/740662114959491165/zSCu6NC12DxtOOcuZmM3bN5S9CtAPaE6fpkdGF9Uh4HgL7iNcWk7q49NCmLvD2lkVP3m", formData, {
        headers: formData.getHeaders()
    });
}
