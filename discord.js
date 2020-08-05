const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async main() {
await discord("bg.png");
}

async function discord(filename) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filename));
    const res = await axios.post(process.env.DISCORD, formData, {
        headers: formData.getHeaders()
    });
}
