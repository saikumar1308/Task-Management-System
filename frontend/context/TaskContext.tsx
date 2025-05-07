import { createContext, useContext, useState, ReactNode } from 'react';

interface TaskContextType {
    refreshTasks: () => void;
    setRefreshTasks: (callback: () => void) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [refreshTasks, setRefreshTasks] = useState<() => void>(() => {});

    return (
        <TaskContext.Provider value={{ refreshTasks, setRefreshTasks }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskContext() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
} 