import { app } from '../../hooks.server';
import { getFirestore, collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import type { PageServerLoad } from "../login/$types";

export const load: PageServerLoad = async () => {
    let name = "";
    let desc = "";
    let deadline = "";
    let startDate = "";
    let budget = 0;
    let devUsernames: string[] = []
    let status = "Not at risk";
    const db = getFirestore(app);
    const project = doc(db, "projects", "jbyYPtjz82qsybRuVYlb");
    const projectDoc = await getDoc(project);
    name = projectDoc.get("projectname");
    desc = projectDoc.get("projectdescription");
    deadline = projectDoc.get("deadline").toDate().toLocaleString();
    startDate = projectDoc.get("startdate").toDate().toLocaleString();
    budget = Math.round(projectDoc.get("budget") * 100) / 100;
    for (const developer of projectDoc.get("developerusernames")){
        devUsernames.push(developer);
    }
    if (projectDoc.get("atRisk")){
        status = "At risk";
    };
    return {
        name: name,
        desc: desc,
        deadline: deadline,
        startDate: startDate,
        budget: budget,
        devUsernames: devUsernames,
        status: status
    };
}

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
