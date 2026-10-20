import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Task = {
  id: number;
  title: string;
  dueDate: string;
  subject: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
};

type TasksFile = { tasks: Task[] };

const tasksFilePath = path.join(process.cwd(), "data", "tasks.json");

async function readTasks(): Promise<TasksFile> {
  const contents = await readFile(tasksFilePath, "utf-8");
  return JSON.parse(contents) as TasksFile;
}

export async function GET() {
  try {
    const data = await readTasks();
    return Response.json(data.tasks);
  } catch {
    return Response.json({ error: "Impossible de lire les tâches." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  let update: { id?: unknown; completed?: unknown };

  try {
    update = await request.json();
  } catch {
    return Response.json({ error: "Le corps de la requête doit être un JSON valide." }, { status: 400 });
  }

  if (!Number.isInteger(update?.id) || typeof update.completed !== "boolean") {
    return Response.json({ error: "Un identifiant et un statut completed valide sont requis." }, { status: 400 });
  }

  try {
    const data = await readTasks();
    const task = data.tasks.find((item) => item.id === update.id);

    if (!task) {
      return Response.json({ error: "Tâche introuvable." }, { status: 404 });
    }

    task.completed = update.completed;
    await writeFile(tasksFilePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");

    return Response.json(task);
  } catch {
    return Response.json({ error: "Impossible d’enregistrer la tâche." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let newTask: Omit<Task, "id">;

  try {
    newTask = (await request.json()) as Omit<Task, "id">;
  } catch {
    return Response.json({ error: "Le corps de la requête doit être un JSON valide." }, { status: 400 });
  }

  if (
    typeof newTask?.title !== "string" ||
    typeof newTask.dueDate !== "string" ||
    typeof newTask.subject !== "string" ||
    !["high", "medium", "low"].includes(newTask.priority) ||
    typeof newTask.completed !== "boolean"
  ) {
    return Response.json({ error: "Données de tâche invalides." }, { status: 400 });
  }

  try {
    const data = await readTasks();
    const task: Task = {
      ...newTask,
      id: data.tasks.reduce((maxId, existing) => Math.max(maxId, existing.id), 0) + 1,
    };
    data.tasks.push(task);
    await writeFile(tasksFilePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");

    return Response.json(task, { status: 201 });
  } catch {
    return Response.json({ error: "Impossible d’enregistrer la tâche." }, { status: 500 });
  }
}
