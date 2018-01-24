import React , {Component} from 'react';
import Header from './Header';
import ContestList from './ContestList';
import PropTypes from 'prop-types';
import Contest from './Contest';
import * as api from '../api';



const pushState = (obj , url) =>
	window.history.pushState(obj , '' , url);
const onPopeState = handler => {
	window.onpopstate = handler;
}
class App extends Component {
	static propTypes = {
		initialData : PropTypes.object.isRequired
	}
	state=this.props.initialData;
	componentDidMount(){
		onPopeState((event) => {
			this.setState({
				currentContestId : (event.state || {}).currentContestId
			});
		});
	}
	componentWillUnmount(){
		onPopeState(null);
	}
	fetchContest = (contestId) => {
		pushState(
			{currentContestId: contestId},
			`/contest/${contestId}`
		);

		api.fetchContest(contestId).then(contest => {
			this.setState({
				currentContestId: contest.id,
				contests : {
					...this.state.contests,
					[contest.id]:contest
				}
			});
		});


	};
	fetchContestList = () => {
		pushState(
			{currentContestId: null},
			'/'
		);

		api.fetchContestList().then(contests => {
			this.setState({
				currentContestId: null,
				contests
			});
		});


	};
	currentContent(){
		return this.state.contests[this.state.currentContestId];
	}

	pageHeader(){
		if(this.state.currentContestId){
			return this.currentContent().contestName;
		}
		return 'Naming Contest';
	}
	currentContest() {
		if(this.state.currentContestId){
			return <Contest 
				contestListClick={this.fetchContestList}
				{...this.currentContent()}/>;
		}
		return <ContestList 
			onContestClick={this.fetchContest}
			contest={this.state.contests} />;
	}
	render(){
    	return (
    		<div className="App">
    			<Header message={this.pageHeader()}/>
    			{this.currentContest()}
    		</div>
    	);
	}
}



App.defaultProps = {
	headerMessages: 'Hello'
};



export default App;