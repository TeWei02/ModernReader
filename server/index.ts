import cors from 'cors'
import express from 'express'
import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'
import aiRoutes from './ai/routes.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)
const isDev = process.env.NODE_ENV === 'development'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'modernreader-ai-server', mode: 'mock' })
})

app.use('/api/ai', aiRoutes)

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : 'Unknown server error'
    res.status(500).json({ error: message })
})

if (isDev) {
    // Development: try to use HTTPS with auto-generated certs (via mkcert)
    const certDir = path.resolve(__dirname, '../.certs')
    const certPath = path.join(certDir, 'localhost.pem')
    const keyPath = path.join(certDir, 'localhost-key.pem')

    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        const options = {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
        }
        https.createServer(options, app).listen(port, () => {
            console.log(`[AI Server] Running at https://localhost:${port} (HTTPS)`)
        })
    } else {
        // Fallback to HTTP if certs not found
        app.listen(port, () => {
            console.log(`[AI Server] Running at http://localhost:${port} (HTTP - cert not found)`)
        })
    }
} else {
    // Production: rely on reverse proxy (Vercel, etc.) to handle HTTPS
    app.listen(port, () => {
        console.log(`[AI Server] Running at http://localhost:${port}`)
    })
}
