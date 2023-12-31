import { json, type RequestHandler } from "@sveltejs/kit";
import { app } from "../../../hooks.server";
import { getFirestore, doc, updateDoc, Timestamp } from "firebase/firestore";

export const POST = (async ({ request }) => {
  // Get data
  const data = await request.json();

  // Get firestore instance
  const db = getFirestore(app);

  // Get project
  const project = doc(db, "projects", data.projectID);

  var complete = true;

  if (data.progress == "Complete") {
    complete = false;
  } else if (!data.noRisk) {
    // Send this project for retraining the model
    const response = await fetch(
      "https://cs261-backend-7r5ljue3ha-no.a.run.app/retrain",
      {
        method: "POST",
        body: JSON.stringify({
          metrics: { ...data.metrics, success: [data.success] },
        }),
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
  // If they are completing the project also write whether success/failure to the db, and the end date

  updateDoc(project, {
    complete: complete,
    enddate: Timestamp.now(),
    success: data.success,
  });
  return json({ success: true });
}) satisfies RequestHandler;
