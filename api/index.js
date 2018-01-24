import express from 'express';
import { MongoClient , ObjectID } from 'mongodb';
import assert from 'assert';
import config from '../config';

var mdb;

MongoClient.connect(config.mongodbUri , (err , client) => {
	assert.equal(null , err);

	mdb = client.db(config.dbName);
	console.info("Connected to DB Successfully")
});
const router = express.Router();

router.get('/contests' , (req , res) => {
	let contests = {};
	mdb.collection('contests').find({})
		.project({
			categoryName:1,
			contestName:1
		})
		.each((err , contest)=> {
			assert.equal(null , err);
			if(!contest){
				res.send({contests});
				return;
			}
			contests[contest._id] = contest;

		})
});

router.get('/contest/:contestId' , (req ,res) => {
	mdb.collection('contests').findOne({
		_id:ObjectID(req.params.contestId)
	})
	.then(contest => res.send(contest))
	.catch(err => {
		console.error(err.message);
		res.send("Freaked out!!")
	});

});

router.get('/names/:nameIds' , (req , res) => {
	const nameIds = req.params.nameIds.split(',').map(ObjectID);
	let names = {};
	mdb.collection('names').find({_id : { $in:nameIds }})
		.each((err , name)=> {
			assert.equal(null , err);
			if(!name){
				res.send({names});
				return;
			}
			names[name._id] = name;

		})
});

router.post('/names' , (req ,res) => {
	const contestId = ObjectID(req.body.contestId);
	const name = req.body.newName;
	mdb.collection('names').insertOne({name}).then(result => {
		 mdb.collection('contests').findAndModify(
			{_id: contestId},
			[],
			{$push: { nameIds: result.insertedId}} ,
			{new : true}
		).then(doc => {
			res.send({
				updatedContest : doc.value,
				newName : { _id: result.insertedId, name}
			});
		})
	}).catch(err => {
		console.error(err);
		res.status(500).send(err.message);
	})

});

export default router;