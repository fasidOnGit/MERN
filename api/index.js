import express from 'express';
import data from '../src/data';
const router = express.Router();

const contests = data.contest.reduce((obj , cont) => {
	obj[cont.id] = cont;
	return obj;
} , {});

router.get('/contests' , (req , res) => {
	res.send({
		contests : contests
	});
});

router.get('/contest/:contestId' , (req ,res) => {
	let contest = contests[req.params.contestId];
	contest.description = 'Lorem Ipsum dolor sit amet , consectoer adipol';

	res.send(contest);
});

export default router;