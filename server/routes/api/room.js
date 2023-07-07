const withAuth = require('../../middleware/middleware');

module.exports = (app, db) => {
  // @route   GET api/rooms
  // @desc    Get all rooms
  // @access  Private
  app.get('/api/rooms', withAuth, (req, res) =>
    db.Room.findAll({
      order: [['id', 'ASC']]
    })
      .then(result => res.json(result))
      .catch(err => {
        console.error('Error with GET All', err.message);
        res.status(400).send(err.message);
      })
  );

  // @route   GET api/room/:id
  // @desc    Get room by id
  // @access  Private
  app.get('/api/room/:id', withAuth, (req, res) =>
    db.Room.findByPk(req.params.id).then(result => res.json(result))
  );

  // @route   POST api/room
  // @desc    Post new room
  // @access  Private
  app.post('/api/room', withAuth, (req, res) =>
    db.Room.create({
      name: req.body.name,
      capacity: req.body.capacity,
      available: req.body.available,
      equipment: req.body.equipment
    }).then(result => res.json(result))
  );

  // @route   PUT api/room/:id
  // @desc    Modify existing room
  // @access  Private
  app.put('/api/room/:id', withAuth, (req, res) =>
    db.Room.update(
      {
        name: req.body.name,
        capacity: req.body.capacity,
        available: req.body.available,
        equipment: req.body.equipment
      },
      {
        where: {
          id: req.params.id
        }
      }
    ).then(result => res.json(result))
  );

  // @route   DELETE api/room/:id
  // @desc    Delete existing room
  // @access  Private
  app.delete('/api/room/:id', withAuth, (req, res) =>
    db.Room.destroy({
      where: {
        id: req.params.id
      }
    }).then(result => res.json(result))
  );
};
