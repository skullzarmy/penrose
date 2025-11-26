'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, Trophy, Twitter, X, Copy, Check } from "lucide-react";

export function SupportDialog({ isOpen, onClose }) {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
        }
    }, [isOpen]);

    if (!isOpen && !mounted) return null;

    const nftLink =
        "https://objkt.com/collections/KT1E3x81Hn983jSFN1a5hfpa1RRVBemKJTKK?ref=tz1ZzSmVcnVaWNZKJradtrDnjSjzTp6qjTEW";
    const formLink = "https://tezoscommons.typeform.com/to/cBeP4RnI?typeform-source=penrose";
    const socialLink = "https://x.com/fafo_lab";
    const tweetText = encodeURIComponent(
        "I just used PenRose (https://penrose.fafolab.xyz) by @fafo_lab and loved it! #tezosCRP"
    );
    const tweetLink = `https://x.com/intent/tweet?text=${tweetText}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText("https://penrose.fafolab.xyz");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <button
                type="button"
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
                aria-label="Close dialog"
            />

            {/* Dialog */}
            <div
                className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg transition-all duration-300 ${
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
                <div className="bg-background border-2 border-border rounded-lg shadow-2xl p-6 mx-4 text-foreground">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {"Your code is ready!"}
                                </h2>
                                <p className="text-sm text-muted-foreground">{"Copied to clipboard"}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 mb-6">
                        <p>
                            {"Enjoyed using "}
                            <span className="font-semibold text-primary">{"PenRose"}</span>
                            {" and other free tools from FAFO"}
                            <span className="line-through">{"lab"}</span>
                            {"?"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {"Support "}
                            <span className="font-medium">
                                {"FAFO"}
                                <span className="line-through">{"lab"}</span>
                            </span>
                            {" and help us build more awesome tools for the community!"}
                        </p>
                    </div>

                    {/* Support Options */}
                    <div className="space-y-3">
                        <Button
                            onClick={() => window.open(nftLink, "_blank")}
                            className="w-full justify-start h-auto py-3 bg-card border-border hover:bg-accent text-foreground"
                            variant="outline"
                        >
                            <div className="flex items-start gap-3 text-left w-full min-w-0">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <Heart className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold mb-1">
                                        {"Collect Our 3D Button Pins"}
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-normal wrap-break-word">
                                        {"White & Platinum editions • Future benefits for holders 😉"}
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                            </div>
                        </Button>

                        <Button
                            onClick={() => window.open(formLink, "_blank")}
                            className="w-full justify-start h-auto py-3 bg-card border-border hover:bg-accent text-foreground"
                            variant="outline"
                        >
                            <div className="flex items-start gap-3 text-left w-full">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <Trophy className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold mb-1">
                                        {"Nominate Us for CRP Award"}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2 whitespace-normal wrap-break-word">
                                        {"Submit us for Tezos Community Rewards Program"}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyLink();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleCopyLink();
                                                }
                                            }}
                                            className="flex items-center gap-1.5 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 rounded text-foreground transition-colors cursor-pointer"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-3 h-3" />
                                                    {"Copied!"}
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    {"Copy our link"}
                                                </>
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono truncate">
                                            {socialLink}
                                        </span>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                            </div>
                        </Button>

                        <Button
                            onClick={() => window.open(tweetLink, "_blank")}
                            className="w-full justify-start h-auto py-3 bg-card border-border hover:bg-accent text-foreground"
                            variant="outline"
                        >
                            <div className="flex items-start gap-3 text-left w-full min-w-0">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <Twitter className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold mb-1">{"Share on X (Twitter)"}</div>
                                    <div className="text-xs text-muted-foreground whitespace-normal wrap-break-word">
                                        {"Tweet about your experience with PenRose"}
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                            </div>
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <Button onClick={onClose} variant="ghost" className="w-full text-muted-foreground hover:text-foreground hover:bg-accent">
                            {"Maybe Later"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
