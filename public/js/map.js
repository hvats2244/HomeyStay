//ya (listing) show.ejs sa leker aya h script tag sa.
          const lat = listing.geometry.coordinates[0];
          const lang = listing.geometry.coordinates[1];

        const map = L.map('map').setView([lang,lat], 20); // Delhi
        L.tileLayer('https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=f89c8af0ab0c4aceb723a39ef61b79e5', {
            attribution: '&copy; OpenStreetMap contributors & Geoapify'
            
        }).addTo(map);
    
  
        console.log(listing);
        const marker = L.marker([lang,lat]).addTo(map) // listing.geometry.coordinates h ya .
        .bindPopup(`${listing.title} <br> Exact Location will be provided after booking`)
        .openPopup();