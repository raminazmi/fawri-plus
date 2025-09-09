"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SubscriptionsPage } from "@/components/subscriptions-page"
import { ProtectedRoute } from "@/components/protected-route"

export default function Subscriptions() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="subscriptions">
        <SubscriptionsPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
