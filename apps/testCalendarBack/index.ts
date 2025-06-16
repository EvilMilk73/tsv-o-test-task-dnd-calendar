import express, { Request, Response } from "express";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { db } from "./firebase";
import { Task } from "./types/TaskTypes";
import { getDocId } from "./utils/db.utils";
import { populateHolidayForYear } from "./services/holiday.service";
const app = express();
app.use(express.json());

app.get("/api/hello", async (req: Request, res: Response) => {
  const snapshot = await db.collection("tasks").get();
  const data = snapshot.docs.map((doc) => doc.data());

  res.json({ message: "Hello from Express + Firebase!", data });
});

app.post("/api/tasks/:year/:month", async (req: Request, res: Response) => {
  const { year, month } = req.params;

  const docId = getDocId(year, month);

  const tasks = req.body as Record<string, Task[]>;

  await db.collection("tasks").doc(docId).set(
    {
      tasks: tasks,
    },
    { merge: true }
  );

  res.json({ message: "Hello from Express + Firebase!", b: req.body });
});

app.get("/api/tasks/:year/:month", async (req: Request, res: Response) => {
  const { year, month } = req.params;

  const docId = getDocId(year, month);
  const docRef = db.collection("tasks").doc(docId);

  const docSnap = await docRef.get();

  if (docSnap && docSnap.exists) {
    res.json({ tasks: docSnap.data()?.tasks });
  } else {
    res.json({});
  }
});

app.get("/api/holidays/:year/:month", async (req: Request, res: Response) => {
  const { year, month } = req.params;

  const docId = getDocId(year, month);

  const docRef = db.collection("holidays").doc(docId);
  let docSnap = await docRef.get();

  if (!docSnap.exists) {
    await populateHolidayForYear(Number(year));
    console.log("New data is populated");
    docSnap = await docRef.get();
  }

  if (docSnap.exists) {
    res.json({ selectedHolidays: docSnap.data()?.holidays });
  } else {
    res.status(404).send("Doc with id " + docId + "not found");
  }
});

if (process.env.NODE_ENV !== "production") {
  const port = 3001;
  app.listen(port, () => {});
  console.log("app listen on " + port);
}

export default (req: IncomingMessage, res: ServerResponse) => {
  const server = createServer(app);
  server.emit("request", req, res);
};
