import express from 'express'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
import { Request, Response } from 'express'
import expressSession from 'express-session'
import formidable from 'formidable'
import { grantExpress } from './oauth'
import { userRoutes } from './routes/userRoutes'
import { routeRoutes } from './routes/routeRoutes'
import { attractionRoutes } from './routes/attractionRoutes'
import { routeDetailRoutes } from './routes/routeDetailRoutes'
import fs from 'fs'
import { env } from './utils/env'
// import { userRoutes } from './routes/userRoute'
// import path from 'path'

const app = express()
const server = new http.Server(app)
export const io = new SocketIO(server)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
    expressSession({
        secret: env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
)
app.use(grantExpress as express.RequestHandler);

declare module 'express-session' {
    interface SessionData {
        user?: {
            loggedIn?: boolean
            username?: string
            useremail?: string
            password?: string
            userId?: number
            userimage?: string
        }
        grant?: any
    }
}


const uploadDir = './public/profile_img'
fs.mkdirSync(uploadDir, { recursive: true })

export const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB

    filter: (part: any) => {
        if (part && part.mimetype) {
            // console.log(part)
            const type = part.mimetype
            if (type.startsWith('image/')) {
                return true
            }
        }
        return false
    },
    // filter: part => part.mimetype?.startsWith('image/') || false,
    filename: (originalName: any, originalExt: any, part: any, form: any) => {
        let ext = part.mimetype?.split('/').pop()
        let timestamp = Date.now()
        return `${originalName}-${timestamp}.${ext}`
    }
})

app.use(function (req: Request, res: Response, next) {
    let date = new Date()
    let dateString = date.toLocaleDateString()
    let timeString = date.toLocaleTimeString()
    console.log(`[${dateString} ${timeString}] Request: ${req.path} ${req.method}`)
    // console.log(` Request session: `, req.session);

    next()
})

app.get('/search', function (req: Request, res: Response) {
    res.redirect('search.html')
})

app.get('/login', function (req: Request, res: Response) {
    res.redirect('login.html')
})

app.get('/register', function (req: Request, res: Response) {
    res.redirect('register.html')
})

app.get('/googlemap', function (req: Request, res: Response) {
    res.redirect('google_map.html')
})

app.get('/detail', function (req: Request, res: Response) {
    res.redirect('detail.html')
})

app.use('/user', userRoutes)
app.use('/route', routeRoutes)
app.use('/attraction', attractionRoutes)
app.use('/route_detail', routeDetailRoutes)
app.use(express.static("public"))
app.use(express.static("public/attractions_img"))
app.use(express.static("public/routes_img"))
app.use(express.static("public/stations_img"))

//io server initiated
io.on('connection', function (socket) {
    console.log(`New socket client connected to us: ${socket.id}`)
    io.emit('new-socket-connected', socket.id)
})

const PORT = 8080

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`)
})