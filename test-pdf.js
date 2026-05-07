const fs = require('fs');
const pdfParse = require('pdf-parse');

async function test() {
  try {
    // Create a dummy PDF file in memory
    // Actually, let's just test if pdfParse is a function
    console.log("pdfParse type:", typeof pdfParse);
    if (typeof pdfParse === 'function') {
      console.log("It's a function!");
    } else if (pdfParse.default) {
      console.log("Has default!");
    } else {
      console.log(pdfParse);
    }
  } catch (err) {
    console.error(err);
  }
}

test();
