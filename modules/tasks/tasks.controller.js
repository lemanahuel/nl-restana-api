const _ = require('lodash');
const async = require('async');
const Cloudy = require('../../integrations/cloudinary');
const Sendgrid = require('../../integrations/sendgrid');
const TaskModel = require('./tasks.model');

module.exports = class Tasks {
  static create(req, res) {
    TaskModel.create(req.body, (err, doc) => {
      if (err) return res.send(err);
      res.send(doc);
    });
  }

  static list(req, res) {
    let q = req.query || {};
    let findParams = { enable: true };
    let queryParams = {};

    if (q.sort) {
      queryParams.sort = q.sort;
    }
    if (q.filter) {
      findParams[_.replace(q.filter, '-', '')] = _.indexOf(q.filter, '-') > -1 ? false : true;
    }
    TaskModel.find(findParams, null, queryParams).lean().exec((err, docs) => {
      if (err) return res.send(err);
      res.send(docs);
    });
  }

  static read(req, res) {
    TaskModel.findById(req.params.id).lean().exec((err, doc) => {
      if (err) return res.send(err);
      res.send(doc);
    });
  }

  static async update(req, res) {
    let oldTask = await TaskModel.findById(req.params.id).lean().exec();
    let newTask = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true, safe: true }).lean().exec();
    Sendgrid.send({
      oldTask,
      newTask,
      action: 'tarea actualizada'
    }).then(doc => {
      res.send(newTask);
    }, err => {
      res.send(err);
    });
  }

  static updateTitle(req, res) {
    TaskModel.findByIdAndUpdate(req.params.id, {
      title: req.body.title
    }).lean().exec((err, doc) => {
      if (err) return res.send(err);
      res.send(doc);
    });
  }

  static updateCompleted(req, res) {
    TaskModel.findByIdAndUpdate(req.params.id, {
      completed: req.body.completed
    }).lean().exec((err, doc) => {
      if (err) return res.send(err);
      res.send(doc);
    });
  }

  static async updateImages(req, res) {
    let images = await Cloudy.uploadImages(req.files);
    let oldTask = await TaskModel.findById(req.params.id).select('images').lean().exec();

    TaskModel.findByIdAndUpdate(req.params.id, {
      images: _.concat(oldTask.images || [], _.map(images, img => img.url))
    }).lean().exec((err, doc) => {
      if (err) return res.send(err);
      res.send(doc);
    });
  }

  static delete(req, res) {
    // return TaskModel.findByIdAndRemove(req.params.id).lean().exec();
    TaskModel.findByIdAndUpdate(req.params.id, {
      enable: false
    }).lean().exec((err, doc) => {
      if (err) return res.send(err);
      res.send(doc);
    });
  }
};