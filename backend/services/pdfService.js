const pdfParse = require('pdf-parse');
const axios = require('axios');

//  Parse PDF from URL  
const parsePdfFromUrl = async (pdfUrl) => {
  try {
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

// Parse PDF from Buffer 
const parsePdfFromBuffer = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

module.exports = { parsePdfFromUrl, parsePdfFromBuffer };