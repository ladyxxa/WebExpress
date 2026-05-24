import { URL } from 'url';
import https from 'https';

export default (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    if (!req.originalUrl.endsWith('/') && !req.originalUrl.includes('?')) {
      res.redirect(301, req.originalUrl + '/');
      return;
    }
    next();
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/login/', (req, res) => {
    res.send('ladyxxa');
  });

  app.get('/code/', (req, res) => {
    const filePath = import.meta.url.substring(7);
    const stream = createReadStream(filePath);
    stream.pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    const input = req.params.input;
    const hash = crypto.createHash('sha1').update(input).digest('hex');
    res.send(hash);
  });

  const doRequest = (urlStr, res) => {
    const parsedUrl = new URL(urlStr);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    protocol.get(parsedUrl, (response) => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => res.send(data));
    }).on('error', () => res.status(500).send('Request failed'));
  };

  app.get('/req/', (req, res) => {
    const addr = req.query.addr;
    if (!addr) {
      res.status(400).send('addr parameter required');
      return;
    }
    doRequest(addr, res);
  });

  app.post('/req/', (req, res) => {
    const addr = req.body.addr;
    if (!addr) {
      res.status(400).send('addr parameter required');
      return;
    }
    doRequest(addr, res);
  });

  app.all('*', (req, res) => {
    res.send('ladyxxa');
  });

  return app;
};
