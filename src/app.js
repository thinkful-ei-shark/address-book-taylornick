// Imports

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { PORT, NODE_ENV } = require('./config');
const { addresses, uuid } = require('./addressBook.js');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

// Middleware
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/address', (req, res) => {
  res
    .json(addresses);
});

// Token Validation
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  console.log('validate bearer token middleware');

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

// Post Request for all addresses
app.post('/address', (req, res) => {
  const { firstName, lastName, address1,
    address2 = '', city, state } = req.body;
  let { zip } = req.body;

  if (!firstName)
    res.status(400).json({ error: 'Please give a first name.' });

  if (!lastName)
    res.status(400).json({ error: 'Please give a last name.' });

  if (!address1)
    res.status(400).json({ error: 'Please give a street address.' });

  if (!city)
    res.status(400).json({ error: 'Please give a city.' });

  if (!state)
    res.status(400).json({ error: 'Please give a state.' });

  if (!zip)
    res.status(400).json({ error: 'Please give a zip code.' });

  if (state.length !== 2)
    res.status(400).json({ error: 'Please enter a state that is two characters.' });

  if (zip.trim().length !== 5)
    res.status(400).json({ error: 'Please enter a zipcode that is five numbers.' });

  zip = parseInt(zip);
  const id = uuid();
  const address = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip
  };

  addresses.push(address);

  res
    .status(201)
    .location( `http://localhost:${PORT}/address/${id}`)
    .json(address);
});


// Delete Request for a specific address
app.delete('/address/:id', (req, res) => {
  const { id } = req.params;
  const index = addresses.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).send('Address not found');
  }

  addresses.splice(index, 1);
  res.status(240).end();
});

// Error Handling
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
