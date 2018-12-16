const CardRoutes = require('./Routes/CardRoutes');

module.exports = {
  registryRoutes(app) {
    app.get('/', (req, res) => {
      res.status(200).json('Manage system is on');
    });
    app.use(CardRoutes);
  },
};
