"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export interface HandoffItem {
    blob: Blob;
    name: string;
    type?: string;
}

interface StoredHandoffRecord {
    id: string;
    timestamp: number;
    items: Array<{
        blob: Blob;
        name: string;
        type: string;
    }>;
}

const DB_NAME = "yuliusbox_handoff_db";
const STORE_NAME = "handoffs";
const DB_VERSION = 1;
const TTL_MS = 10 * 60 * 1000; // 10 minutes

function openHandoffDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !("indexedDB" in window)) {
            return reject(new Error("IndexedDB is not supported in this environment"));
        }
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Failed to open handoff IndexedDB"));
    });
}

/**
 * Save one or more files/Blobs into client-side IndexedDB for one-time handoff.
 * Returns an unguessable one-time ID to pass via ?handoff=<id>.
 */
export async function saveHandoff(
    items: HandoffItem | HandoffItem[]
): Promise<string> {
    const arr = Array.isArray(items) ? items : [items];
    if (arr.length === 0) throw new Error("No files to handoff");

    const id = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    const record: StoredHandoffRecord = {
        id,
        timestamp: Date.now(),
        items: arr.map((item) => ({
            blob: item.blob,
            name: item.name || "file",
            type: item.type || item.blob.type || "application/octet-stream",
        })),
    };

    const db = await openHandoffDB();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);

        // Delete expired entries while writing
        const now = Date.now();
        const cursorReq = store.openCursor();
        cursorReq.onsuccess = () => {
            const cursor = cursorReq.result;
            if (cursor) {
                const val = cursor.value as StoredHandoffRecord;
                if (now - val.timestamp > TTL_MS) {
                    cursor.delete();
                }
                cursor.continue();
            }
        };

        store.put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });

    return id;
}

/**
 * Consumes a handoff record by ID.
 * Immediately deletes the record from IndexedDB (single-use guarantee).
 * Returns null if not found, expired, or on failure.
 */
export async function consumeHandoff(id: string): Promise<File[] | null> {
    if (!id) return null;
    try {
        const db = await openHandoffDB();
        const record = await new Promise<StoredHandoffRecord | null>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const getReq = store.get(id);

            getReq.onsuccess = () => {
                const res = getReq.result as StoredHandoffRecord | undefined;
                if (res) {
                    // Delete immediately
                    store.delete(id);
                    resolve(res);
                } else {
                    resolve(null);
                }
            };
            getReq.onerror = () => reject(getReq.error);
        });

        if (!record) return null;

        // Check 10-minute expiration
        if (Date.now() - record.timestamp > TTL_MS) {
            return null;
        }

        // Convert Blobs back to Files
        return record.items.map(
            (item) => new File([item.blob], item.name, { type: item.type })
        );
    } catch (err) {
        console.warn("Handoff consumption gracefully failed:", err);
        return null;
    }
}

/**
 * Hook to consume handoff files from ?handoff=<id> in the URL.
 * NOTE: Components using this hook MUST be rendered inside a <Suspense> boundary.
 */
export function useHandoffReceiver(onFiles: (files: File[]) => void) {
    const searchParams = useSearchParams();
    const handoffId = searchParams.get("handoff");
    const consumedRef = useRef<string | null>(null);

    useEffect(() => {
        if (!handoffId || consumedRef.current === handoffId) return;
        consumedRef.current = handoffId;

        let isMounted = true;
        consumeHandoff(handoffId).then((files) => {
            if (isMounted && files && files.length > 0) {
                onFiles(files);
                // Clean the handoff query param from URL without triggering reload
                if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("handoff");
                    window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
                }
            }
        });

        return () => {
            isMounted = false;
        };
    }, [handoffId, onFiles]);
}

/**
 * Reusable "Next: ..." Button to handoff files seamlessly to the next tool.
 */
export function HandoffButton({
    targetUrl,
    label,
    getItems,
    className = "",
}: {
    targetUrl: string;
    label: string;
    getItems: () => Promise<HandoffItem | HandoffItem[]> | HandoffItem | HandoffItem[];
    className?: string;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [, startTransition] = useTransition();

    const handleClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const items = await getItems();
            const id = await saveHandoff(items);
            const sep = targetUrl.includes("?") ? "&" : "?";
            const dest = `${targetUrl}${sep}handoff=${id}`;
            startTransition(() => {
                router.push(dest);
            });
        } catch (err) {
            console.error("Handoff failed:", err);
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 disabled:opacity-50 cursor-pointer ${className}`.trim()}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing...</span>
                </>
            ) : (
                <>
                    <span>Next: {label}</span>
                    <ArrowRight className="w-4 h-4" />
                </>
            )}
        </button>
    );
}
