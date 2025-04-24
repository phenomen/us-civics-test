import type { PageLoad } from './$types';

import questions from '$lib/questions.json';

type Question = {
	n: number;
	q: string;
	a: string[];
};

export const load: PageLoad = ({ params }) => {
	return {
		questions: questions as Question[]
	};
};
