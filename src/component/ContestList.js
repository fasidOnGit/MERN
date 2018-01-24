import React from 'react';
import PropTypes from 'prop-types';
import ContestPreview from './ContestPreview';
const ContestList = ({contest , onContestClick}) => { 
	return (
		<div className="ContestList">
			{Object.keys(contest).map(eachId => 
				<ContestPreview
					onClick={onContestClick}
					key={eachId} {...contest[eachId]} />
				
			)}
		</div>
	);
};
ContestList.propTypes ={
	contest : PropTypes.object,
	onContestClick: PropTypes.func.isRequired
};


export default ContestList;