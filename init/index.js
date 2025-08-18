const mongoose = require('mongoose');
require('dotenv').config();
const initdata = require('../init/data.js');
const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const map_token = process.env.MAP_API_KEY;
const geocodingClient = mbxGeocoding({ accessToken: map_token });

const db_url = process.env.ATLAS_DB;

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(db_url);
}

const initdb = async () => {
  await Listing.deleteMany({});
  
  // loop through seed data and fetch geometry for each location
  for (let obj of initdata.data) {
    const response = await geocodingClient
      .forwardGeocode({
        query: obj.location,
        limit: 1
      })
      .send();

    const geoData = response.body.features[0].geometry;

    const newListing = new Listing({
      ...obj,
      owner: '68a28c9cee3a0d0b0b5723ba',
      geometry: geoData
    });

    await newListing.save();
  }

  console.log("data was initialized with real geometry from Mapbox 🌍");
};

initdb();