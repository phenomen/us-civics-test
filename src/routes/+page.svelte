<script lang="ts">
	import type { PageProps } from './$types';
	import { Button, Divider } from 'stdf';

	let { data }: PageProps = $props();

	let questions = $derived(data.questions);
	let answeredQuestions = $state<number[]>([]);
	let availableQuestions = $derived(questions.filter((q) => !answeredQuestions.includes(q.n)));

	type Question = (typeof questions)[number];

	let currentQuestion = $state<Question | null>(questions[91]);

	let correctAnswers = $state(0);
	let incorrectAnswers = $state(0);
	let answerVisible = $state(false);
	let answeredAll = $state(false);
	let testQuestionLimit = 10;

	let totalAnswers = $derived(correctAnswers + incorrectAnswers);

	function getRandomQuestion(): Question | null {
		if (totalAnswers >= testQuestionLimit || availableQuestions.length === 0) {
			answeredAll = true;
			return currentQuestion;
		}

		return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
	}

	$effect(() => {
		if (!currentQuestion) {
			currentQuestion = getRandomQuestion();
		}
	});

	function showNextQuestion(): void {
		if (currentQuestion && !answeredQuestions.includes(currentQuestion.n)) {
			answeredQuestions = [...answeredQuestions, currentQuestion.n];
		}

		answerVisible = false;
		currentQuestion = getRandomQuestion();
	}

	function handleCorrect(): void {
		correctAnswers++;
		showNextQuestion();
	}

	function handleIncorrect(): void {
		incorrectAnswers++;
		showNextQuestion();
	}

	function reset(): void {
		answeredQuestions = [];
		answeredAll = false;
		totalAnswers = 0;
		correctAnswers = 0;
		incorrectAnswers = 0;
		answerVisible = false;
		showNextQuestion();
	}

	function showAnswer(): void {
		answerVisible = true;
	}
</script>

<svelte:head>
	<title>US Civics Test 2025 | Quiz App</title>
	<meta
		name="description"
		content="A quiz app to practice the Civics part of the US Naturalization Test"
	/>
</svelte:head>

{#snippet item(number: number, question: string, answers: string[])}
	<div class="mx-4 flex flex-1 flex-col space-y-4 overflow-y-auto rounded-md bg-white px-2 py-4">
		<h1 class="px-4 text-xl font-bold md:text-2xl">
			<span class="text-gray-300">{number}.</span>
			{question}
		</h1>
		<div>
			{#if answerVisible}
				<ul class="list-disc space-y-1 pr-4 pl-8 text-lg">
					{#each answers as answer}
						<li>{answer}</li>
					{/each}
				</ul>
			{:else}
				<Button fill="lineTheme" line="dashed" onclick={showAnswer} icon={{ name: 'lucide-eye' }}
					>Show Answer</Button
				>
			{/if}
		</div>
	</div>
{/snippet}

<div class="mx-auto flex h-full w-full max-w-xl flex-col gap-2">
	<div class="grid grid-cols-2 gap-2 px-4 py-2 text-center md:gap-4">
		<div class="bg-success/10 rounded-lg p-4">
			<p class="text-success text-sm font-bold">Correct</p>
			<p class="text-success text-3xl font-bold">{correctAnswers}</p>
		</div>
		<div class="bg-error/10 rounded-lg p-4">
			<p class="text-error text-sm font-bold">Incorrect</p>
			<p class="text-error text-3xl font-bold">{incorrectAnswers}</p>
		</div>
	</div>

	{#if answeredAll}
		<div class="flex-1 px-4">
			<p class="text-center text-2xl font-bold">
				{#if correctAnswers >= 6}
					You have answered {correctAnswers} out of {testQuestionLimit} questions correctly.<br
					/><br />
					<span class="text-success">You are now ready to take the real test!</span>
				{:else}
					You have answered {correctAnswers} out of {testQuestionLimit} questions correctly.<br
					/><br />
					<span class="text-error">You need to practice more.</span>
				{/if}
			</p>
		</div>
	{:else if currentQuestion}
		{@render item(currentQuestion.n, currentQuestion.q, currentQuestion.a)}
	{/if}

	<div class="flex flex-col">
		<Button
			onclick={handleCorrect}
			icon={{ name: 'lucide-check' }}
			state="success"
			disabled={answeredAll}>Correct</Button
		>

		<Button
			onclick={handleIncorrect}
			icon={{ name: 'lucide-x' }}
			state="error"
			disabled={answeredAll}>Incorrect</Button
		>

		<Button onclick={reset} icon={{ name: 'lucide-rotate-ccw' }}>Reset</Button>
	</div>
</div>
