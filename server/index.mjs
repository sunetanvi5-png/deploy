import { createServer } from 'node:http'

const port = Number(process.env.PORT || 4000)

const dashboard = {
  farmer: { name: 'Shri. Suresh', village: 'Nagpur, Maharashtra', language: 'मराठी' },
  stats: { activeListings: 2, offersReceived: 4, expectedEarnings: 124750, inProgress: 1 },
  prices: [
    { market: 'Nagpur APMC', modal: 4950, min: 4700, max: 5100, arrivals: 320, distanceKm: 12, grade: 'Grade A', trend: 'up' },
    { market: 'Hingna Market', modal: 5080, min: 4850, max: 5200, arrivals: 180, distanceKm: 18, grade: 'Grade A', trend: 'up', bestNet: true },
    { market: 'Kalmeshwar Mandi', modal: 4880, min: 4600, max: 5000, arrivals: 240, distanceKm: 31, grade: 'Grade B', trend: 'down' },
  ],
  listings: [
    { id: 'soy-001', crop: 'Soybean', grade: 'Grade A', quantity: 25, unit: 'quintals', available: '30 Aug', bestOffer: 5120, offers: 3, status: 'active' },
    { id: 'wheat-001', crop: 'Wheat', grade: 'Grade A', quantity: 8, unit: 'quintals', available: 'now', bestOffer: 2430, offers: 1, status: 'active' },
  ],
  offers: [
    { id: 'offer-001', buyer: 'AgroFresh Foods', initials: 'AG', listingId: 'soy-001', crop: 'Soybean', quantity: 25, price: 5120, verified: true, paymentTerms: 'Within 24 hours' },
    { id: 'offer-002', buyer: 'Vidarbha Grains', initials: 'VB', listingId: 'soy-001', crop: 'Soybean', quantity: 40, price: 5050, verified: true, paymentTerms: 'On delivery' },
  ],
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  response.end(JSON.stringify(data))
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}) } catch { reject(new Error('Invalid JSON body')) }
    })
    request.on('error', reject)
  })
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return sendJson(response, 204, {})
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)

  if (request.method === 'GET' && url.pathname === '/api/health') return sendJson(response, 200, { ok: true, service: 'kisansetu-api', timestamp: new Date().toISOString() })
  if (request.method === 'GET' && url.pathname === '/api/dashboard') return sendJson(response, 200, { ...dashboard, updatedAt: new Date().toISOString(), source: 'Agmarknet demo feed' })
  if (request.method === 'GET' && url.pathname === '/api/prices') {
    const crop = url.searchParams.get('crop') || 'Soybean'
    return sendJson(response, 200, { crop, updatedAt: new Date().toISOString(), source: 'Agmarknet demo feed', prices: dashboard.prices })
  }
  if (request.method === 'GET' && url.pathname === '/api/offers') return sendJson(response, 200, { offers: dashboard.offers })
  if (request.method === 'GET' && url.pathname === '/api/listings') return sendJson(response, 200, { listings: dashboard.listings })
  if (request.method === 'POST' && url.pathname === '/api/calculate-net') {
    try {
      const body = await readBody(request)
      const quantity = Number(body.quantity || 0)
      const sellingPrice = Number(body.sellingPrice || 0)
      const expenses = ['transportCost', 'loadingCost', 'marketFees', 'commission', 'packagingCost', 'expectedWastage']
        .reduce((total, key) => total + Number(body[key] || 0), 0)
      return sendJson(response, 200, { quantity, grossIncome: quantity * sellingPrice, expenses, netIncome: quantity * sellingPrice - expenses })
    } catch (error) {
      return sendJson(response, 400, { error: error.message })
    }
  }

  return sendJson(response, 404, { error: 'Route not found' })
})

server.listen(port, () => {
  console.log(`KisanSetu API running at http://localhost:${port}`)
  console.log('Health check: GET /api/health')
})
