export default (
  express,
  bodyParser,
  createReadStream,
  crypto,
  http
) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,OPTIONS,DELETE'
    );

    if (
      req.path !== '/' &&
      !req.path.endsWith('/')
    ) {
      const query = req.url.includes('?')
        ? req.url.slice(req.url.indexOf('?'))
        : '';

      return res.redirect(
        301,
        req.path + '/' + query
      );
    }

    next();
  });

  app.get('/login/', (req, res) => {
    res.send('ladyxxa');
  });

  app.get('/code/', (req, res) => {
    createReadStream(
      import.meta.url.substring(7)
    ).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    res.send(
      crypto
        .createHash('sha1')
        .update(req.params.input)
        .digest('hex')
    );
  });

  const handler = (req, res) => {
    const addr =
      req.method === 'POST'
        ? req.body.addr
        : req.query.addr;

    http.get(addr, response => {
      let result = '';

      response.on('data', chunk => {
        result += chunk;
      });

      response.on('end', () => {
        res.send(result);
      });
    });
  };

  app.get('/req/', handler);

  app.post('/req/', handler);

  app.all('*', (req, res) => {
    res.send('ladyxxa');
  });

  return app;
};
