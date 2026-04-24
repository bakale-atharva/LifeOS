"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc, 
  getDoc,
  getDocs,
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { 
  Plus, 
  ChevronRight, 
  Target, 
  Briefcase, 
  CheckCircle2, 
  Trash2,
  ArrowLeft
} from "lucide-react";

type Goal = { id: string; title: string; description: string; progress: number; status: string };
type Project = { id: string; goalId: string; title: string; progress: number; deadline: string; status: string };
type Task = { id: string; projectId: string; title: string; completed: boolean; dueDate: string };

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Listen for Goals
  useEffect(() => {
    const q = query(collection(db, "goals"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal)));
    });
  }, []);

  // Listen for Projects
  useEffect(() => {
    if (!selectedGoalId) {
        setProjects([]);
        return;
    }
    const q = query(collection(db, "projects"), where("goalId", "==", selectedGoalId));
    return onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
  }, [selectedGoalId]);

  // Listen for Tasks
  useEffect(() => {
    if (!selectedProjectId) {
        setTasks([]);
        return;
    }
    const q = query(collection(db, "tasks"), where("projectId", "==", selectedProjectId));
    return onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    });
  }, [selectedProjectId]);

  const addGoal = async () => {
    if (!newGoalTitle.trim()) return;
    await addDoc(collection(db, "goals"), {
      title: newGoalTitle,
      description: "",
      progress: 0,
      status: "active",
      createdAt: serverTimestamp()
    });
    setNewGoalTitle("");
  };

  const addProject = async () => {
    if (!newProjectTitle.trim() || !selectedGoalId) return;
    await addDoc(collection(db, "projects"), {
      goalId: selectedGoalId,
      title: newProjectTitle,
      progress: 0,
      deadline: "",
      status: "active"
    });
    setNewProjectTitle("");
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !selectedProjectId) return;
    await addDoc(collection(db, "tasks"), {
      projectId: selectedProjectId,
      title: newTaskTitle,
      completed: false,
      dueDate: ""
    });
    setNewTaskTitle("");
    updateProjectProgress(selectedProjectId);
  };

  const toggleTask = async (task: Task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed
    });
    updateProjectProgress(task.projectId);
  };

  const updateProjectProgress = async (projectId: string) => {
    // Get all tasks for this project
    const q = query(collection(db, "tasks"), where("projectId", "==", projectId));
    const snapshot = await getDocs(q);
    const tasksData = snapshot.docs.map(doc => doc.data());
    
    if (tasksData.length === 0) return;
    
    const completedCount = tasksData.filter(t => t.completed).length;
    const progress = Math.round((completedCount / tasksData.length) * 100);
    
    await updateDoc(doc(db, "projects", projectId), { progress });

    // After updating project, update the parent goal progress
    const projectSnap = await getDoc(doc(db, "projects", projectId));
    if (projectSnap.exists()) {
      const goalId = projectSnap.data().goalId;
      updateGoalProgress(goalId);
    }
  };

  const updateGoalProgress = async (goalId: string) => {
    const q = query(collection(db, "projects"), where("goalId", "==", goalId));
    const snapshot = await getDocs(q);
    const projectsData = snapshot.docs.map(doc => doc.data());
    
    if (projectsData.length === 0) return;
    
    const totalProgress = projectsData.reduce((acc, p) => acc + (p.progress || 0), 0);
    const averageProgress = Math.round(totalProgress / projectsData.length);
    
    await updateDoc(doc(db, "goals", goalId), { progress: averageProgress });
  };

  return (
    <main className="flex-1 flex flex-col p-8 space-y-8 overflow-y-auto">
      <header className="flex items-center space-x-4">
        {selectedProjectId ? (
          <button onClick={() => setSelectedProjectId(null)} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft size={20}/></button>
        ) : selectedGoalId ? (
          <button onClick={() => setSelectedGoalId(null)} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft size={20}/></button>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight">
          {selectedProjectId ? "PROJECT DETAILS" : selectedGoalId ? "PROJECTS" : "GOALS MANAGEMENT"}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Goals List */}
        {!selectedGoalId && (
          <div className="col-span-3 space-y-6">
            <div className="flex items-center space-x-4">
              <input 
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="nexus-input flex-1" 
                placeholder="Initialize new high-level goal..." 
              />
              <button onClick={addGoal} className="nexus-btn flex items-center space-x-2">
                <Plus size={18} /> <span>Create Goal</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => (
                <div key={goal.id} className="nexus-panel p-6 group cursor-pointer hover:border-teal-500/50 transition-all" onClick={() => setSelectedGoalId(goal.id)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                      <Target size={24} />
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-teal-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase">{goal.title}</h3>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-4">
                    <div className="bg-teal-500 h-full transition-all" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress: {goal.progress}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects List */}
        {selectedGoalId && !selectedProjectId && (
          <div className="col-span-3 space-y-6">
            <div className="flex items-center space-x-4">
              <input 
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="nexus-input flex-1" 
                placeholder="Attach new project to goal..." 
              />
              <button onClick={addProject} className="nexus-btn flex items-center space-x-2">
                <Plus size={18} /> <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="nexus-panel p-6 group cursor-pointer hover:border-teal-500/50 transition-all" onClick={() => setSelectedProjectId(project.id)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                      <Briefcase size={24} />
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-teal-400 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase">{project.title}</h3>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-4">
                    <div className="bg-teal-500 h-full transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Completion: {project.progress}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks List */}
        {selectedProjectId && (
          <div className="col-span-3 space-y-6">
            <div className="flex items-center space-x-4">
              <input 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="nexus-input flex-1" 
                placeholder="Define next actionable step..." 
              />
              <button onClick={addTask} className="nexus-btn flex items-center space-x-2">
                <Plus size={18} /> <span>Add Task</span>
              </button>
            </div>

            <div className="nexus-panel p-8 space-y-4">
              {tasks.length === 0 && <div className="text-center text-gray-500 italic py-8">No steps defined for this project yet.</div>}
              {tasks.map(task => (
                <div key={task.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-transparent hover:border-teal-500/30 transition-all group">
                  <button onClick={() => toggleTask(task)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-teal-500 border-teal-500' : 'border-gray-600 hover:border-teal-400'}`}>
                    {task.completed && <CheckCircle2 size={16} className="text-gray-900" />}
                  </button>
                  <span className={`flex-1 font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</span>
                  <button className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
