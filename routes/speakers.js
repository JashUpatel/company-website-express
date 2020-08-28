const express = require('express');

const router = express.Router();

// new way to export routes
// in this we can pass the parameters to the routes

module.exports = (params) => {
  const { speakersService } = params;

  router.get('/', async (req, res, next) => {
    // res.render('pages/index', { pageTitle: 'Welcome' });
    // return res.send('speakers list');
    // throw new Error('err');
    try {
      const speakers = await speakersService.getList();
      const artwork = await speakersService.getAllArtwork();

      return res.render('layouts', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (req, res, next) => {
    try {
      const speaker = await speakersService.getSpeaker(req.params.shortname);
      const artwork = await speakersService.getArtworkForSpeaker(req.params.shortname);

      console.log(artwork);

      return res.render('layouts', {
        pageTitle: 'Speakers',
        template: 'speakers-detail',
        speaker,
        artwork,
      });
    } catch (err) {
      return next(err);
    }

    // return res.send(`Detail page of ${req.params.shortname}`);
  });

  return router;
};
