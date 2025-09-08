"use client"
import React from "react"
import { RefreshCw } from "lucide-react"

export default function Loading({ title = "" }: { title?: string }) {
    return (
        <div className="flex items-center justify-center h-80">
            <div className="flex items-center gap-2">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span>{title}</span>
            </div>
        </div>
    )
}