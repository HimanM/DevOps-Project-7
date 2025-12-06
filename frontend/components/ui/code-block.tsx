"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    className?: string;
}

export function CodeBlock({ code, language = "bash", title, className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("overflow-hidden rounded-lg border border-white/10 bg-black/40", className)}>
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
                <div className="flex items-center gap-2">
                    {language === "bash" && <Terminal className="h-4 w-4 text-blue-400" />}
                    <span className="text-xs font-medium text-gray-400">{title || language}</span>
                </div>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-xs text-gray-400 hover:bg-white/10 hover:text-white"
                >
                    {copied ? (
                        <>
                            <Check className="h-3 w-3 text-green-400" />
                            <span className="text-green-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-sm text-gray-300">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
