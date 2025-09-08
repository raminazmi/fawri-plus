"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DriversListPage } from "@/components/drivers-list-page"

export default function Drivers() {
  return (
    <DashboardLayout currentPage="drivers">
      <DriversListPage />
    </DashboardLayout>
  )
}
