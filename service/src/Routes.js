const ManagerRoutes = require('./Routes/UserRoutes');

module.exports = {
  registryRoutes(app) {
    app.get('/', (req, res) => {
      res.status(200).json('Manage system is on');
    });
    app.use(ManagerRoutes);
  },
};
