"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-baseline gap-1 ${className}`}>
      <div className="relative w-8 h-8">
        <Image
          src="/placeholder-logo.svg"
          alt="Dashflow Logo"
          fill
          className="object-contain"
        />
      </div>
      <span className="text-xl font-extrabold tracking-tight text-[#272626]">
        Dashflow
      </span>
    </Link>
  )
}