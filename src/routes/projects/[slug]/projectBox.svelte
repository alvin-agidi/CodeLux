<script lang="ts">
  import { goto } from "$app/navigation";

  export let name: string;
  export let date: string;
  export let id: string;

  // Function to redirect user to correct project
  function boxClick() {
    goto(`/project_overview?id=${id}`);
  }
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
</svelte:head>

<div id="projectBox">

  <button class="boxContents" on:click={() => boxClick()}>
    <div class="projectInfo">
      <span class="material-symbols-outlined">task</span>
      <div>
        <h3>{name}</h3>
        <p>Due date: {date}</p>
      </div>
    </div>
    <span class="material-symbols-outlined">chevron_right</span>
  </button>
</div>

<style>
  .material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  }

  .boxContents {
    flex: 1 0;
    display: flex;
    flex-direction: row;
    border-radius: 5px;
    background-color: var(--fg3);
    gap: 10px;
    padding: 15px;
    text-align: left;
    width: 100%;
    align-items: center;
    box-shadow: var(--outset);
    justify-content: space-between;
  }

  button:hover {
    transition: background-color var(--speed);
    background-color: var(--fg2);
  }

  .projectInfo {
    display: flex;
    align-items: center;
    gap: 15px;
  }

</style>
