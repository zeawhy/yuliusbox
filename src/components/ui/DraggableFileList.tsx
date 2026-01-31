"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { FileText, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFFile {
    id: string;
    file: File;
}

interface DraggableFileListProps {
    files: PDFFile[];
    onReorder: (files: PDFFile[]) => void;
    onRemove: (id: string) => void;
    labels: {
        dragHandle: string;
        remove: string;
    }
}

export function DraggableFileList({ files, onReorder, onRemove, labels }: DraggableFileListProps) {
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(files);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        onReorder(items);
    };

    if (files.length === 0) return null;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="pdf-files">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3 w-full"
                    >
                        {files.map((fileObj, index) => (
                            <Draggable key={fileObj.id} draggableId={fileObj.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 group select-none transition-colors",
                                            snapshot.isDragging ? "border-indigo-500 bg-zinc-900 shadow-xl z-50 ring-2 ring-indigo-500/20" : "hover:bg-zinc-900"
                                        )}
                                    >
                                        <div
                                            {...provided.dragHandleProps}
                                            className="p-2 text-zinc-600 hover:text-zinc-300 cursor-grab active:cursor-grabbing rounded-lg hover:bg-zinc-800/50 transition-colors"
                                            title={labels.dragHandle}
                                        >
                                            <GripVertical className="w-5 h-5" />
                                        </div>

                                        <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                            <FileText className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-200 truncate">{fileObj.file.name}</p>
                                            <p className="text-xs text-zinc-500">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>

                                        <button
                                            onClick={() => onRemove(fileObj.id)}
                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title={labels.remove}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
