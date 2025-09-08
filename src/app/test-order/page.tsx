"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TestOrderCreation } from "@/components/test-order-creation"

export default function TestOrderPage() {
  return (
    <DashboardLayout currentPage="test-order">
      <TestOrderCreation />
    </DashboardLayout>
  )
}
