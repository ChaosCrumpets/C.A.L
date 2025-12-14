import { create } from 'zustand';
import type { Project, ChatMessage, Hook, ContentOutput, AgentStatus, UserInputs, ProjectStatusType } from '@shared/schema';
import { ProjectStatus } from '@shared/schema';

interface ProjectStore {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  
  initProject: () => void;
  addMessage: (message: ChatMessage) => void;
  updateInputs: (inputs: Partial<UserInputs>) => void;
  setHooks: (hooks: Hook[]) => void;
  selectHook: (hook: Hook) => void;
  setOutput: (output: ContentOutput) => void;
  setStatus: (status: ProjectStatusType) => void;
  setAgents: (agents: AgentStatus[]) => void;
  updateAgent: (name: string, status: AgentStatus['status'], task?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const createInitialProject = (): Project => ({
  id: crypto.randomUUID(),
  status: ProjectStatus.INPUTTING,
  inputs: {},
  messages: [],
  hooks: undefined,
  selectedHook: undefined,
  output: undefined,
  agents: undefined,
  createdAt: Date.now(),
  updatedAt: Date.now()
});

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  isLoading: false,
  error: null,

  initProject: () => {
    set({ 
      project: createInitialProject(),
      isLoading: false,
      error: null
    });
  },

  addMessage: (message: ChatMessage) => {
    const { project } = get();
    if (!project) return;
    
    set({
      project: {
        ...project,
        messages: [...project.messages, message],
        updatedAt: Date.now()
      }
    });
  },

  updateInputs: (inputs: Partial<UserInputs>) => {
    const { project } = get();
    if (!project) return;
    
    set({
      project: {
        ...project,
        inputs: { ...project.inputs, ...inputs },
        updatedAt: Date.now()
      }
    });
  },

  setHooks: (hooks: Hook[]) => {
    const { project } = get();
    if (!project) return;
    
    set({
      project: {
        ...project,
        hooks,
        status: ProjectStatus.HOOK_SELECTION,
        updatedAt: Date.now()
      }
    });
  },

  selectHook: (hook: Hook) => {
    const { project } = get();
    if (!project) return;
    
    set({
      project: {
        ...project,
        selectedHook: hook,
        status: ProjectStatus.GENERATING,
        updatedAt: Date.now()
      }
    });
  },

  setOutput: (output: ContentOutput) => {
    const { project } = get();
    if (!project) return;
    
    set({
      project: {
        ...project,
        output,
        status: ProjectStatus.COMPLETE,
        updatedAt: Date.now()
      }
    });
  },

  setStatus: (status: ProjectStatusType) => {
    const { project } = get();
    if (!project) return;
    
    set({
      project: {
        ...project,
        status,
        updatedAt: Date.now()
      }
    });
  },

  setAgents: (agents: AgentStatus[]) => {
    const { project } = get();
    if (!project) return;
    
    set({
      project: {
        ...project,
        agents,
        updatedAt: Date.now()
      }
    });
  },

  updateAgent: (name: string, status: AgentStatus['status'], task?: string) => {
    const { project } = get();
    if (!project || !project.agents) return;
    
    const agents = project.agents.map(agent => 
      agent.name === name ? { ...agent, status, task } : agent
    );
    
    set({
      project: {
        ...project,
        agents,
        updatedAt: Date.now()
      }
    });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),

  reset: () => set({ 
    project: createInitialProject(),
    isLoading: false,
    error: null
  })
}));
