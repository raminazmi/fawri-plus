"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BillingPage } from "@/components/billing-page"

export default function Billing() {
  return (
    <DashboardLayout currentPage="billing">
      <BillingPage />
    </DashboardLayout>
  )
}
