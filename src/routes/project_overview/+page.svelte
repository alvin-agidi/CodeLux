<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
    import Button from "../Button.svelte";
    import { invalidateAll } from "$app/navigation";
    export let data: PageData;
    import Popup from './popup/popup.svelte';
    var openPopup:boolean;
    var popupSuccess = true;
    var popupMsgs:string[] = [];

    // Redirects to dashboard - we then redirect back to the project overview page in dashboard backend using state.
    const getToken = () => {
        if (browser) {
            //get the OAuth token for the user
            goto(
                "https://github.com/login/oauth/authorize?" +
                    new URLSearchParams({
                        client_id: "741e0c0a106d7fdd57f2",
                        scope: "repo",
                        state: data.project.id
                    })
            );
        }
    };

    // Function to get github repo data
    const handleGetGit = async () => {
        // Check if github link exists for project
        if (data.project.githubLink === "") {
            alert("You did not add a GitHub link when adding this project.");
            return;
        }
        openPopup = true;
        popupMsgs.push("Fetching project files...");

        // Get data from github api
        const response = await fetch('/githubAPI', {
            method: "POST",
            body: JSON.stringify({
                link: data.project.githubLink,
                id: data.project.id,
                githubToken: data.user.githubToken
            }),
            headers: {
                "content-type": "application/json",
            },
        });

        const res = await response.json();

        popupMsgs.pop();

        // Show popup messages
        if (res.success) {
            popupMsgs = [...popupMsgs, "Project files fetch successful."];
            runAnalyser();
        } else {
            popupSuccess = false;
            popupMsgs = [...popupMsgs, "Project files fetch unsuccessful."];
            setTimeout(()=>{popupMsgs = []}, 5000);
        }
    };

    // Function to analyse project code
    const runAnalyser = async () => {
        popupMsgs = [...popupMsgs, "Analysing project code..."];

        const response = await fetch('/codeAnalysis', {
            method: "POST",
            body: JSON.stringify({
                projectID: data.project.id,
                projectType: data.project.projectType
            }),
            headers: {
                "content-type": "application/json",
            },
        });

        const res = await response.json();

        popupMsgs.pop();

        if (res.success) {
            popupMsgs = [...popupMsgs, "Code analysis successful.", "Analysis score update successful."];
        } else {
            popupSuccess = false;
            popupMsgs = [...popupMsgs, "Code analysis unsuccessful."];
        }

        setTimeout(()=>{popupMsgs = []}, 5000);

        invalidateAll();
    };

    // Function to toggle progess
    const toggleProgress = async () => {
        // Turn metrics into array values first
        for (let key in data.metrics) {
            data.metrics[key] = [data.metrics[key]];
        }

        await fetch('/project_overview/toggleProgress', {
            method: "POST",
            body: JSON.stringify({
                projectID: data.project.id,
                progress: data.project.progress,
                success: data.predClass,
                metrics: data.metrics,
                noRisk: data.noRisk
            }),
            headers: {
                "content-type": "application/json",
            },
        });

        data.project.progress = data.project.progress == "Complete" ? "Not complete" : "Complete";
    };

    // Function to toggle outcome
    const toggleOutcome = async () => {
        await fetch('/project_overview/toggleOutcome', {
            method: "POST",
            body: JSON.stringify({
                projectID: data.project.id,
                outcome: data.project.outcome
            }),
            headers: {
                "content-type": "application/json",
            },
        });
        invalidateAll();
    };
    var features: any = data.features;

    var items = Object.keys(features).map((key) => { return [key, features[key]] });

    // Step - 2
    // Sort the array based on the second element (i.e. the value)
    items.sort(
    (first, second) => { return second[1] - first[1] }
    );

    // Step - 3
    // Obtain the list of keys in sorted order of the values.
    var features: any = items.map(
    (e) => { return e[0] }).slice(0,3);

    let files: any;
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
    />
    <title>Project Overview</title>
