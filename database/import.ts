import { client } from '../utils/db'
import XLSX from 'xlsx'
import { hashPassword } from '../utils/hash'

// console.log(process.env);

// interface User {
// 	username: string
// 	password: string
// }

// interface Memo {
// 	content: string
// 	image: string
// }
async function main() {
	// await client.connect() // "dial-in" to the postgres server
	await client.query(`truncate USERS restart identity CASCADE`)
	await client.query(`truncate ROUTES restart identity CASCADE`)
	await client.query(`truncate ATTRACTIONS restart identity CASCADE`)
	await client.query(`truncate STATIONS restart identity CASCADE`)
	await client.query(`truncate DISTRICTS restart identity CASCADE`)
	await client.query(`truncate route_points restart identity CASCADE`)
	await client.query(`truncate routes_attractions restart identity CASCADE`)
	await client.query(`truncate attraction_likes restart identity CASCADE`)
	await client.query(`truncate route_comments restart identity CASCADE`)
	let workbook = XLSX.readFile('./database/travel_route_website.xlsx')
	let users: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['users'])
	let routes: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['routes'])
	let attractions: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['attractions'])
	let stations: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['stations'])
	let districts: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['districts'])
	let route_points: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['route_points'])
	let routes_attractions: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['routes_attractions'])
	let attraction_likes: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['attraction_likes'])
	let route_likes: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['route_likes'])
	let route_comments: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['route_comments'])
	let attraction_comments: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['attraction_comments'])

	// const user = {
	//     username: "gordon",
	//     password: "tecky",
	// };

	for (let user of users) {
		// DANGER :  sql injection!!!
		// await client.query("INSERT INTO users (username,password) values ('" + "'',''); table memos; --" + "'  ,'tecky')");
		// await client.query(`INSERT INTO users (username,password) values ('${user.username}','${user.password}')`);

		let hashedPassword = await hashPassword(user.password)

		await client.query(
			'INSERT INTO users (username, useremail, password, image, created_at, updated_at) values ($1,$2, $3,$4, NOW(), NOW())',
			[user.username, user.useremail, hashedPassword, user.image]
		)

	}
	for (let route of routes) {
		await client.query('INSERT INTO routes (name,start_station_id,end_station_id,image,description,distance,duration,difficulty,popularity,created_at,updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())', [
			route.name,
			route.start_station_id,
			route.end_station_id,
			route.image,
			route.description,
			route.distance,
			route.duration,
			route.difficulty,
			route.popularity
		])
	}
	for (let attraction of attractions) {
		await client.query('INSERT INTO attractions (name,image,description,position,star,created_at,updated_at) values ($1,$2,$3,$4,$5,NOW(),NOW())', [
			attraction.name,
			attraction.image,
			attraction.description,
			attraction.position,
			attraction.star
		])
	}
	for (let station of stations) {
		await client.query('INSERT INTO stations (name,district,image,position,created_at,updated_at) values ($1,$2,$3,$4,NOW(),NOW())', [
			station.name,
			station.district,
			station.image,
			station.position
		])
	}
	for (let district of districts) {
		await client.query('INSERT INTO districts (name,created_at,updated_at) values ($1,NOW(),NOW())', [
			district.name
		])
	}
	for (let route_point of route_points) {
		await client.query('INSERT INTO route_points (route_id,position,order_index,created_at,updated_at) values ($1,$2,$3,NOW(),NOW())', [
			route_point.route_id,
			route_point.position,
			route_point.order_index
		])
	}
	for (let route_attraction of routes_attractions) {
		await client.query('INSERT INTO routes_attractions (route_id,attraction_id,created_at,updated_at) values ($1,$2,NOW(),NOW())', [
			route_attraction.route_id,
			route_attraction.attraction_id
		])
	}
	for (let attraction_like of attraction_likes) {
		await client.query('INSERT INTO attraction_likes (user_id,attraction_id,created_at,updated_at) values ($1,$2,NOW(),NOW())', [
			attraction_like.user_id,
			attraction_like.attraction_id
		])
	}
	for (let route_like of route_likes) {
		await client.query('INSERT INTO route_likes (user_id,route_id,created_at,updated_at) values ($1,$2,NOW(),NOW())', [
			route_like.user_id,
			route_like.route_id
		])
	}
	for (let route_comment of route_comments) {
		await client.query('INSERT INTO route_comments (comment,user_id,route_id,created_at,updated_at) values ($1,$2,$3,NOW(),NOW())', [
			route_comment.comment,
			route_comment.user_id,
			route_comment.route_id
		])
	}
	for (let attraction_comment of attraction_comments) {
		await client.query('INSERT INTO attraction_comments (comment,user_id,attraction_id,created_at,updated_at) values ($1,$2,$3,NOW(),NOW())', [
			attraction_comment.comment,
			attraction_comment.user_id,
			attraction_comment.attraction_id
		])
	}

	const result = await client.query('SELECT * from attractions')

	console.log(result.rows)

	// insert data into likes table
	// await client.query(
	// 	'INSERT INTO likes (user_id,attraction_id) values ($1,$2),($3,$4)',
	// 	[1, 1, 1, 2]
	// )

	// console.log(result.rows[0].username); // gordon

	await client.end() // close connection with the database
}
main()
