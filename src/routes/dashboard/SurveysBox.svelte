<script lang='ts'>
	import '../styles.css';
	import { goto } from "$app/navigation";

	export let surveyList: any[number][string];

	// Redirects user to correct survey page
	function boxClick(id : string) {
    	goto(`/surveys?id=${id}`);
  	}
</script>

<div id='surveysBox'>
	<h2>Surveys</h2>
	<div class='boxContents'>
		<!-- Render survey box for each project -->
		{#each surveyList as survey} 
			<button class='surveyItem' on:click={() => boxClick(survey.projectID)}>
			<span class="material-symbols-outlined">
				quiz
			</span>  
			<h3>Take survey for {survey.projectName}</h3>
			</button>
		{:else}
		<!-- Render this if no projects in list -->
		<div class='surveyItem placeholder'>
			<h3>No surveys due<h3>
		</div>
		{/each}
	</div>
</div>

<style>
	#surveysBox {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 10px;
		background-color: var(--fg1);
		border-radius: 10px;
		box-shadow: var(--outset);
	}

	.surveyItem {
		display: flex;
		flex-direction: row;
		text-align: left;
		align-items: center;
		gap: 10px;
		background-color:var(--fg3);
		padding: 10px;
		border-radius: 5px;
		box-shadow: var(--outset);
		transition: background-color var(--speed);
	}
	
	.placeholder {
		box-shadow: none;
	}

	button:hover {
		background-color: var(--fg2);
	}
</style>
