const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');

const pool = new Pool({
  user: 'kevinliang',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email){
  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1
  `,[email])
  .then(res => res.rows[0])
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id){
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1
  `,[id])
  .then(res => res.rows[0])
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function(user){
  const values = [user.name, user.email, user.password]
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `, values)
  .then(res => res.rows[0])
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// return getAllProperties(null, 2);

const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit]
  return pool.query(`
  SELECT reservations.*, properties.*, avg(property_reviews.rating)
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = reservations.property_id
  WHERE reservations.end_date > now()::date AND reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date 
  LIMIT $2
  `, values)
  .then(res => res.rows)
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let clause = 'WHERE'
  console.log(options)

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // if (options.owner_id) {
  //   queryParams.push(`${options.owner_id}`)
  //   queryString += `JOIN users ON users.id = owner_id WHERE users.id = $${queryParams.length} `
  // }

  if (options.city) {
    queryParams.push(`%${options.city}%`)
    queryString += `${clause} city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    if (queryString.includes('WHERE')){
      clause = 'AND'
    }
    queryParams.push(`${options.minimum_price_per_night}`)
    queryString += `${clause} cost_per_night > $${queryParams.length} `
  }

  if (options.maximum_price_per_night) {
    if (queryString.includes('WHERE')){
      clause = 'AND'
    }
    queryParams.push(`${options.maximum_price_per_night}`)
    queryString += `${clause} cost_per_night < $${queryParams.length} `
  }

  queryString += `GROUP BY properties.id `

  if(options.minimum_rating){
    queryParams.push(`${options.minimum_rating}`)
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = []
  for (const key in property) {
    queryParams.push(property[key])
  }
  return pool.query(`
  INSERT INTO properties (
    title, 
    description, 
    number_of_bedrooms, 
    number_of_bathrooms, 
    parking_spaces, 
    cost_per_night, 
    thumbnail_photo_url, 
    cover_photo_url, 
    street, 
    country, 
    city, 
    province, 
    post_code, 
    owner_id
  ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
  RETURNING *;
  `, queryParams)
  .then(res => res.rows[0]);
}
exports.addProperty = addProperty;