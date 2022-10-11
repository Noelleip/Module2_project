import express from "express";
import { client } from "../utils/db";
import { isLoggedin } from '../utils/guard'
export const routeRoutes = express.Router();

routeRoutes.get("/", async (req, res) => {
    try {
        if (req.session.user?.loggedIn) {
            let routes = (await client.query(/*sql*/
                `SELECT * FROM (
                    SELECT routes.*,count(*) OVER (PARTITION BY routes.id) as count,
                    users.id as liked_user_id
                    FROM routes
                    LEFT JOIN route_likes ON route_likes.route_id = routes.id
                    LEFT JOIN users ON users.id = route_likes.user_id
                    WHERE users.id = 1 OR users.id IS Null
                    ORDER BY routes.id ASC
                    ) tbl
                WHERE liked_user_id = ($1) or count = 1`, [req.session.user.userId]))
                .rows;
            return res.status(200).json({ routes });
        } else {
            let routes = (await client.query(/*sql*/
                `Select *FROM routes`))
                .rows;
            return res.status(200).json({ routes });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});

routeRoutes.get("/:routeId", async (req, res) => {

    let routeId: any = req.params.routeId;
    // let attraction = req.query.attraction;

    // console.log(routeId);
    // console.log(attraction);
    try {
        let route = (await client.query(/*sql*/ `Select * from routes where id = ($1)`, [routeId]))
            .rows[0];
        return res.status(200).json({ route });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});

routeRoutes.get("/:routeId/attractions", async (req, res) => {

    let routeId: any = req.params.routeId;
    // let attraction = req.query.attraction;

    // console.log("/:routeId/attractions: ", routeId);
    // console.log(attraction);
    try {
        if (req.session.user?.loggedIn) {
            let attractions = (await client.query(/*sql*/
                `SELECT * FROM (
                    SELECT attractions.*, count(*) over(partition by attractions.id) as count,
                            users.id as liked_user_id FROM attractions 
                            INNER JOIN routes_attractions 
                                ON attractions.id = routes_attractions.attraction_id
                            INNER JOIN routes 
                                ON routes.id = routes_attractions.route_id
                            LEFT JOIN attraction_likes
                                ON attraction_likes.attraction_id = attractions.id
                            LEFT JOIN users
                                ON users.id = attraction_likes.user_id
                            WHERE routes.id =($1)
                            ORDER BY attractions.id ASC
                    ) tbl
                WHERE liked_user_id = ($2) OR count = 1`, [routeId, req.session.user.userId]))
                .rows;
            return res.status(200).json({ attractions: attractions });
        } else {
            let attractions = (await client.query(/*sql*/
                `SELECT attractions.*FROM attractions 
            INNER JOIN routes_attractions 
                ON attractions.id = routes_attractions.attraction_id
            INNER JOIN routes 
                ON routes.id = routes_attractions.route_id
            WHERE routes.id = ($1) 
            ORDER BY attractions.id ASC`, [routeId]))
                .rows;
            return res.status(200).json({ attractions: attractions });
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});

routeRoutes.get("/:routeId/start_end", async (req, res) => {

    let routeId: any = req.params.routeId;
    // let attraction = req.query.attraction;

    // console.log(routeId);
    // console.log(attraction);
    try {
        let startPoint = (await client.query(/*sql*/
            `SELECT stations.name,stations.district,stations.image,position FROM routes 
                INNER JOIN stations 
                ON routes.start_station_id = stations.id
                WHERE routes.id = ($1)`, [routeId]))
            .rows;
        let endPoint = (await client.query(/*sql*/
            `SELECT stations.name,stations.district,stations.image,position FROM routes 
                INNER JOIN stations 
                ON routes.end_station_id = stations.id
                WHERE routes.id = ($1)`, [routeId]))
            .rows;
        return res.status(200).json({
            startPoint: startPoint,
            endPoint: endPoint
        });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: err });
    }

});

// routeRoutes.get("/savepath", async (req, res) => {

//     try {
//         let path = (await client.query(/*sql*/ `Select * from attractions`))
//             .rows;
//         return res.status(200).json({ message: "updated path point" });
//     } catch (err) {
//         console.log(err);
//         return res.status(401).json({ message: err });
//     }
// });

routeRoutes.put(
    '/like',
    isLoggedin,
    async (req, res) => {
        console.log(req.body);

        let routeId = req.body.routeId
        console.log(routeId);

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
            let userLikeStatus = await client.query(/*sql*/`SELECT * FROM route_likes WHERE user_id=($1) AND route_id=($2)`,
                [userId, routeId]);
            // console.log(userLikeStatus.rows);

            if (userLikeStatus.rowCount > 0) {
                await client.query(/*sql*/`DELETE FROM route_likes WHERE user_id=($1) AND route_id=($2)`,
                    [userId, routeId]);
            } else {
                await client.query(/*sql*/`INSERT INTO route_likes (user_id, route_id) VALUES ($1,$2)`,
                    [userId, routeId]);
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

