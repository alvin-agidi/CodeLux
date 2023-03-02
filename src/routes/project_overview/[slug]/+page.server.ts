import { app } from "../../../hooks.server";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    doc,
    getDoc
} from "firebase/firestore";
import type { PageServerLoad } from "../../login/$types";
import type { user } from "../../../user";

export const load: PageServerLoad = async ({ cookies, url, params }) => {
    const cookie = cookies.get("user")!;
    const user: user = JSON.parse(cookie);
    const db = getFirestore(app);

    // const projID = url.searchParams.get("id")!;
    const projID = params.slug;
    const project = doc(db, "projects", projID);
    const projectDoc = await getDoc(project);

    let name = projectDoc.get("projectname");
    let desc = projectDoc.get("projectdescription");
    let deadline = projectDoc.get("deadline").toDate().toLocaleString();
    let startDate = projectDoc.get("startdate").toDate().toLocaleString();
    let budget = Math.round(projectDoc.get("budget") * 100) / 100;
    let codeAnalysisScore = 0;
    let codeAnalysisDate = "Never";
    // let codeAnalysisScore = projectDoc.get("codeAnalysisScore") * 100;
    // let codeAnalysisDate = projectDoc
    //     .get("codeAnalysisDate")
    //     .toDate()
    //     .toLocaleString();
    let managerUsername = projectDoc.get("managerusername");
    let githubLink = projectDoc.get("githublink");
    let devUsernames: string[] = [];
    for (const developer of projectDoc.get("developerusernames")) {
        devUsernames.push(developer);
    }
    let status = "Not at risk";
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
        id: projID,
    };
};
