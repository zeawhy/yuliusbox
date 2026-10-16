"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { takeChainFile, type ChainFile } from "./tool-chain";

/**
 * Hook to retrieve a file transferred via tool-chain (?chain=UUID).
 * Consumes the file once from in-memory store and returns it.
 * Note: Components using this hook should be wrapped in a <Suspense> boundary.
 */
export function useChainFile(): ChainFile | null {
    const searchParams = useSearchParams();
    const chainId = searchParams.get("chain");
    const [file, setFile] = useState<ChainFile | null>(null);
    const consumedRef = useRef(false);

    useEffect(() => {
        if (!chainId || consumedRef.current) return;
        consumedRef.current = true;
        const chainFile = takeChainFile(chainId);
        if (chainFile) {
            setFile(chainFile);
        }
    }, [chainId]);

    return file;
}
