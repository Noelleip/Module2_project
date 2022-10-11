import express, { Request, Response } from 'express';
import { form } from '../main';
import { client } from '../utils/db'
import { checkPassword, hashPassword } from '../utils/hash';
import fetch from 'cross-fetch';
import crypto from 'crypto';
// import passport from 'passport';

export const userRoutes = express.Router()
userRoutes.get('/login/google', loginGoogle);
// userRoutes.get("/auth/facebook", passport.authenticate("facebook", {
//     scope: ['email', 'user_about_me']
// }))
// userRoutes.get(
//     "/auth/facebook/callback",
//     passport.authenticate("facebook", { successRedirect: "/login", failureRedirect: "/" }),
//     function (req, res) {
//         console.log("req", req.user)
//         res.render("data", {
//             user: req.user,
//         })
//     }
// )



userRoutes.get('/me', (req, res) => {

    if (!req.session['user']) {
        res.status(403).json({
            message: '403 forbidden'
        })
    } else {
        res.json({
            message: 'Success retrieve user',
            data: {
                user: req.session['user'] ? req.session['user'] : null
            }
        })
    }

})

userRoutes.get('/image', (req, res) => {
    const image = req.session.user?.userimage
    if (!req.session['user']) {
        res.status(403).json({
            message: '403 forbidden'
        })
    } else {
        res.status(200).json({ image: image })
    }
})

userRoutes.post('/login', async (req: express.Request, res: express.Response) => {

    form.parse(req, async (err: any, fields: any, files: any) => {

        const useremail = fields.useremail
        const password = fields.password

        // let password: string = fields.password
        // console.log("username: ", useremail);
        // console.log("password: ", password);

        if (!useremail || !password) {

            res.status(401).json({ message: "Incorrect email or password" })
            return
        }

        let user = (await client.query(/*sql*/`Select * from users where useremail = ($1)`, [useremail])).rows[0]
        console.log(user);

        try {
            const match = await checkPassword(password, user.password);
            // console.log(match);

            req.session.user = {}
            if (match) {
                req.session.user.loggedIn = true
                req.session.user.username = user.username
                req.session.user.useremail = user.useremail
                req.session.user.userId = user.id
                req.session.user.userimage = user.image

                // req.session.user.password = user.password;
                req.session.save()
                res.status(200).json({ message: "Login Successful", data: { user: req.session['user'] } })
                // console.log("req.session", req.session);
                return
            } else {
                // console.log("not match");

                return res.status(401).json({ message: "Incorrect useremail or password" })
            }
        } catch (err) {
            console.log(err);

            return res.status(401).json({ message: "Incorrect useremail or password" })
        }

    })
})

// userRoutes.get('/register', (req, res) => {
//     res.render("register");
// })
userRoutes.post('/register', async (req: express.Request, res: express.Response) => {
    try {
        form.parse(req, async (err, fields, files) => {
            let username = fields.username as string
            let useremail = fields.useremail as string
            let password = Array.isArray(fields.password) ? fields.password[0] : fields.password
            let userimage;
            let userimagefordata;

            if (Object.keys(files).length > 0) {
                userimage = Array.isArray(files.userimage) ? files.userimage[0] : files.userimage
                userimagefordata = userimage.newFilename
            }

            console.log("username: ", username);
            console.log("useremail:", useremail);
            console.log("password: ", password);
            // console.log("userimage: ", userimage);

            if (!username || !useremail || !password) {
                res.status(400).json({
                    message: 'Invalid username, email or password'
                })
                return
            }

            let hashedPassword = await hashPassword(password)
            let user
            if (Object.keys(files).length > 0) {
                user = await client.query(/*sql*/`Insert into users (username, useremail,password, image) values ($1,$2, $3, $4) Returning *`, [username, useremail, hashedPassword, userimagefordata])
            } else {
                user = await client.query(/*sql*/`Insert into users (username, useremail,password) values ($1,$2, $3) Returning *`, [username, useremail, hashedPassword])
            }

            req.session.user = {}
            req.session.user.loggedIn = true
            req.session.user.username = username
            req.session.user.useremail = useremail
            req.session.user.userId = user.rows[0].id
            if (Object.keys(files).length > 0) {
                req.session.user.userimage = user.rows[0].image
            }
            req.session.save()
            res.status(200).json({ message: "Register Successful", data: { user: req.session['user'] } })
        })
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Register Unsuccessful" })
    }
})


async function loginGoogle(req: express.Request, res: express.Response) {
    try {
        const accessToken = req.session?.['grant'].response.access_token;
        console.log('access token:', accessToken)
        const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: "get",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const googleProfile = await fetchRes.json();
        console.log('google result', googleProfile)
        const users = (await client.query(`SELECT * FROM users WHERE useremail = $1`, [googleProfile.email])).rows;
        let user = users[0];



        if (!user) {
            const randomString = crypto.randomBytes(32).toString('hex')
            let hashedPassword = await hashPassword(randomString);
            // Create the user when the user does not exist
            user = (await client.query(`INSERT INTO users (username,useremail,password) 
                VALUES ($1,$2,$3) RETURNING *`,
                [googleProfile.name, googleProfile.email, hashedPassword])).rows[0]
        }
        // if (req.session) {
        // req.session['user'] = googleProfile

        req.session.user = {}
        req.session.user.loggedIn = true
        req.session.user.username = googleProfile.name
        req.session.user.useremail = googleProfile.email
        req.session.user.userId = user.rows[0].id
        // }

        // res.redirect('/login')
        req.session.save()
        res.status(200).json({ message: "Register Successful", data: { user: req.session['user'] } })
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Register Unsuccessful" })
    }
}

userRoutes.get('/logout', logout)
function logout(req: Request, res: Response) {
    req.session.destroy(() => {
        console.log('user logged out')
    })
    // res.redirect('/index.html')
    res.status(200).end();
}


userRoutes.get("/:userId/liked_attractions", async (req, res) => {

    let userId: any = req.params.userId;

    try {
        let attractions = (await client.query(/*sql*/
            `SELECT attractions.*, users.id as liked_user_id FROM attractions 
            INNER JOIN routes_attractions 
                ON attractions.id = routes_attractions.attraction_id
            INNER JOIN routes 
                ON routes.id = routes_attractions.route_id
            INNER JOIN attraction_likes
                ON attraction_likes.attraction_id = attractions.id
            INNER JOIN users
                ON users.id = attraction_likes.user_id
            WHERE users.id = ($1)
            ORDER BY attractions.id ASC`, [userId]))
            .rows;
        return res.status(200).json({ attractions: attractions });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});

userRoutes.get("/:userId/liked_routes", async (req, res) => {

    let userId: any = req.params.userId;

    try {
        let routes = (await client.query(/*sql*/
            `SELECT routes.*,
            users.id as liked_user_id
            FROM routes
            INNER JOIN route_likes 
                ON route_likes.route_id = routes.id
            INNER JOIN users 
                ON users.id = route_likes.user_id
            WHERE users.id = ($1)
            ORDER BY routes.id ASC`, [userId]))
            .rows;
        return res.status(200).json({ routes: routes });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});