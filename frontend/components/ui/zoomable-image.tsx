"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface ZoomableImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const modal = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute right-6 top-6 z-[10000] rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-8 w-8" />
                    </button>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative h-full w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            width={1920}
                            height={1080}
                            className="max-h-full max-w-full object-contain"
                            quality={100}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <div
                className={cn("group relative cursor-zoom-in overflow-hidden rounded-lg border border-white/10 bg-black/50 max-h-[300px] md:max-h-none", className)}
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={600}
                    className={cn("h-auto w-full transition-transform duration-500 group-hover:scale-105", className)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
                        <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                </div>
            </div>
            {mounted ? createPortal(modal, document.body) : null}
        </>
    );
}
