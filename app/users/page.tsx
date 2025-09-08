"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UsersPage } from "@/components/users-page"

export default function Users() {
  return (
    <DashboardLayout currentPage="users">
      <UsersPage />
    </DashboardLayout>
  )
}
