// https://github.com/song940/node-escpos
// https://github.com/Klemen1337/node-thermal-printer


let { remote } = require("electron");

const { PosPrinter } = remote.require("electron-pos-printer");

const path = require("path");

let webContents = remote.getCurrentWebContents();
let printers = webContents.getPrinters(); //list the printers
console.log(printers);

printers.map((item, index) => {
  //write in the screen the printers for choose
     document.getElementById("list_printers").innerHTML +=
    ' <input type="radio" id="printer_' +
    index +
    '" name="printer" value="' +
    item.name +
    '"><label for="printer_' +
    index +
    '">' +
    item.name +
    "</label><br>";

});


const data = [
  {
    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: "||---",
    style: `text-align:left;`,
    css: { "font-size": "12px" },
  },
  {
    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: "HEADER",
    style: `text-align:center;`,
    css: { "font-weight": "700", "font-size": "18px" },
  },
  {
    type: "image",
    path: path.join(__dirname, "assets/img_test.png"), // file path
    position: "center", // position of image: 'left' | 'center' | 'right'
    width: "auto", // width of image in px; default: auto
    height: "60px", // width of image in px; default: 50 or '50px'
  },
  {
    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
    value:
      "Lorem ipsum<br><br> . , ; : ( ) - + = ! # % \" ' <br><br> ã Ã ç Ç $ & @ ê Ê í Í<br><br> 0 1 2 3 4 5 6 7 8 9 <br>a b c d e f g h i j k l m n o p q r s t u v w x y z<br>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br><br><hr><br>elit, sed do asdf asdf s adsf asd fasdf asfd asf asf asdf adf adsf asdf asfadsfasfd asdf sadf asdf asdf dasf asfd eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation \n ullamco \n laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum<br>",

    css: {
      "font-size": "12px",
      "font-family": "sans-serif",
      "text-align": "center",
    },
  },
  {
    type: "barCode", // Do you think the result is ugly? Me too. Try use an image instead...
    value: "HB4587896",
    height: 12,
    width: 1,
    displayValue: true, // Display value below barcode
    fontsize: 8,
  },
  {
    type: "qrCode",
    value: "https://github.com/fssonca",
    height: 80,
    width: 80,
    style: "margin-left:50px",
  },
  {
    type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: "---||",
    style: `text-align:right;`,
    css: { "font-size": "12px" },
  },
];

function date() {
  const x = new Date();

  const y = "0" + x.getHours();
  const z = "0" + x.getMinutes();
  const s = "0" + x.getSeconds();
  const h = "0" + x.getDate();
  const ano = x.getFullYear().toString().substr(-2);
  const ms = x.getMonth();
  const meses = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    y.substr(-2) +
    ":" +
    z.substr(-2) +
    ":" +
    s.substr(-2) +
    " -  " +
    h.substr(-2) +
    "/" +
    meses[ms]
  );
}

function print() {
  let printerName;
  let widthPage;

  var p = document.getElementsByName("printer");
  var w = document.getElementsByName("width");

  for (var i = 0, length = p.length; i < length; i++) {
    if (p[i].checked) {
      printerName = p[i].value;

      break;
    }
  }

  for (var i = 0, length = w.length; i < length; i++) {
    if (w[i].checked) {
      widthPage = w[i].value;

      break;
    }
  }

  console.log(printerName, widthPage);

  const options = {
    preview: false, // Preview in window or print
    width: widthPage, //  width of content body
    margin: "10px 10px 10px 10px", // margin of content body
    copies: 1, // Number of copies to print
    printerName: printerName, // printerName: string, check it at webContent.getPrinters()
    timeOutPerLine: 400,
    silent: true,
    //pageSize: {height: 500, width: 500} // page size
  };

  console.log(options);

  const now = {
    type: "text",
    value: "" + date(),
    style: `text-align:center;`,
    css: { "font-size": "12px", "font-family": "sans-serif" },
  };

  const d = [...data, now];

  if (printerName && widthPage) {
    PosPrinter.print(d, options)
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  } else {
    alert("Select the printer and the width");
  }
}

