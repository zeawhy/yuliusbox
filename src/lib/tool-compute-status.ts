"use client";

import { useEffect, useState } from "react";

export type ComputeStatus = "idle" | "loading" | "ready";

type Listener = (status: ComputeStatus) => void;

const listeners = new Map<string, Set<Listener>>();
const statuses = new Map<string, ComputeStatus>();

export function setToolComputeStatus(toolId: string, status: ComputeStatus) {
    statuses.set(toolId, status);
    const set = listeners.get(toolId);
    if (set) {
        set.forEach((listener) => listener(status));
    }
}

export function getToolComputeStatus(toolId: string): ComputeStatus {
    return statuses.get(toolId) ?? "idle";
}

export function subscribeToolComputeStatus(toolId: string, listener: Listener): () => void {
    if (!listeners.has(toolId)) {
        listeners.set(toolId, new Set());
    }
    listeners.get(toolId)!.add(listener);
    return () => {
        listeners.get(toolId)?.delete(listener);
    };
}

export function useToolComputeStatus(toolId?: string, fallback: ComputeStatus = "idle"): ComputeStatus {
    const [status, setStatus] = useState<ComputeStatus>(() => (toolId ? getToolComputeStatus(toolId) : fallback));

    useEffect(() => {
        if (!toolId) return;
        setStatus(getToolComputeStatus(toolId));
        return subscribeToolComputeStatus(toolId, setStatus);
    }, [toolId]);

    return toolId ? status : fallback;
}