</svelte:head>

<div id="projectOverview">
    <h1>{data.project.name}</h1>
    <div class="boxContents" id="descBox">
        <span class="material-symbols-outlined">info</span>
        <h3>{data.project.desc}</h3>
    </div>
    <div class="boxContents">
        <div class="projectOverviewItem">
            <!-- If project overdue -->
            {#if data.project.progress == "Not complete" && data.project.deadline < new Date()}
			<span class="material-symbols-outlined bad">pending_actions</span> 
            <p class="bad">Overdue by {Math.round((new Date().valueOf() - data.project.deadline)/86400000)} days</p> 
            <!-- If project not overdue -->
			{:else if data.project.progress == "Not complete"}
			<span class="material-symbols-outlined">pending_actions</span> 
            <p>Due in {Math.round((data.project.deadline - new Date().valueOf())/86400000)} days</p> 
            {:else }
            <span class="material-symbols-outlined">pending_actions</span> 
			{/if}
            <p>Due on {(data.project.deadline).toLocaleDateString()}</p>
            <Button click={() => toggleProgress()}>
                {#if data.project.progress == "Complete"}
                <span class="material-symbols-outlined">rule</span>
                Mark as not complete
                {:else}
                <span class="material-symbols-outlined">checklist_rtl</span>
                Mark as complete
                {/if}
            </Button>
        </div>
        <div class="projectOverviewItem">
            <span class="material-symbols-outlined"> calendar_add_on</span>
            <p>Started on {data.project.startDate}</p>
        </div>
        <div class="projectOverviewItem">
            <span class="material-symbols-outlined">support_agent</span>
            <p>Manager: {data.project.managerUsername}</p>
        </div>
        <div class="projectOverviewItem">
            <span class="material-symbols-outlined">groups</span>
            <p>Developers:</p>
            <ul class="suggestionList">
                <!-- Show each developer -->
                {#each data.project.devUsernames as devUsername}
                    <li class="userBox">
                        <span class="material-symbols-outlined">person</span>
                        <p>{devUsername}</p>
                    </li>
                {:else}
                    <li>No developers</li>
                {/each}
            </ul> 
        </div>
        <div class="projectOverviewItem">
            <span class="material-symbols-outlined">folder</span>
            <form action={data.project.githubLink}>
                <Button>Go to project GitHub</Button>
            </form>
        </div>
        <div class="projectOverviewItem">
            <!-- Allows CSV file upload -->
            <span class="material-symbols-outlined">upload_file</span>
            <form method="POST" enctype="multipart/form-data" id='csvForm'>
                <p>Upload CSV files to train the model</p>
                <input type="file" bind:files name="file" id="file" accept=".csv" required/>
                <label for="file">
                {#if files}
                    {[...files][0].name}
                {:else}
                    Choose a file
                {/if}
                </label>
                <Button><span class="material-symbols-outlined">upload</span>Upload</Button>
            </form>
        </div>
        <div class="projectOverviewItem">
            <Popup bind:openPopup bind:popupMsgs success={popupSuccess}/>
            <span class="material-symbols-outlined">terminal</span>
            <p>Project type: {data.project.projectType}</p>
            <p>Last code analysis score: {data.project.codeAnalysisScore}/100</p>
            <p>Last analysed: {data.project.codeAnalysisDate}</p>
            {#if data.user.githubToken === "" || data.user.githubToken === undefined}
                <Button click={() => getToken()}>Authorise GitHub access</Button>
            {:else if data.project.progress == "Not complete"}
                <Button click={() => handleGetGit()}>Run code analysis</Button>
            {/if}
        </div>
        <div class="projectOverviewItem">
            <span class="material-symbols-outlined">payments</span>
            <p>Budget: £{data.project.budget}</p>
        </div>
        {#if data.user.username == data.project.managerUsername}
        <div class="projectOverviewItem">
            {#if data.project.progress == "Not complete" && data.project.status == "At risk" || data.project.progress == "Complete" && data.project.outcome == "Failure"}
                <span class="material-symbols-outlined bad">error</span>
            {:else}
                <span class="material-symbols-outlined good">check_circle</span>
            {/if}
            {#if data.project.progress == "Not complete"}
                <p>Status: {data.project.status}</p>
            {:else}
                <p>Outcome: {data.project.outcome}</p>
                <Button click={() => toggleOutcome()}>
                    {#if data.project.outcome == 'Success'}
                        <span class="material-symbols-outlined bad">error</span>
                        Mark as failure
                    {:else}
                        <span class="material-symbols-outlined good">check_circle</span>
                        Mark as success
                    {/if}
                </Button>
            {/if}
        </div>
        {/if}
        {#if data.project.progress == "Not complete"}
        <div class="projectOverviewItem">
            <span class="material-symbols-outlined">comment</span>
            <h2>Probability of project failure: {data.failureProbability.toFixed(3)}</h2>
            {#if data.noRisk == true}
                <p>Insufficient data to calculate risk!</p>
                <p>Complete survey and run risk analysis to get risk calculation.</p>
            {:else}
                <h2>Suggestions to reduce risk of project failure</h2>
                <ul class="suggestionList">
                    {#each features as feature, i}
                        {i+1}.
                        {#if feature == "budget"}
                            <li>Increase budget</li>
                        {:else if feature == "code_analysis"}
                            <li>Improve code quality</li>
                        {:else if feature == "customer_contact_frequency"}
                            <li>Increase communication with customer</li>
                        {:else if feature == "customer_satisfaction"}
                            <li>Improve customer satisfaction</li>
                        {:else if feature == "num_commits"}
                            <li>Increase number of code commits</li>
                        {:else if feature == "team_confidence"}
                            <li>Increase team confidence</li>
                        {:else if feature == "team_satisfaction"}
                            <li>Increase team satisfaction</li>
                        {:else if feature == "training"}
                            <li>Increase training</li>
                        {/if}
                    {/each}
                </ul> 
            {/if}     
        </div>
        {/if}
    </div>
</div>

<style>
    #projectOverview {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
        margin: 10px 10vw;
        background-color: var(--fg1);
        border-radius: 10px;
        padding: 10px;
        box-shadow: var(--outset);
    }

    .boxContents {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        width: 100%;
        padding: 10px;
        flex: 1;
        gap: 10px;
        border-radius: 5px;
        background-color: var(--fg1);
        box-shadow: var(--inset);
        text-align: center;
    }

    .suggestionList {
        text-align: left;
    }

    .projectOverviewItem {
        display: flex;
        flex-direction: column;
        background-color: var(--fg2);
        padding: 10px;
        gap: 5px;
        max-width:100%;
        max-height:100%;
        align-items: center;
        justify-content: center;
        box-shadow: var(--outset);
        border-radius: 5px;
        flex: 1 0 auto;
    }

    .projectOverviewItem p {
        display: flex;
        text-align: center;
    }

    #csvForm {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        gap: 5px;
    }

    #csvForm input {
       width: fit-content;
    }

    #file {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    #file + label {
	    cursor: pointer;
        display: flex;
		justify-content: space-evenly;
		height: fit-content;
        width: fit-content;
        padding: 10px;
		gap: 5px;
        align-items: center;
		border-radius: 10px;
		background-color:var(--fg3);
		box-shadow: var(--outset);
    }

    #descBox {
        flex: 0;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    #descBox h3 {
        align-items: left;
    }

    #descBox span {
        font-size: 20px;
    }

    .bad {
        color: #ef4444;
    }

    .good {
        color: #22c55e;
    }

    .userBox {
        align-items: center;
        display: flex;
        gap: 5px;
        width: max-content;
    }

    .projectOverviewItem>span {
        font-size: 50px;
    }

    .userBox span {
        font-size: 20px;
    }
</style>