// let { remote } = require("electron");
//
// const {PosPrinter} = remote.require("electron-pos-printer");
// const path = require("path");
//
// const options = {
//    preview: true,               // Preview in window or print
//    width: '500px',               //  width of content body
//    margin: '100px 0 0 0',            // margin of content body
//    copies: 1,                    // Number of copies to print
//    printerName: 'Canon LBP2900',        // printerName: string, check with webContent.getPrinters()
//    timeOutPerLine: 400,
//    scaleFactor: '300',
//       pageSize: { height: '500px', width: '500px' },  // page size
//    silent: false
// }
//
// const data = [
//    {
//      type: 'image',
//      path: path.join(__dirname, 'assets/banner.png'),     // file path
//      position: 'center',                                  // position of image: 'left' | 'center' | 'right'
//      width: '60px',                                           // width of image in px; default: auto
//      height: '60px',                                          // width of image in px; default: 50 or '50px'
//    },{
//       type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//       value: 'SAMPLE HEADING',
//       style: `text-align:center;`,
//       css: {"font-weight": "700", "font-size": "18px"}
//    },{
//       type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
//       value: 'Secondary text',
//       style: `text-align:left;color: red;`,
//       css: {"text-decoration": "underline", "font-size": "10px"}
//    },{
//       type: 'barCode',
//       value: 'HB4587896',
//       height: 12,                     // height of barcode, applicable only to bar and QR codes
//       width: 1,                       // width of barcode, applicable only to bar and QR codes
//       displayValue: true,             // Display value below barcode
//       fontsize: 8,
//    },{
//      type: 'qrCode',
//       value: 'https://github.com/Hubertformin/electron-pos-printer',
//       height: 55,
//       width: 55,
//       style: 'margin: 10 20px 20 20px'
//     },{
//        type: 'table',
//        // style the table
//        style: 'border: 1px solid #ddd',
//        // list of the columns to be rendered in the table header
//        tableHeader: ['Animal', 'Age'],
//        // multi dimensional array depicting the rows and columns of the table body
//        tableBody: [
//            ['Cat', 2],
//            ['Dog', 4],
//            ['Horse', 12],
//            ['Pig', 4],
//        ],
//        // list of columns to be rendered in the table footer
//        tableFooter: ['Animal', 'Age'],
//        // custom style for the table header
//        tableHeaderStyle: 'background-color: #000; color: white;',
//        // custom style for the table body
//        tableBodyStyle: 'border: 0.5px solid #ddd',
//        // custom style for the table footer
//        tableFooterStyle: 'background-color: #000; color: white;',
//     },{
//        type: 'table',
//        style: 'border: 1px solid #ddd',             // style the table
//        // list of the columns to be rendered in the table header
//        tableHeader: [{type: 'text', value: 'Animal'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
//        // multi dimensional array depicting the rows and columns of the table body
//        tableBody: [
//            [{type: 'text', value: 'Cat'}, {type: 'image', path: './animals/cat.jpg'}],
//            [{type: 'text', value: 'Dog'}, {type: 'image', path: './animals/dog.jpg'}],
//            [{type: 'text', value: 'Horse'}, {type: 'image', path: './animals/horse.jpg'}],
//            [{type: 'text', value: 'Pig'}, {type: 'image', path: './animals/pig.jpg'}],
//        ],
//        // list of columns to be rendered in the table footer
//        tableFooter: [{type: 'text', value: 'Animal'}, 'Image'],
//        // custom style for the table header
//        tableHeaderStyle: 'background-color: #000; color: white;',
//        // custom style for the table body
//        tableBodyStyle: 'border: 0.5px solid #ddd',
//        // custom style for the table footer
//        tableFooterStyle: 'background-color: #000; color: white;',
//     },
// ]
//
// function print()
// {
//    PosPrinter.print(data, options)
//       .then(() => {})
//          .catch((error) => {
//        console.error(error);
//        });
// }
