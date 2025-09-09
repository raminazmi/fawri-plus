"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BillingPage } from "@/components/billing-page"
import { ProtectedRoute } from "@/components/protected-route"

export default function Billing() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="billing">
        <BillingPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
