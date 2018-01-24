import axios from 'axios';

export const fetchContest = contestId => {
	return axios.get(`/api/contest/${contestId}`)
		.then(resp => resp.data);
};
export const fetchContestList = () => {
	return axios.get(`/api/contests`)
		.then(resp => resp.data.contests);
};