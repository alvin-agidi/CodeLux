# CodeLux (Group 20)
 
## Instructions
0. Navigate to the root directory of the application, run `npm install`
1. Run `npm run dev`
2. Await the localhost link printed in the console
3. Connect to the server in any popular web browser that is up to date. Google Chrome and Firefox are recommended.
4. To run the code analysis system, install Docker (version 23.0 recommended) from https://www.docker.com/ and simply open the Docker application before running the analysis. Only the code analysis system is dependent on Docker running, the rest of CodeLux operates fully without it.

## Additional guidance
- It is advised to create a project after signing up to access the various features of the application. A project can be added by pressing the 'add project' button in the navigation bar.
- After creating a project, you will be forwarded to the overview page for that project, displaying all the relevant information for the project. This is also the page where code analysis can be run and the project can be marked as complete. This page is accessible from the dashboard and the projects list page.
- Then, it is recommended that you navigate to the dashboard, which will display the project you have just added and any others you may have. Here, you will be able to view the number of projects at risk, overdue projects and those with upcoming deadlines, surveys and tasks. Only project managers will be able to see if a project is at risk, but all project members can take surveys and complete tasks for their projects.
- Surveys for projects can be taken from the dashboard. Project members are reminded to take surveys weekly. Tasks for projects include running code analysis for the project source code. Project members are encouraged to run code analysis weekly. Notifications of tasks and surveys will appear in the dashboard when due.
- Running Docker is necessary only for the code analysis system when running the application server locally. CodeLux will report 'Code analysis unsuccessful' in the popup otherwise.

## Testing
- We have used two different test runners - Jest and Cypress
- Jest was used for unit/component testing and Cypress for end-to-end/integration testing
### How to run Jest tests
1. Run `npm install` to make sure you have all the necessary packages
2. Run `npm test`
### How to run Cypress tests
1. Run `npm install` to make sure you have all the necessary packages
2. Run `npm run dev` so the Cypress tests can run
3. Run `npx cypress open` to get the debugging window
4. Choose e2e testing
5. Run on whichever browser you desire!


## Welcome screen
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/681e9db5-b66b-42ad-86cc-690d0b2a55d1)
## Login screen
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/18d54219-2453-4930-9d9a-c08121ea81ea)
## Dashboard
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/645255af-75c8-4bbc-8bb0-141afa16167b)
## Project list screen
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/d7b55bac-8b08-41c3-a499-d9d7b3ce9c05)
## Project overview screen
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/1d6b1cb6-00bd-4f0d-a48d-b645490d0e9a)
## Add project screen
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/8b9a6e8e-343d-4177-b4d8-dc9616f340b6)
## Full mobile screen support
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/f7b14a11-1352-4cea-a7e0-a8ef009dfdaf)
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/a84b8db4-ebd3-42d8-9d2a-a86dcd40db5b)
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/bbca0f62-7673-41b3-9a27-e06c0ebb991f)
![image](https://github.com/alvin-agidi/CodeLux/assets/63751335/53d2baf1-e49c-4c15-b59a-5adfc151d5fc)

