mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
});

// Create the marker and attach a popup
new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // Add offset so it doesn't cover the marker
            .setHTML(
                `<h4>Location</h4><p>Exact location will be provided after booking</p>`
            )
    )
    .addTo(map);