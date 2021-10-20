const express = require('express');
const ObjectId = require('mongodb').ObjectId; 

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the records.
recordRoutes.route('/pelias').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('pelias')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
        
      }
    });
});

// This section will help you create a new record.
recordRoutes.route('/pelias/recordSwipe').post(function (req, res) {
  console.log(req.body)
  const dbConnect = dbo.getDb();
  const matchDocument = req.body;

  dbConnect
    .collection('pelias')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(201).send(`${result.insertedId}`);
      }
    });
});

// This section will help you update a record by id.
recordRoutes.route('/pelias/updateLike').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: ObjectId( req.body.id) };
  delete req.body.id;
  const updates = {
    $set: req.body
  };

  dbConnect
    .collection('pelias')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery._id}!`);
      } else {
        console.log('1 document updated');
        res.status(200).send(`documento ${listingQuery._id} cambiado`);
      }
    });
});

// This section will help you delete a record.
recordRoutes.route('/pelias/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: ObjectId( req.body.id) };

  dbConnect
    .collection('pelias')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
        res.status(200).send(`documento ${listingQuery._id} borrado`);
      }
    });
});

module.exports = recordRoutes;
