"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsPage } from "@/components/settings-page"

export default function Settings() {
  return (
    <DashboardLayout currentPage="settings">
      <SettingsPage />
    </DashboardLayout>
  )
}
