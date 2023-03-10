import { app } from "../../hooks.server";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import type { PageServerLoad } from "../login/$types";
import type { user } from "../../user";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, url }) => {
  const cookie = cookies.get("user");
  if (cookie == undefined) {
    throw redirect(302, "/login");
  }
  const user: user = JSON.parse(cookie);

  const db = getFirestore(app);

  const projectID = url.searchParams.get("id")!;
  const project = doc(db, "projects", projectID);
  const projectDoc = await getDoc(project);

  const name = projectDoc.get("projectname");
  const desc = projectDoc.get("projectdescription");
  const deadline = projectDoc.get("deadline").toDate();
  const startDate = projectDoc.get("startdate").toDate().toLocaleDateString();
  const smetrics = projectDoc.get("smetrics");
  const budget = Math.round(projectDoc.get("budget") * 100) / 100;
  const codeAnalysisScore = projectDoc.get("codeAnalysisScore") * 100;
  const codeAnalysisDate = projectDoc
    .get("codeAnalysisDate")
    .toDate()
    .toLocaleString();
  const managerUsername = projectDoc.get("managerusername");

  const aiMetrics = {};
  let res = {
    features: {},
    classification: [0,0],
    predicted_class:0
  };

  let noRisk = true
  if(smetrics){
    noRisk=false
    for (let key in smetrics) {
        if (key.endsWith("answered")) {
          const metricName = key.substring(0, key.lastIndexOf("_"));
          //@ts-ignore
          aiMetrics[metricName] = smetrics[metricName] / smetrics[key];
        }
      }
      //add code analysis and budget and num comits, non soft metrics
      //@ts-ignore
      aiMetrics["code_analysis"] = codeAnalysisScore;
      //@ts-ignore
    
      aiMetrics["budget"] = budget;
      //@ts-ignore
    
      aiMetrics["num_commits"] = projectDoc.get("numCommits");
    
      //query AI backend for stuff
      const response = await fetch(
        "https://cs261-backend-7r5ljue3ha-no.a.run.app/classify",
        {
          method: "POST",
          body: JSON.stringify({ metrics: aiMetrics }),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      res = await response.json();
        console.log( 'classification (prob of risk): ', res.classification[0], 'features: ', res.features, 'predictedclass: ', res.predicted_class)
  }

  const githubLink = projectDoc.get("githublink");
  const projectType = projectDoc.get("projecttype");
  const devUsernames: string[] = [];
  for (const developer of projectDoc.get("developerusernames")) {
    devUsernames.push(developer);
  }
  var progress = "Not complete";
  var status = "Not at risk";
  if (projectDoc.get("complete")) {
    progress = "Complete";
    if (projectDoc.get("atRisk")) {
      status = "Failure";
    } else {
      status = "Success";
    }
  } else if (projectDoc.get("atRisk")) {
    status = "At risk";
  }

  return {
    user: user,
    project: {
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
      progress: progress,
      status: status,
      projectType: projectType,
      id: projectID,
    },
    features: res.features,
    failureProbability: res.classification[0],
    predClass: res.predicted_class,
    noRisk: noRisk
  };
};
