import { app } from "../../hooks.server";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import type { PageServerLoad } from "../login/$types";
import type { user } from "../../user";

export const load: PageServerLoad = async ({ cookies, url }) => {
  const cookie = cookies.get("user")!;
  const user: user = JSON.parse(cookie);

  let name = "";
  let desc = "";
  let deadline = "";
  let startDate = "";
  let budget = 0;
  let codeAnalysisScore = 0;
  let codeAnalysisDate = "";
  let managerUsername = "";
  let githubLink = "";
  let devUsernames: string[] = [];
  let status = "Not at risk";
  const db = getFirestore(app);

  const projID = url.searchParams.get('id')!;
  const project = doc(db, "projects", projID);
  const projectDoc = await getDoc(project);

  name = projectDoc.get("projectname");
  desc = projectDoc.get("projectdescription");
  deadline = projectDoc.get("deadline").toDate().toLocaleString();
  startDate = projectDoc.get("startdate").toDate().toLocaleString();
  budget = Math.round(projectDoc.get("budget") * 100) / 100;
  // codeAnalysisScore = projectDoc.get("codeAnalysisScore")*100;
  // codeAnalysisDate = projectDoc.get("codeAnalysisDate").toDate().toLocaleString();
  managerUsername = projectDoc.get("managerusername");
  githubLink = projectDoc.get("githublink");
  for (const developer of projectDoc.get("developerusernames")) {
    devUsernames.push(developer);
  }
  if (projectDoc.get("atRisk")) {
    status = "At risk";
  }
  return {
    name: name,
    desc: desc,
    deadline: deadline,
    startDate: startDate,
    budget: budget,
    codeAnalysisScore: codeAnalysisScore,
    codeAnalysisDate: codeAnalysisDate,
    managerUsername: managerUsername,
    githubLink: githubLink,
    devUsernames: devUsernames,
    status: status,
    user: user,
    id: projID
  };
};
// async function getDeadlines() {
//     type DeadlinePair = {[key: string]: string };
// 	let deadlineList: DeadlinePair[] = [];
//     const db = getFirestore(app);
//     const ps = collection(db, 'projects');
//     const projects = query(ps, where("complete", "==", false), orderBy("deadline"));
//     const querySnapshot = await getDocs(projects);
//     querySnapshot.forEach((project) => {
//         let deadlinePair = {
//             name: project.data().name,
//             deadline: project.data().deadline.toDate().toLocaleString()
//         };
//         deadlineList.push(deadlinePair);
//     });
//     return JSON.stringify(deadlineList);
// }