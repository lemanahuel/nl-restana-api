const restana = require('restana');
const http = require('http');
const glob = require('glob');
const path = require('path');
const _ = require('lodash');
const async = require('async');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const Mustache = require('mustache');
const config = require('./config/config');
const db = require('./integrations/mongodb');
const querystring = require('querystring');
const url = require('url');

db.connect();

const service = restana({
  server: http.createServer(),
  defaultRoute: (req, res) => res.send(404)
});
service.use(morgan('tiny'));
service.use(bodyParser.urlencoded({
  extended: true
}));
service.use(bodyParser.json());
service.use(cors());

service.use((req, res, next) => {
  if (!req.query) {
    req.query = querystring.parse(url.parse(req.url).query);
  }
  next();
});

service.use((req, res, next) => {
  res.on('response', e => {
    if (e.code >= 400) {
      if (e.data && e.data.errClass) {
        console.log(e.data.errClass + ': ' + e.data.message);
      } else {
        console.log('err-res', e.data);
      }
    }
  });
  return next();
});

service.get('/', (req, res, next) => {
  res.writeHead(301, { Location: '/docs' });
  res.end();
});

glob('./modules/**/*.routes.js', {}, (err, files) => {
  async.each(files, (file, cb) => {
    require(path.resolve(file))(service);
    cb(null);
  }, err => {
    service.get('/docs', (req, res, next) => {
      fs.readFile('./public/docs/docs.html', (err, file) => {
        let html = Mustache.render(file.toString(), {
          app: {
            title: 'Probando render de restana',
            description: 'Endpoints:'
          },
          endpoints: _.map(service.routes(), item => {
            let route = _.replace(_.replace(item, '[', ''), ']', ',').split(',');
            return {
              path: route[1],
              method: route[0]
            };
          })
        });
        res.writeHead(200, {
          'Content-Type': 'text/html'
        }).end(html);
      });
    });

    service.get('/static', (req, res, next) => {
      fs.readFile('./public/statics/index.html', (err, file) => {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        }).end(file);
      });
    });

    service.start(config.PORT).then(() => {
      console.log(`RESTANA-API server started on ${config.PORT}`);
    });
  });
});