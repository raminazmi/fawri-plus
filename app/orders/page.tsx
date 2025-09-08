"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersPage } from "@/components/orders-page"

export default function Orders() {
  return (
    <DashboardLayout currentPage="orders">
      <OrdersPage />
    </DashboardLayout>
  )
}
