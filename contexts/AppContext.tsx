"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define User Roles
export type UserRole = "OPERATOR" | "PREPARER" | "ADMIN";

// Define Machine Interface
export interface Machine {
    id: string;
    item: string;
    op: string;
    cycleTime: string;
    pieces: number;
    totalTarget?: number;
    status: "Running" | "Stopped" | "Maintenance" | "Adjustment" | "Offline";
    lastReading?: string;
    particularities?: string;
}

// Initial Mock Data with Real Production Values
const INITIAL_MACHINES: Machine[] = [
    { id: "TNL 028", item: "109.497-1", op: "5010737547", cycleTime: "5:53,9", pieces: 1250, totalTarget: 2000, status: "Running", particularities: "Máquina com tendência a aquecer o fuso após 4h de operação contínua." },
    { id: "TNL 007", item: "116.037-1", op: "5010737741", cycleTime: "1:27,5", pieces: 3400, totalTarget: 5000, status: "Running", particularities: "" },
    { id: "TNL 008", item: "116.037-1", op: "5010737742", cycleTime: "-", pieces: 0, totalTarget: 1000, status: "Running", particularities: "Barra alimentadora trava ocasionalmente com material 116." },
    { id: "TNL 003", item: "616.601-2", op: "5080009804", cycleTime: "1:35,6", pieces: 890, totalTarget: 1500, status: "Running", particularities: "" },
    { id: "TNL 031", item: "320086", op: "5010744849", cycleTime: "1:03,3", pieces: 4500, totalTarget: 5000, status: "Running", particularities: "" },
    { id: "TNL 032", item: "550.112-4", op: "5010740001", cycleTime: "-", pieces: 0, totalTarget: 2000, status: "Maintenance", lastReading: "Manutenção Preventiva", particularities: "Aguardando peças de reposição da Alemanha." },
    { id: "TNL 004", item: "331006", op: "5010737547", cycleTime: "1:15,1", pieces: 2100, totalTarget: 3000, status: "Running", particularities: "" },
    { id: "TNL 143", item: "116.037-1", op: "-", cycleTime: "1:36,2", pieces: 150, totalTarget: 500, status: "Running", particularities: "" },
    { id: "TNL 049", item: "319217", op: "5010738000", cycleTime: "1:27,1", pieces: 3200, totalTarget: 4000, status: "Running", particularities: "" },
    { id: "TNL 050", item: "106.226-2", op: "-", cycleTime: "2:23,9", pieces: 780, totalTarget: 1000, status: "Running", particularities: "" },
    { id: "TNL 051", item: "319523", op: "-", cycleTime: "1:34,6", pieces: 1200, totalTarget: 1500, status: "Running", particularities: "" },
    { id: "TNL 017", item: "106.231-1", op: "5010738888", cycleTime: "2:42,8", pieces: 560, totalTarget: 600, status: "Running", particularities: "" },
    { id: "TNL 013", item: "616.601-2", op: "-", cycleTime: "1:19,2", pieces: 4100, totalTarget: 4500, status: "Running", particularities: "" },
    { id: "TNL 016", item: "115.252-2", op: "5010737700", cycleTime: "1:55,2", pieces: 900, totalTarget: 1000, status: "Running", particularities: "" },
    { id: "TNL 018", item: "319254", op: "-", cycleTime: "4:23,10", pieces: 320, totalTarget: 500, status: "Running", particularities: "" },
];

const INITIAL_SOLUTIONS: Record<string, string[]> = {
    "Dimensional": ["Ajustar corretor de ferramenta", "Trocar inserto de acabamento", "Verificar folga no fuso"],
    "Acabamento": ["Trocar ferramenta de corte", "Aumentar velocidade de corte (Vc)", "Limpar cavacos acumulados"],
    "Processo": ["Revisar programa CNC", "Ajustar pressão da pinça", "Conferir centralização da peça"]
};

const INITIAL_ITEMS: Array<{ id: string; name: string; drawingUrl?: string; setupImageUrl?: string }> = [
    { id: "109.497-1", name: "Eixo de Transmissão" },
    { id: "116.037-1", name: "Pino Guia" },
    { id: "616.601-2", name: "Flange do Motor" },
    { id: "320086", name: "Engrenagem Principal" },
];

