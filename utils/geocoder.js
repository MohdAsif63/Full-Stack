const axios = require('axios');
require('dotenv').config();

const MAPTILER_KEY = process.env.MAP_TOKEN;

module.exports = {
  async forwardGeocode(query) {
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_KEY}`;
    const res = await axios.get(url);
    if (res.data.features.length === 0) throw new Error("No location found");
    const result = res.data.features[0];
    return {
      coordinates: result.geometry.coordinates,
      place_name: result.place_name
    };
  },

  async reverseGeocode(lat, lon) {
    const url = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${MAPTILER_KEY}`;
    const res = await axios.get(url);
    if (res.data.features.length === 0) throw new Error("No address found");
    return res.data.features[0].place_name;
  }
};
