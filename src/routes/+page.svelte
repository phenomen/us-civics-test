<script lang="ts">
	import type { PageProps } from './$types';
	import { CheckIcon, XIcon, RotateCcwIcon, EyeIcon } from '@lucide/svelte';

	let { data }: PageProps = $props();

	let questions = $derived(data.questions);
	let answeredQuestions = $state<number[]>([]);
	let availableQuestions = $derived(questions.filter((q) => !answeredQuestions.includes(q.n)));

	type Question = (typeof questions)[number];

	let currentQuestion = $state<Question | null>(null);

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
	<title>US Civics Test 2025 | Practice App</title>
	<meta
		name="description"
		content="A practice app for the Civics part of the US Naturalization Test using USCIS 2025 Study Guide"
	/>
</svelte:head>

{#snippet item(number: number, question: string, answers: string[])}
	<div class="flex flex-1 flex-col space-y-4 overflow-y-auto rounded-md bg-white p-4">
		<h1 class="text-xl font-bold md:text-2xl">
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
				<button onclick={showAnswer} class="button hover:text-primary border border-dashed"
					><EyeIcon /><span>Show Answer</span></button
				>
			{/if}
		</div>
	</div>
{/snippet}

<div class="mx-auto flex h-full w-full max-w-xl flex-col gap-4 px-2 pt-2 sm:px-0">
	<div class="grid grid-cols-2 gap-2 text-center md:gap-4">
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
		<div class="flex-1">
			<p class="text-center text-2xl font-bold">
				{#if correctAnswers >= 6}
					You have answered {correctAnswers} out of {testQuestionLimit} questions correctly.<br
					/><br />
					<span class="text-success">Good job!</span>
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

	<div class="flex flex-col space-y-2">
		<button onclick={handleCorrect} class="button success" disabled={answeredAll}
			><CheckIcon /><span>Correct</span></button
		>

		<button onclick={handleIncorrect} class="button error" disabled={answeredAll}
			><XIcon /><span>Incorrect</span></button
		>

		<button onclick={reset} class="button default"><RotateCcwIcon /><span>Reset</span></button>
	</div>

	<footer class="py-1.5 text-center text-xs text-gray-500">
		This app is not affiliated with USCIS.
	</footer>
</div>
