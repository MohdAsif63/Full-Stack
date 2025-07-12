// Maptiler SDK config
maptilersdk.config.apiKey = mapToken;

// Convert coordinates string to array if necessary
let coords;
try {
  if (typeof coordinates === 'string') {
    coords = JSON.parse(coordinates);
  } else {
    coords = coordinates;
  }

  if (!Array.isArray(coords) || coords.length !== 2) {
    throw new Error("Invalid coordinates format");
  }
} catch (err) {
  console.error("Error parsing coordinates:", err);
  coords = [77.2090, 28.6139]; // Default to Delhi if failed
}

// Initialize map
const map = new maptilersdk.Map({
  container: 'map',
  style: maptilersdk.MapStyle.STREETS,
  center: coords,
  zoom: 10
});


// Add marker
const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(`
  <div class="popup-title">${popupText}</div>
`);
new maptilersdk.Marker({color:"red"}).setLngLat(coords).setPopup(popup).addTo(map);



