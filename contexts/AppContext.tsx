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
    { id: "TNL 028", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 007", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 008", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 003", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 031", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 032", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 004", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 143", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 049", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 050", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 051", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 017", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 013", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 016", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
    { id: "TNL 018", item: "-", op: "-", cycleTime: "-", pieces: 0, totalTarget: 0, status: "Offline", particularities: "" },
];

const INITIAL_SOLUTIONS: Record<string, string[]> = {
    "Dimensional": ["Ajustar corretor de ferramenta", "Trocar inserto de acabamento", "Verificar folga no fuso"],
    "Acabamento": ["Trocar ferramenta de corte", "Aumentar velocidade de corte (Vc)", "Limpar cavacos acumulados"],
    "Processo": ["Revisar programa CNC", "Ajustar pressão da pinça", "Conferir centralização da peça"]
};

export interface Item {
    id: string;
    name: string;
    drawingUrl?: string; // Legacy/Reference
    setupImageUrl?: string; // Legacy/Reference
    drawingData?: string; // Base64
    photoData?: string; // Base64
}

const INITIAL_ITEMS: Item[] = [
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
    items: Item[];
    addItem: (item: Item) => void;
    removeItem: (id: string) => void;
    knowledgeBase: KnowledgeBaseEntry[];
    addKnowledgeEntry: (entry: KnowledgeBaseEntry) => void;
    // Auth & Users
    isAuthorized: boolean;
    loading: boolean;
    preparers: Array<{ id: string; name: string; pin: string }>;
    login: (pin: string, requestedRole: UserRole) => boolean;
    logout: () => void;
    addPreparer: (name: string, pin: string) => void;
    updatePreparerPin: (id: string, newPin: string) => void;
    resetSystem: () => void;
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
    const [loading, setLoading] = useState(true);
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

        const savedRole = localStorage.getItem("neo_role");
        if (savedRole) setRole(savedRole as UserRole);

        const savedAuth = localStorage.getItem("neo_isAuthorized");
        if (savedAuth) setIsAuthorized(JSON.parse(savedAuth));

        setLoading(false);
    }, []);

    useEffect(() => {
        if (loading) return; // Don't overwrite during initial load
        localStorage.setItem("neo_machines", JSON.stringify(machines));
        localStorage.setItem("neo_preparers", JSON.stringify(preparers));
        localStorage.setItem("neo_history", JSON.stringify(history));
        localStorage.setItem("neo_maint_history", JSON.stringify(maintenanceHistory));
        localStorage.setItem("neo_adj_logs", JSON.stringify(adjustmentLogs));
        localStorage.setItem("neo_solutions", JSON.stringify(solutions));
        localStorage.setItem("neo_items", JSON.stringify(items));
        localStorage.setItem("neo_kb", JSON.stringify(knowledgeBase));
        localStorage.setItem("neo_role", role);
        localStorage.setItem("neo_isAuthorized", JSON.stringify(isAuthorized));
    }, [machines, preparers, history, maintenanceHistory, adjustmentLogs, solutions, items, knowledgeBase, role, isAuthorized, loading]);

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
            updateMachineData(machineId, { pieces: 0 }); // Clean pieces for new OP
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

    const addItem = (item: Item) => {
        setItems(prev => [...prev, item]);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(it => it.id !== id));
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
            localStorage.setItem("neo_isAuthorized", "true");
            localStorage.setItem("neo_role", requestedRole);
        }
        return isValid;
    };

    const logout = () => {
        setIsAuthorized(false);
        setRole("OPERATOR");
        localStorage.setItem("neo_isAuthorized", "false");
        localStorage.setItem("neo_role", "OPERATOR");
    };

    const addPreparer = (name: string, pin: string) => {
        setPreparers(prev => [...prev, { id: Math.random().toString(36), name, pin }]);
    };

    const updatePreparerPin = (id: string, newPin: string) => {
        setPreparers(prev => prev.map(p => p.id === id ? { ...p, pin: newPin } : p));
    };

    const resetSystem = () => {
        setMachines(INITIAL_MACHINES);
        setHistory([]);
        setMaintenanceHistory([]);
        setAdjustmentLogs([]);
        // Force immediate persistence of the reset state
        localStorage.removeItem("neo_machines");
        localStorage.removeItem("neo_history");
        localStorage.removeItem("neo_maint_history");
        localStorage.removeItem("neo_adj_logs");
        window.location.reload(); // Refresh to clean everything
    };

    return (
        <AppContext.Provider value={{
            role, setRole, machines, updateMachineStatus, updateMachineData,
            maintenanceHistory, addMaintenanceRecord, history, addHistoryEntry,
            toggleAdjustment, adjustmentLogs, solutions, updateSolutions,
            items, addItem, removeItem, knowledgeBase, addKnowledgeEntry,
            isAuthorized, loading, preparers, login, logout, addPreparer, updatePreparerPin,
            resetSystem
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
