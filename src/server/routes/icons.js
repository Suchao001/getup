import express from 'express';
import knex from '../config.js';

const router = express.Router();

router.get('/:id?', async (req, res) => {
  try {
    const iconId = req.params.id;

    if (iconId) {
      const icon = await knex('icons')
        .where({ id: iconId })
        .first();
      if (icon) {
        res.status(200).json(icon);
      } else {
        res.status(404).json({ error: 'Icon not found' });
      }
    } else {
      const icons = await knex('icons').select();
      res.status(200).json(icons);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});


export default router;
