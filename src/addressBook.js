// Object Format
// {
//     id: UUID,
//     firstName: String,
//     lastName: String,
//     address1: String,
//     address2: String,
//     city: String,
//     state: String,
//     zip: Number
//   }

const { v4: uuid } = require('uuid');

module.exports = [
  {
    id: uuid(),
    firstName: 'Taylor',
    lastName: 'Phelps',
    address1: '1234 Address Street',
    address2: 'Apt 520',
    city: 'Place',
    state: 'WA',
    zip: 54891,
  },

  {
    id: uuid(),
    firstName: 'Nick',
    lastName: 'Jang',
    address1: '4321 Place Street',
    address2: 'Apt 790',
    city: 'Address',
    state: 'PA',
    zip: 67891,
  },
];
