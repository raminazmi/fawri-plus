"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersPage } from "@/components/orders-page"
import { ProtectedRoute } from "@/components/protected-route"

export default function Orders() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="orders">
        <OrdersPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
