const express = require('express');
const app = express();

const pug = require('pug');
const { v4: uuidv4 } = require('uuid');

const path = require('path');
const fs = require('fs');

const port = 3000;

app.use('/', express.static('static'));
app.use('/mini.css', express.static('node_modules/mini.css/dist'));

app.use(express.urlencoded());

app.post('/', (req, res) => {
  const id = uuidv4();
  const destPath = path.resolve(process.cwd(), 'files', id);

  fs.writeFile(destPath, req.body.secret, function(err) {
    if (err) {
      return console.log("err");
    }
  }); 

  const indexFunction = pug.compileFile('templates/secret-link.pug');
  const indexHtml = indexFunction({id: id});

  res.send(indexHtml);
});

app.get('/:id', (req, res) => {
  const id = req.params.id;

  const secretPath = path.resolve(process.cwd(), 'files', id);

  fs.readFile(secretPath, 'utf8' , (err, data) => {
    if (err) {
      res.send('The secret is gone :(');
      return;
    }

    const fileData = data;

    const indexFunction = pug.compileFile('templates/secret-text.pug');
    const indexHtml = indexFunction({secret: fileData.toString()});
  
    try {
      fs.unlinkSync(secretPath)
    } catch(err) {
      console.error(err)
    }

    res.send(indexHtml);
  })

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});