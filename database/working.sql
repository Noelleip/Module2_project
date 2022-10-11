SELECT *
FROM attractions
    INNER JOIN routes_attractions ON attractions.id = routes_attractions.attraction_id
    INNER JOIN routes ON routes.id = routes_attractions.route_id
WHERE routes.id = 1;
select *
from routes;
await client.query(
    'INSERT INTO routes_attractions (route_id,attraction_id,created_at,updated_at) values ($1,$2,NOW(),NOW())',
    [
			route_attraction.route_id,
			route_attraction.attraction_id
		]
)
INSERT INTO route_points (route_id, attraction_id, created_at, updated_at)
values ($1, $2, NOW(), NOW())
SELECT stations.name,
    position
FROM routes
    INNER JOIN stations ON routes.start_station_id = stations.id
WHERE routes.id = 1;
SELECT stations.name,
    position
FROM routes
    INNER JOIN stations ON routes.end_station_id = stations.id
WHERE routes.id = 1;
select *
from attractions;
SELECT attractions.*,
    users.id as liked_user_id
FROM attractions
    INNER JOIN routes_attractions ON attractions.id = routes_attractions.attraction_id
    INNER JOIN routes ON routes.id = routes_attractions.route_id
    INNER JOIN attraction_likes ON attraction_likes.attraction_id = attractions.id
    INNER JOIN users ON users.id = attraction_likes.user_id
WHERE routes.id = 1;
SELECT attractions.*,
    users.id as liked_user_id
FROM attractions
    INNER JOIN routes_attractions ON attractions.id = routes_attractions.attraction_id
    INNER JOIN routes ON routes.id = routes_attractions.route_id
    left JOIN attraction_likes ON attraction_likes.attraction_id = attractions.id
    left JOIN users ON users.id = attraction_likes.user_id
WHERE routes.id = 1;
SELECT attractions.*
FROM attractions
    INNER JOIN routes_attractions ON attractions.id = routes_attractions.attraction_id
    INNER JOIN routes ON routes.id = routes_attractions.route_id
WHERE routes.id = 1;
SELECT attractions.*,
    users.id as liked_user_id
FROM attractions
    LEFT JOIN attraction_likes ON attraction_likes.attraction_id = attractions.id
    LEFT JOIN users ON users.id = attraction_likes.user_id
ORDER BY attractions.id ASC;
Select routes.*,
    users.id as liked_user_id
FROM routes
    LEFT JOIN route_likes ON route_likes.route_id = routes.id
    LEFT JOIN users ON users.id = route_likes.user_id
ORDER BY routes.id ASC
SELECT routes.*,
    users.id as liked_user_id
FROM routes
    INNER JOIN routes_attractions ON routes.id = routes_attractions.route_id
    INNER JOIN attractions ON attractions.id = routes_attractions.attraction_id
    left JOIN attraction_likes ON attraction_likes.attraction_id = attractions.id
    left JOIN users ON users.id = attraction_likes.user_id
WHERE attractions.id = 1
SELECT routes.*,
    users.id as liked_user_id
FROM routes
    INNER JOIN routes_attractions ON routes.id = routes_attractions.route_id
    INNER JOIN attractions ON attractions.id = routes_attractions.attraction_id
    left JOIN route_likes ON route_likes.route_id = routes.id
    left JOIN users ON users.id = route_likes.user_id