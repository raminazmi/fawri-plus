"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SubscriptionsPage } from "@/components/subscriptions-page"

export default function Subscriptions() {
  return (
    <DashboardLayout currentPage="subscriptions">
      <SubscriptionsPage />
    </DashboardLayout>
  )
}
