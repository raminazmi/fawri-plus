"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportsPage } from "@/components/reports-page"

export default function Reports() {
  return (
    <DashboardLayout currentPage="reports">
      <ReportsPage />
    </DashboardLayout>
  )
}
