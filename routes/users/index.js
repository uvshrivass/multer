const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
var qpdf = require('node-qpdf');

// const jade = require('jade');

var exec = require('child_process').exec;


// router.set('view engine', 'jade');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, 'uploads/')
  },
  filename: function (req, file, next) {

    next(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },

})


const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    if (path.extname(file.originalname) !== '.pdf') {
      return console.log(cb(new Error('Only pdfs are allowed')))
    }

    cb(null, true)
  }
})


router.get('/', function (req, res, next) {
  res.render(path.join(__dirname, "/../../views/index.jade"))
})

router.post('/', upload.single('avatar'), function (req, res, next) {

  var cmd = `qpdf --encrypt ${req.body.password} test 40 -- uploads/${req.file.filename} protectedpdf/${req.file.filename}`;

  exec(cmd, function (err) {
    if (err) {
      console.error('Error occured: ' + err);
    } else {
      console.log('PDF encrypted :)');
      let transporter = nodemailer.createTransport({
        host: "gains.arrowsupercloud.com",
        port: 465,
        secure: true,
        auth: {
          user: "please enter your own email",
          pass: "please enter your own password"
        }
      });

      let mailOptions = {
        from: '"Your Name" your email',
        to: `${req.body.email}`,
        subject: "We've got a mail for you",
        text: "Hello",
        html: `${req.body.message}`,
        attachments: [{
          filename: `${req.file.filename}`,
          content: fs.createReadStream(path.join(__dirname, '/../../protectedpdf/' + req.file.filename))
        }]
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          throw (err)
        }
        else {
          console.log("Message sent: %s", info.messageId);

        }
      });
    }
  })

  res.json({ "Status": "File Sent" })
});


module.exports = router;