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
				currentContestId: contest._id,
				contests : {
					...this.state.contests,
					[contest._id]:contest
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
	addName = (newName, contestId) => {
		api.addName(newName , contestId).then(resp => {
			this.setState({
				contests : {
					...this.state.contests,
					[resp.updatedContest._id] : resp.updatedContest,
					names: {
						...this.state.names,
						[resp.newName_id]: resp.newName
					}
				}
			})
		}).catch(console.error);
	}
	currentContent(){
		return this.state.contests[this.state.currentContestId];
	}

	pageHeader(){
		if(this.state.currentContestId){
			return this.currentContent().contestName;
		}
		return 'Naming Contest';
	}
	fetchNames = (nameIds) => {
		if(nameIds.length == 0) {
			return;
		}
		api.fetchNames(nameIds).then(names => {
			this.setState({
				names
			})
		})
	}
	lookupName = (nameId) =>{
		console.log(this.state)
		if(!this.state.names || !this.state.names[nameId]) return {name: '...'};
		return this.state.names[nameId]
	}
	currentContest() {
		if(this.state.currentContestId){
			return <Contest 
				fetchNames = {this.fetchNames} 
				contestListClick={this.fetchContestList}
				lookupName={this.lookupName}
				addName = {this.addName}
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