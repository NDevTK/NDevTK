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
    await axios.post(process.env.DISCORD, formData, {
        headers: formData.getHeaders()
    });
}
