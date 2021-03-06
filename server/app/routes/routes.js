const express = require('express');
const router = express.Router();
const db = require("../models");
const { Op } = require("sequelize");
const cors = require('cors')

//______________________________SetUp__________________________________

router.use(express.json());
router.use(cors());

//______________________________COMMENT Methods___________________________

// GET all comments
router.get("/getComments", (req, res) => {
  db.comment.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(function (comments) {
    res.json(comments);
  });
});

//Add a comment
router.post('/addComment', (req, res) => {
  const name = req.body.user_name;
  const id = req.body.user_id;
  const comment = req.body.comment;

  db.comment.create({
    user_name: name,
    user_id: id,
    comment: comment
  }).then(addedComment => res.json(addedComment))
})

//______________________________GLOBAL Methods___________________________

// Add or update a new global score
router.put("/putGlobal", (req, res) => {
  db.global.findOrCreate({
    where: {
      user_id: req.body.user_id
    },
    defaults: {
      global: req.body.global,
      user_id: req.body.user_id,
      user_name: req.body.user_name
    }
  }).then(() => {
    db.global.update({
      global: req.body.global
    }, {
      where: {
        user_id: req.body.user_id,
        global: {
          [Op.ne]: req.body.global
        }
      }
    }
    )
  })
});

// GET all Global scores
router.get("/userGlobal", (req, res) => {
  db.global.findAll({
    where: {
      user_id: req.body.user_id
    }
  }).then(userGlobal => {
    res.json(userGlobal);
  });
});

// GET all Global scores
router.get("/globals", (req, res) => {
  db.global.findAll({
    order: [
      ['global', 'DESC']
    ]
  }).then(function (users) {
    res.json(users);
  });
});

//______________________________USER Methods___________________________

// GET all Users
router.get("/users", (req, res) => {
  db.user.findAll().then(function (users) {
    res.json(users);
  });
});

//POST create user
router.post('/create', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  db.user.findOrCreate({
    where: {
      name: name
    },
    defaults: {
      name: name,
      password: password
    }
  }).then(submitedUsers => res.json(submitedUsers))
})

//POST check login
router.post('/login', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  db.user.findAll({
    where: {
      name: name,
      password: password
    }
  })
    .then((checkedUser) => {
      res.json(checkedUser)
    })
})

//GET ONE
router.get("/users/:id", (req, res) => {
  db.user.findAll({
    where: {
      id: req.params.id
    }
  }).then(user => res.json(user));
});

//UPDATE
router.put('/users/update', (req, res) => {
  db.user.update(
    {
      name: req.body.name
    },
    { where: { id: req.body.id } }
  )
});

//DELETE
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  db.user.destroy({
    where: { id: id }
  })
});

//______________________________GAMES Methods___________________________

// GET all Game object
router.get("/games", (req, res) => {
  db.game.findAll().then(function (users) {
    res.json(users);
  });
});

// Add new game if not exist
router.put("/addGame", (req, res) => {
  db.game.findOrCreate({
    where: {
      id: req.body.id,
      name: req.body.name
    },
    defaults: {
      id: req.body.id,
      name: req.body.name,
    }
  })
});

//______________________________RECORD Methods___________________________

// GET all Records of all users
router.get("/records", (req, res) => {
  db.record.findAll().then((users) => {
    res.json(users);
  });
});


// Get TOP3 records of one game
router.post("/topGameRecords", (req, res) => {
  db.record.findAll({
    limit: 5,
    order: [
      ['record', 'DESC']
    ],
    where: {
      game_id: req.body.game_id,
    }
  }).then((record) => {
    res.json(record);
  });
})

// Get all records of one game
router.post("/gameRecords", (req, res) => {
  db.record.findAll({
    order: [
      ['record', 'DESC']
    ],
    where: {
      game_id: req.body.game_id,
    }
  }).then((record) => {
    res.json(record);
  });
})

// Get all records of all games of user
router.post("/getRecords", (req, res) => {
  db.record.findAll({
    where: {
      user_id: req.body.user_id,
    }
  }).then((record) => {
    res.json(record);
  });
})

// Get a selected game record of user
router.post("/getRecord", (req, res) => {
  db.record.findAll({
    where: {
      user_id: req.body.user_id,
      game_id: req.body.game_id
    }
  }).then((record) => {
    res.json(record);
  });
})

// Add or update a new record
router.put("/addRecord", (req, res) => {
  db.record.findOrCreate({
    where: {
      user_id: req.body.user_id,
      game_id: req.body.game_id
    },
    defaults: {
      record: req.body.record,
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      game_id: req.body.game_id,
      game_name: req.body.game_name
    }
  }).then(() => {
    db.record.update({
      record: req.body.record
    }, {
      where: {
        record: {
          [Op.lt]: req.body.record
        },
        user_id: req.body.user_id,
        game_id: req.body.game_id
      }
    }
    )
  })
});

module.exports = router;