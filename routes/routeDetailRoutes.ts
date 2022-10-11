import express from "express";
import { client } from "../utils/db";
import { form } from '../main';
import { isLoggedin } from "../utils/guard";
import { io } from '../main'
export const routeDetailRoutes = express.Router();


routeDetailRoutes.get("/", async (req, res) => {

    let routeId: any = req.query.route;

    try {
        if (routeId) {
            let comment = (await client.query(/*sql*/ `
            Select routes.image as route_image, routes.name, users.username, users.image as user_image, route_comments.created_at, route_comments.comment from route_comments 
            INNER JOIN routes
            ON route_comments.route_id = routes.id
            INNER JOIN users 
            ON users.id = route_comments.user_id where routes.id = ($1)`, [routeId]))
                .rows[0];
            return res.status(200).json({ comment: comment });
        } else {
            let comments = (await client.query(/*sql*/ `
            Select routes.image as route_image, routes.name, users.username, users.image as user_image, route_comments.created_at, route_comments.comment from route_comments 
            INNER JOIN routes
            ON route_comments.route_id = routes.id
            INNER JOIN users 
            ON users.id = route_comments.user_id`))
                .rows;
            return res.status(200).json({ comments: comments });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }
});

routeDetailRoutes.get("/:routeId/comments", async (req: express.Request, res: express.Response) => {
    let routeId: any = req.params.routeId;
    try {
        let comments = (await client.query(/*sql*/
            `Select routes.image as route_image, routes.name, users.username, users.image as user_image, route_comments.created_at, route_comments.comment from route_comments 
        INNER JOIN routes
        ON route_comments.route_id = routes.id
        INNER JOIN users 
        ON users.id = route_comments.user_id where route_comments.route_id = ($1) ORDER by route_comments.created_at` , [routeId]))
            .rows;
        return res.status(200).json({ comments: comments });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }
})

routeDetailRoutes.get("/comments", async (req: express.Request, res: express.Response) => {

    // let comments: any = req.body.comments;
    try {
        let comments = (await client.query(/*sql*/
            `Select routes.image as route_image, routes.name as route_name, users.username, users.image as user_image, route_comments.created_at, route_comments.comment from route_comments 
        INNER JOIN routes
        ON route_comments.route_id = routes.id
        INNER JOIN users 
        ON users.id = route_comments.user_id `))
            .rows;


        return res.status(200).json({ comments: comments });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }
})

routeDetailRoutes.get("/comments/random", async (req: express.Request, res: express.Response) => {

    // let comments: any = req.body.comments;
    try {
        let comments = (await client.query(/*sql*/
            `Select routes.image as route_image, routes.name as route_name, users.username, users.image as user_image, route_comments.created_at, route_comments.comment from route_comments 
            INNER JOIN routes
            ON route_comments.route_id = routes.id
            INNER JOIN users 
            ON users.id = route_comments.user_id
            ORDER BY RANDOM ()
            LIMIT 2; `))
            .rows;


        return res.status(200).json({ comments: comments });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }
})


routeDetailRoutes.post("/:routeId/comments", isLoggedin, async (req: express.Request, res: express.Response) => {
    try {
        form.parse(req, async (err, fields, files) => {
            let userId = req.session.user?.userId;
            let comment = fields.comment
            let routeId = req.params.routeId;

            if (!comment) {
                res.status(400).json({
                    message: 'Please input your comment'
                })
                return
            }
            // let userId = (await client.query(/*sql*/`Select id from users where username = ($1)`, [`${username}`])).rows[0].id
            // let routeId = (await client.query(/*sql*/`select id from routes where name =($1)`, [`${route}`])).rows[0].id
            console.log(userId)
            console.log(routeId)
            let routeResult = (await client.query(/*sql*/`Insert into route_comments (comment, user_id,route_id) values ($1,$2,$3)`, [comment, userId, routeId]))
            console.log(routeResult)

            io.emit('new-comment on memo in detail.html')
            io.emit('new-comment on detail.html')
            io.emit('new-comment on index.html')

            res.status(200).json({ userId: userId, comment: comment, routeId: routeId })
        })
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Your comment HAS NOT submitted yet" })
    }
})

