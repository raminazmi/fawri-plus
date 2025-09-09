"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UsersPage } from "@/components/users-page"
import { ProtectedRoute } from "@/components/protected-route"

export default function Users() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="users">
        <UsersPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
