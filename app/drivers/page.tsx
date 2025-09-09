"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DriversListPage } from "@/components/drivers-list-page"
import { ProtectedRoute } from "@/components/protected-route"

export default function Drivers() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="drivers">
        <DriversListPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
