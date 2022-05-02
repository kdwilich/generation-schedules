import express from 'express';
import timeout from 'express-timeout-handler';
import morgan from 'morgan';
import { getSchedules, getProjects, PROJECTS, WEEK_DAYS } from './generation-schedule.js';
import fs from 'fs';

const PORT = process.env.PORT || 3500;
const app = express();
const options = {
  timeout: 5000,
  onTimeout: function(req, res) {
    res.status(503).send('Service unavailable. Please retry.');
  },
  onDelayedResponse: function(req, method, args, requestTime) {
    console.log(`Attempted to call ${method} after timeout`);
  },
  disable: ['write', 'setHeaders', 'send', 'json', 'end']
};

const getCurrentDay = () => WEEK_DAYS[(new Date()).getDay()];

const sendSchedules = async (req, res, next) => {
  const day = req.params.day ? req.params.day.toLowerCase() : getCurrentDay();
  const proj = req.params.proj ? req.params.proj.toUpperCase() : '';
  getSchedules(day, proj).then(data => {
    res.status(200).send(data);
  }).catch(err => {
    let status = 500;
    let message = err;
    if (!WEEK_DAYS.includes(day) && day !== '') {
      status = 404;
      message += `\nError: Unknown day "${day}"`
    }
    if (!PROJECTS.includes(proj) && proj !== '') {
      status = 404;
      message += `\nError: Unknown project "${proj}"`
    }
    res.status(status).send(message)
  })
}

const sendProjects = async (req, res, next) => {
  try {
    res.status(200).send({
      projects: getProjects(),
      day: getCurrentDay()
    });
  } catch(err) {
    let status = 500;
    let message = err;
    res.status(status).send(message)
  }
}

// function errorHandler 

app.set('port', PORT);
app.use(express.json());
app.use(timeout.handler(options));
app.use(morgan('tiny'));
app.use((req, res, next) => {
  res.set('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use((err, req, res, next) => {
  res.status(500);
  res.render('error', { error: err });
})

app.listen(
  PORT,
  () => {
    console.clear();
    console.debug(`app listening on http://localhost:${PORT}`);
  }
);

app.get('/', (req, res) => {
  const page = fs.readFileSync('src/index.html');
  res.set('Content-Type', 'text/html');
  res.send(page)
});
app.get('/api', sendSchedules);
app.get('/api/projects', sendProjects);
app.get('/api/cur', sendSchedules);
app.get('/api/:day', sendSchedules);
app.get('/api/cur/:proj', sendSchedules);
app.get('/api/:day/:proj', sendSchedules);
