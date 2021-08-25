const express = require('express');
const axios = require('axios');
const app = express();

const { getRecentJobApps, postNewJobApp } = require('./controllers.js');

const port = 8500;

app.get('/dump', async (req, res) => {
  try {
    const jobApplications = await getRecentJobApps();
    res.send(jobApplications);
  } catch(err) {
    console.log(err);
  }
})

app.post('/dump', async (req, res) => {
  try {
    await postNewJobApp(req.query);
    res.send('Job Application Posted');
  } catch(err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})