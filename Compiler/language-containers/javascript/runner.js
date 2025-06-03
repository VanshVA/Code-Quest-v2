const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

app.post('/run', (req, res) => {
  const code = req.body.code;
  fs.writeFileSync('script.js', code);

  exec('node script.js', (err, stdout, stderr) => {
    res.json({ output: stdout, error: stderr });
  });
});

app.listen(5004, () => console.log('JavaScript container on 5004'));
