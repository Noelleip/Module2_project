import express from "express";
import { client } from "../utils/db";
import { isLoggedin } from '../utils/guard'
export const attractionRoutes = express.Router();

attractionRoutes.get("/", async (req, res) => {

    try {
        if (req.session.user?.loggedIn) {
            // if(req.session.user?.loggedIn){
            let attractions = (await client.query(/*sql*/
                `SELECT attractions.*,
                    users.id as liked_user_id
                    FROM attractions
                    LEFT JOIN attraction_likes ON attraction_likes.attraction_id = attractions.id
                    LEFT JOIN users ON users.id = attraction_likes.user_id
                    WHERE users.id = ($1) OR users.id IS Null
                    ORDER BY attractions.id ASC`, [req.session.user.userId]))
                .rows;
            return res.status(200).json({ attractions: attractions });
            // }
        } else {
            let attractions = (await client.query(/*sql*/
                `SELECT * FROM attractions`))
                .rows;
            return res.status(200).json({ attractions: attractions });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});

attractionRoutes.get("/:attractionId", async (req, res) => {

    let attractionId: any = req.params.attractionId;

    try {
        let attraction = (await client.query(/*sql*/ `Select * from attractions where id = ($1)`, [attractionId]))
            .rows[0];
        return res.status(200).json({ attraction: attraction });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});


attractionRoutes.get("/:attractionId/routes", async (req, res) => {

    let attractionId: any = req.params.attractionId;

    // console.log(attractionId);
    // console.log(route);
    try {
        if (req.session.user?.loggedIn) {
            let routes = (await client.query(/*sql*/
                `SELECT * FROM (
                    SELECT routes.*, count(*) over(partition by routes.id) as count,
                    users.id as liked_user_id
                    FROM routes
                    INNER JOIN routes_attractions ON routes.id = routes_attractions.route_id
                    INNER JOIN attractions ON attractions.id = routes_attractions.attraction_id
                    left JOIN route_likes ON route_likes.route_id = routes.id
                    left JOIN users ON users.id = route_likes.user_id
                    WHERE attractions.id = ($1)
                    ORDER BY routes.id ASC
                ) tbl
                WHERE liked_user_id = ($2) OR count = 1`, [attractionId, req.session.user.userId]))
                .rows;
            return res.status(200).json({ routes: routes });
        } else {
            let routes = (await client.query(/*sql*/
                `SELECT routes.*
                FROM routes
                INNER JOIN routes_attractions ON routes.id = routes_attractions.route_id
                INNER JOIN attractions ON attractions.id = routes_attractions.attraction_id
                WHERE attractions.id = ($1)
                ORDER BY routes.id ASC`, [attractionId]))
                .rows;
            return res.status(200).json({ routes: routes });
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});


attractionRoutes.put(
    '/like',
    isLoggedin,
    async (req, res) => {
        console.log(req.body);

        let attractionId = req.body.attractionId;
        console.log(attractionId);

        // let count = req.body.count;
        // let username = req.session.username
        let userId
        if (req.session.user) {
            userId = req.session.user.userId
        }
        console.log(userId);
        // console.log(count);
        try {
            // const data = await jsonfile.readFile(
            // 	path.join('public', 'memos.json')
            // )
            // console.log(data[index]);
            // console.log(data[index].liked_usernames.includes(username));
            let userLikeStatus = await client.query(/*sql*/`SELECT * FROM attraction_likes WHERE user_id=($1) AND attraction_id=($2)`,
                [userId, attractionId]);
            // console.log(userLikeStatus.rows);

            if (userLikeStatus.rowCount > 0) {
                await client.query(/*sql*/`DELETE FROM attraction_likes WHERE user_id=($1) AND attraction_id=($2)`,
                    [userId, attractionId]);
            } else {
                await client.query(/*sql*/`INSERT INTO attraction_likes (user_id, attraction_id) VALUES ($1,$2)`,
                    [userId, attractionId]);
            }
            // let memoLikedStatus = await client.query(/*sql*/`SELECT * FROM likes WHERE route_id=($1)`,
            // 	[routeId]);
            // // console.log(memoLikedStatus.rows);
            // await client.query(/*sql*/`Update memos set count=($1) WHERE id=($2)`,
            // 	[memoLikedStatus.rowCount, routeId]);

            res.status(200).json({ likeUpdated: true })
            // res.status(200).json(data);
        } catch (err: any) {
            res.status(400).send("Like Memo Error: " + err.message)
            console.log(err.message)
        }
    }
)


