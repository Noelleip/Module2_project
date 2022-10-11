import express from 'express'

export const isLoggedin = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session['user'] && req.session['user'].username) {
		next()
		return
	}
	res.status(401).send('Please login first')
	return
}