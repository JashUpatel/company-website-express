const express = require('express');
const { check, validationResult } = require('express-validator');
const FeedbackService = require('../services/FeedbackService');

const router = express.Router();
const validations = [
  check('name')
    .trim()
    .isLength({ min: 3 })
    .escape() // is used to prevent the html js code as input
    .withMessage('A name is required'),

  check('email')
    .trim()
    .isEmail() // checks if format of email is corect
    .normalizeEmail() // normalise email like convert into lowercase etc
    .withMessage('A email is required'),

  check('title').trim().isLength({ min: 3 }).escape().withMessage('A title is required'),

  check('message').trim().isLength({ min: 5 }).escape().withMessage('A message is required'),
];

// new way to export routes
// in this we can pass the parameters to the routes

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res, next) => {
    // res.render('pages/index', { pageTitle: 'Welcome' });
    // return res.send('Feedback page');
    try {
      // console.log(topSpeakers);
      const feedbacks = await feedbackService.getList();
      const errors = req.session.feedback ? req.session.feedback.errors : false;
      const successMessage = req.session.feedback ? req.session.feedback.message : false;

      req.session.feedback = {};

      // console.log(`visit count ${req.session.visitCount}`);
      return res.render('layouts', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedbacks,
        errors,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', validations, async (req, res, next) => {
    try {
      const errors = validationResult(req); // used to get errors in result
      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect('/feedback');
      }
      // console.log(req.body);
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      req.session.feedback = {
        message: 'Thank You for your response.',
      };
      return res.redirect('/feedback');
    } catch (err) {
      return next(err);
    }
  });

  router.post('/api', validations, async (req, res, next) => {
    try {
      const errors = validationResult(req); // used to get errors in result

      if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedback = await feedbackService.getList();
      return res.json({ feedback, successMessage: 'Thank you for your feedback ~rest' });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
