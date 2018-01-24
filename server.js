import config from './config';
import express from 'express';
import apiRouter from './api';
import util from 'util';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import serverRender from  './serverRender';
const app = express();

app.use(sassMiddleware({
	src: path.join(__dirname, 'sass'),
	dest: path.join(__dirname , 'public')
}));

app.set('view engine' , 'ejs');

app.get(['/' , '/contest/:contestId'], (req , res) => {
	serverRender(req.params.contestId)
		.then(({initialMarkup , initialData}) => {
			res.render('index' , {
				initialMarkup,
				initialData
			});
		
		})
		.catch( err => {
			console.error(err.message || err);
			res.send('Error in Server Render')
		});
});
app.use(express.static('public'));
app.use('/api' , apiRouter);

app.listen(config.port ,config.host, () => util.log('Express is listening on port ' , config.port));
