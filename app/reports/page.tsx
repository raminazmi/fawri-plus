"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportsPage } from "@/components/reports-page"
import { ProtectedRoute } from "@/components/protected-route"

export default function Reports() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="reports">
        <ReportsPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
