const express = require('express');
const speakerRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

// new way to export routes
// in this we can pass the parameters to the routes

module.exports = (params) => {
  const { speakersService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const topSpeakers = await speakersService.getList();
      const artwork = await speakersService.getAllArtwork();
      console.log(topSpeakers);
      if (!req.session.visitCount) {
        req.session.visitCount = 0;
      }
      req.session.visitCount += 1;
      console.log(`visit count ${req.session.visitCount}`);
      return res.render('layouts', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakerRoute(params));
  router.use('/feedback', feedbackRoute(params));
  return router;
};
