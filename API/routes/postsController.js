/*const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

const { PostsModel } = require('../models/postsModel');

router.get('/', (req, res) => {
    PostsModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data: " + err)
    })
});

router.post('/', (req, res) => {
  const newRecord = new PostsModel({
    number: req.body.number,
    alley: req.body.alley,
    column: req.body.column,
    level: req.body.level,
    storage: req.body.storage,
    buildings: req.body.buildings,
    X: req.body.X,
    Y: req.body.Y
  });

  newRecord.save((err, docs) => {
      if (!err) res.send(docs);
        else console.log('Error creating new data: ' + err);
    })
})


//update date route with id
router.put("/:id", (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown: " + req.params.id)

    const updateRecord = {
        number: req.body.number,
        alley: req.body.alley,
        column: req.body.column,
        level: req.body.level,
        storage: req.body.storage,
        buildings: req.body.buildings,
        X: req.body.X,
        Y: req.body.Y
    };

    PostsModel.findByIdAndUpdate(
        req.params.id,
        { $set: updateRecord},
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error: " + err);
        }
    )
});

router.delete("/:id", (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown: " + req.params.id)

    PostsModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
        if (!err) res.send(docs);
        else console.log("Delete error: " + err);
    })
});

module.exports = router;