const pdfme = require('@pdfme/generator');
const fs = require('fs');

function fixImageDimensions(imageWidth, imageHeight) {
    const imageRatio = imageWidth / imageHeight;
    const newImageWidth = 471/6;
    const newImageHeight = newImageWidth / imageRatio;
    const newImage = {
        width: newImageWidth,
        height: newImageHeight,
    }
    return newImage;
}


function makePDF(user) {
    const fixedImage = fixImageDimensions(user.form.imageWidth, user.form.imageHeight);

    const template = {
        "schemas": [
          {
            "image": {
              "type": "image",
              "position": {
                "x": 4.82,
                "y": 5.55
              },
              "width": fixedImage.width,
              "height": fixedImage.height,
              "alignment": "left",
              "fontSize": 13,
              "characterSpacing": 0,
              "lineHeight": 1
            },
            "name": {
              "type": "text",
              "position": {
                "x": 107.42,
                "y": 7.15
              },
              "width": 90.29,
              "height": 27.64,
              "alignment": "left",
              "fontSize": 35,
              "characterSpacing": 0,
              "lineHeight": 1
            }
          }
        ],
        "basePdf": pdfme.BLANK_PDF
    }
    
    const inputs = [
        {
            image: user.form.image,
            name: user.form.firstName + ' ' + user.form.lastName
        }
    ]

    pdfme.generate({
        template: template,
        inputs: inputs
    }).then((pdf) => {
        fs.writeFileSync('output.pdf', pdf);
        console.log('PDF generated!');
    }).catch((err) => {
        console.log(err);
    });

}

/*
const PDFDocument = require('pdfkit');
const fs = require('fs');


function makePDF(user) {
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('output.pdf'));
    // add image to the pdf file
    doc.image(user.form.image, 15, 15, {fit: [300, 300]});
    // add name to the pdf file
    doc.fontSize(25).text(user.form.firstName + ' ' + user.form.lastName, {align: 'right'});


    doc.text(user.email, 100, 100);
    doc.end();
}

*/


module.exports = makePDF;