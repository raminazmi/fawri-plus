"use client"

import { SettingsPage } from "@/components/settings-page"
import { ProtectedRoute } from "@/components/protected-route"

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  )
}