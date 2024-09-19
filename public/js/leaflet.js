/* eslint-disable */

export const displayMap = locationsData => {
  const [longStart, latStart] = locationsData[0].coordinates;

  const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false
  }).setView([latStart, longStart], 8);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    interactive: false
  }).addTo(map);

  for (let i = locationsData.length - 1; i >= 0; i--) {
    const currLocation = locationsData[i];

    const [long, lat] = currLocation.coordinates;

    const marker = L.marker([lat, long]).addTo(map);

    marker
      .bindPopup(
        `<h1>Arrive on Day ${currLocation.day}</h1><br><h1>Location: ${
          currLocation.description
        }.</h1>`
      )
      .openPopup();
  }
};
