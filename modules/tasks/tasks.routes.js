const multipart = require('connect-multiparty')();
const TasksController = require('./tasks.controller');
const middlewares = require('../../middlewares/middlewares');

module.exports = service => {
  service.get('/tasks', TasksController.list);
  service.post('/tasks', middlewares.isValidDomain, TasksController.create);
  service.get('/tasks/:id', middlewares.isValidDomain, TasksController.read);
  service.put('/tasks/:id', middlewares.isValidDomain, TasksController.update);
  service.put('/tasks/:id/title', middlewares.isValidDomain, TasksController.updateTitle);
  service.put('/tasks/:id/completed', middlewares.isValidDomain, TasksController.updateCompleted);
  service.put('/tasks/:id/images', middlewares.isValidDomain, multipart, TasksController.updateImages);
  service.delete('/tasks/:id', middlewares.isValidDomain, TasksController.delete);
};