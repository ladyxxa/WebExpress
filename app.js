import { URL } from 'url';

export default (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

  const makeRequest = (urlStr, res) => {
    const parsedUrl = new URL(urlStr);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };
    const protocol = parsedUrl.protocol === 'https:' ? await import('https') : http;
    const reqLib = protocol === https ? https : http;
    const request = reqLib.get(options, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => res.send(data));
    });
    request.on('error', () => res.status(500).send('Request failed'));
    request.end();
  };

  app.get('/req/', async (req, res) => {
    const addr = req.query.addr;
    if (!addr) {
      res.status(400).send('addr parameter required');
      return;
    }
    try {
      const parsedUrl = new URL(addr);
      let protocol;
      if (parsedUrl.protocol === 'https:') {
        protocol = await import('https');
      } else {
        protocol = http;
      }
      const reqLib = protocol === http ? http : protocol.default || protocol;
      reqLib.get(addr, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => res.send(data));
      }).on('error', () => res.status(500).send('Request failed'));
    } catch (e) {
      res.status(500).send('Invalid URL');
    }
  });

  app.post('/req/', async (req, res) => {
    const addr = req.body.addr;
    if (!addr) {
      res.status(400).send('addr parameter required');
      return;
    }
    try {
      const parsedUrl = new URL(addr);
      let protocol;
      if (parsedUrl.protocol === 'https:') {
        protocol = await import('https');
      } else {
        protocol = http;
      }
      const reqLib = protocol === http ? http : protocol.default || protocol;
      reqLib.get(addr, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => res.send(data));
      }).on('error', () => res.status(500).send('Request failed'));
    } catch (e) {
      res.status(500).send('Invalid URL');
    }
  });

  app.all('*', (req, res) => {
    res.send('ladyxxa');
  });

  return app;
};
