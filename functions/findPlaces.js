exports.handler = async (event) => {
  const { lat, lng, radius = 5000, type } = JSON.parse(event.body || '{}')

  const queries = {
    church: `
      [out:json][timeout:25];
      (
        node["amenity"="place_of_worship"]["religion"="christian"](around:${radius},${lat},${lng});
        way["amenity"="place_of_worship"]["religion"="christian"](around:${radius},${lat},${lng});
      );
      out center 20;
    `,
    starbucks: `
      [out:json][timeout:25];
      (
        node["name"~"Starbucks",i](around:${radius},${lat},${lng});
        way["name"~"Starbucks",i](around:${radius},${lat},${lng});
      );
      out center 10;
    `,
    ihop: `
      [out:json][timeout:25];
      (
        node["name"~"IHOP",i](around:${radius},${lat},${lng});
        way["name"~"IHOP",i](around:${radius},${lat},${lng});
      );
      out center 10;
    `,
    panera: `
      [out:json][timeout:25];
      (
        node["name"~"Panera",i](around:${radius},${lat},${lng});
        way["name"~"Panera",i](around:${radius},${lat},${lng});
      );
      out center 10;
    `,
    park: `
      [out:json][timeout:25];
      (
        node["leisure"="park"](around:${radius},${lat},${lng});
        way["leisure"="park"](around:${radius},${lat},${lng});
      );
      out center 15;
    `,
    library: `
      [out:json][timeout:25];
      (
        node["amenity"="library"](around:${radius},${lat},${lng});
        way["amenity"="library"](around:${radius},${lat},${lng});
      );
      out center 10;
    `
  }

  const query = queries[type]
  if (!query) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid type' }) }

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(query)
    })

    const data = await response.json()

    const places = data.elements.map(el => ({
      id: el.id,
      name: el.tags?.name || 'Unnamed',
      lat: el.lat || el.center?.lat,
      lng: el.lon || el.center?.lon,
      address: [el.tags?.['addr:housenumber'], el.tags?.['addr:street'], el.tags?.['addr:city']].filter(Boolean).join(' '),
      denomination: el.tags?.denomination || null
    })).filter(p => p.name !== 'Unnamed' && p.lat && p.lng)

    return {
      statusCode: 200,
      body: JSON.stringify({ places })
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}