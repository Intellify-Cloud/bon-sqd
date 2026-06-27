const { createServer } = require('./server');

module.exports = async () => {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4001, '127.0.0.1', resolve);
  });

  return async () => {
    await new Promise(resolve => server.close(resolve));
  };
};
