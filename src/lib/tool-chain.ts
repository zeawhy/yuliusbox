export interface ChainFile {
    blob: Blob;
    name: string;
}

const store = new Map<string, ChainFile>();

/**
 * Stores a file in module-level memory and returns a one-time chainId.
 */
export function putChainFile(file: ChainFile): string {
    const chainId = crypto.randomUUID();
    store.set(chainId, file);
    return chainId;
}

/**
 * Retrieves and immediately deletes the file associated with chainId.
 * Returns null if not found or already consumed.
 */
export function takeChainFile(chainId: string): ChainFile | null {
    const file = store.get(chainId);
    if (file) {
        store.delete(chainId);
        return file;
    }
    return null;
}