export interface KnowledgeBaseEntry {
    id: string;
    category: string;
    symptom: string;
    causes: Array<{
        id: string;
        text: string;
        solution: string;
        type: "standard" | "golden";
    }>;
}

const INITIAL_KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
    {
        id: "kb-001",
        category: "Dimensional",
        symptom: "Comprimento variando",
        causes: [
            { id: "c1", text: "Sujeira na pinça de alimentação", solution: "Limpar a pinça com ar comprimido e verificar se há rebarbas no material.", type: "standard" },
            { id: "c2", text: "Limitador de barra frouxo", solution: "Reapertar o limitador e conferir o zeramento do eixo Z.", type: "standard" },
            { id: "c3", text: "Folga no encoder do motor", solution: "Verificar acoplamento do encoder (Dica de Ouro: em máquinas antigas, a vibração solta o conector X12).", type: "golden" }
        ]
    },
    {
        id: "kb-002",
        category: "Acabamento",
        symptom: "Rugosidade alta",
        causes: [
            { id: "c4", text: "Inserto desgastado", solution: "Verificar aresta de corte e substituir se necessário.", type: "standard" },
            { id: "c5", text: "Avanço muito alto", solution: "Reduzir avanço em 10% e testar.", type: "standard" }
        ]
    }
];

interface AppContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    machines: Machine[];
    updateMachineStatus: (id: string, status: Machine["status"]) => void;
    updateMachineData: (id: string, data: Partial<Machine>) => void;
    maintenanceHistory: any[];
    addMaintenanceRecord: (machineId: string, issue: string, resolution: string) => void;
    history: any[];
    addHistoryEntry: (entry: { machineId: string; category: string; description: string; user: string }) => void;
    toggleAdjustment: (id: string, isStarting: boolean, obs?: string) => void;
    adjustmentLogs: any[];
    solutions: Record<string, string[]>;
    updateSolutions: (category: string, newSolutions: string[]) => void;
    items: any[];
    addItem: (item: any) => void;
    knowledgeBase: KnowledgeBaseEntry[];
    addKnowledgeEntry: (entry: KnowledgeBaseEntry) => void;
    // Auth & Users
    isAuthorized: boolean;
    preparers: Array<{ id: string; name: string; pin: string }>;
    login: (pin: string, requestedRole: UserRole) => boolean;
    logout: () => void;
    addPreparer: (name: string, pin: string) => void;
    updatePreparerPin: (id: string, newPin: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>("OPERATOR");
    const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
    const [history, setHistory] = useState<any[]>([]);
    const [maintenanceHistory, setMaintenanceHistory] = useState<any[]>([]);
    const [adjustmentLogs, setAdjustmentLogs] = useState<any[]>([]);
    const [solutions, setSolutions] = useState(INITIAL_SOLUTIONS);
    const [items, setItems] = useState(INITIAL_ITEMS);
    const [knowledgeBase, setKnowledgeBase] = useState(INITIAL_KNOWLEDGE_BASE);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [preparers, setPreparers] = useState([
        { id: "1", name: "Carlos Alberto", pin: "1234" },
        { id: "2", name: "Ricardo Silva", pin: "5678" }
    ]);
    const MASTER_PIN = "4850";

    // --- PERSISTENCE LOGIC ---
    useEffect(() => {
        const savedMachines = localStorage.getItem("neo_machines");
        if (savedMachines) setMachines(JSON.parse(savedMachines));

        const savedPreparers = localStorage.getItem("neo_preparers");
        if (savedPreparers) setPreparers(JSON.parse(savedPreparers));

        const savedHistory = localStorage.getItem("neo_history");
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        const savedMaintHistory = localStorage.getItem("neo_maint_history");
        if (savedMaintHistory) setMaintenanceHistory(JSON.parse(savedMaintHistory));

        const savedAdjLogs = localStorage.getItem("neo_adj_logs");
        if (savedAdjLogs) setAdjustmentLogs(JSON.parse(savedAdjLogs));

        const savedSolutions = localStorage.getItem("neo_solutions");
        if (savedSolutions) setSolutions(JSON.parse(savedSolutions));

        const savedItems = localStorage.getItem("neo_items");
        if (savedItems) setItems(JSON.parse(savedItems));

        const savedKB = localStorage.getItem("neo_kb");
        if (savedKB) setKnowledgeBase(JSON.parse(savedKB));
    }, []);

    useEffect(() => {
        localStorage.setItem("neo_machines", JSON.stringify(machines));
        localStorage.setItem("neo_preparers", JSON.stringify(preparers));
        localStorage.setItem("neo_history", JSON.stringify(history));
        localStorage.setItem("neo_maint_history", JSON.stringify(maintenanceHistory));
        localStorage.setItem("neo_adj_logs", JSON.stringify(adjustmentLogs));
        localStorage.setItem("neo_solutions", JSON.stringify(solutions));
        localStorage.setItem("neo_items", JSON.stringify(items));
        localStorage.setItem("neo_kb", JSON.stringify(knowledgeBase));
    }, [machines, preparers, history, maintenanceHistory, adjustmentLogs, solutions, items, knowledgeBase]);

    const updateMachineStatus = (id: string, status: Machine["status"]) => {
        setMachines(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    };

    const updateMachineData = (id: string, data: Partial<Machine>) => {
        setMachines(prev => prev.map(m => {
            if (m.id === id) {
                const updated = { ...m, ...data };
                // Auto-log OP Finish
                if (data.pieces !== undefined && m.totalTarget && updated.pieces >= m.totalTarget && m.pieces < m.totalTarget) {
                    addHistoryEntry({
                        machineId: id,
                        category: "Particularities",
                        description: `OP ${m.op} finalizada com sucesso! Meta: ${m.totalTarget}, Produzido: ${updated.pieces}`,
                        user: "Sistema"
                    });
                }
                return updated;
            }
            return m;
        }));
    };

    const addHistoryEntry = (entry: any) => {
        setHistory(prev => [{ ...entry, id: Math.random().toString(36), timestamp: new Date() }, ...prev]);
    };

    const addMaintenanceRecord = (machineId: string, issue: string, resolution: string) => {
        setMaintenanceHistory(prev => [{ machineId, issue, resolution, timestamp: new Date() }, ...prev]);
    };

    const toggleAdjustment = (machineId: string, isStarting: boolean, observation?: string) => {
        const machine = machines.find(m => m.id === machineId);
        if (isStarting) {
            updateMachineStatus(machineId, "Adjustment");
            setAdjustmentLogs(prev => [{ machineId, op: machine?.op || "-", startTime: new Date() }, ...prev]);
        } else {
            updateMachineStatus(machineId, "Running");
            setAdjustmentLogs(prev => prev.map(log =>
                log.machineId === machineId && !log.endTime
                    ? { ...log, endTime: new Date(), observation }
                    : log
            ));
        }
    };

    const updateSolutions = (category: string, newSolutions: string[]) => {
        setSolutions(prev => ({ ...prev, [category]: newSolutions }));
    };

    const addItem = (item: any) => {
        setItems(prev => [...prev, item]);
    };

    const addKnowledgeEntry = (entry: KnowledgeBaseEntry) => {
        setKnowledgeBase(prev => [...prev, entry]);
    };

    const login = (pin: string, requestedRole: UserRole) => {
        if (requestedRole === "OPERATOR") {
            setIsAuthorized(true);
            setRole("OPERATOR");
            return true;
        }

        const isValid = pin === MASTER_PIN || preparers.some(p => p.pin === pin);
        if (isValid) {
            setIsAuthorized(true);
            setRole(requestedRole);
        }
        return isValid;
    };

    const logout = () => {
        setIsAuthorized(false);
        setRole("OPERATOR");
    };

    const addPreparer = (name: string, pin: string) => {
        setPreparers(prev => [...prev, { id: Math.random().toString(36), name, pin }]);
    };

    const updatePreparerPin = (id: string, newPin: string) => {
        setPreparers(prev => prev.map(p => p.id === id ? { ...p, pin: newPin } : p));
    };

    return (
        <AppContext.Provider value={{
            role, setRole, machines, updateMachineStatus, updateMachineData,
            maintenanceHistory, addMaintenanceRecord, history, addHistoryEntry,
            toggleAdjustment, adjustmentLogs, solutions, updateSolutions,
            items, addItem, knowledgeBase, addKnowledgeEntry,
            isAuthorized, preparers, login, logout, addPreparer, updatePreparerPin
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
}
