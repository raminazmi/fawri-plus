import { Client, CreateClientRequest, UpdateClientRequest } from "./types"

// Re-export types for convenience
export type { CreateClientRequest, UpdateClientRequest }

export const fetchClients = async (): Promise<Client[]> => {
  try {
    console.log("[Client API] Fetching clients from /api/clients")
    
    // Get token from localStorage
    const token = localStorage.getItem("auth_token")
    
    const response = await fetch("/api/clients", {
      headers: {
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    })
    console.log("[Client API] Response status:", response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log("[Client API] Received data:", data)
    
    return data.clients || []
  } catch (error) {
    console.error("[Client API] Error fetching clients:", error)
    throw error
  }
}

export const createClient = async (clientData: CreateClientRequest): Promise<Client> => {
  try {
    console.log("[Client API] Creating client:", clientData)
    
    // Get token from localStorage
    const token = localStorage.getItem("auth_token")
    
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
      body: JSON.stringify(clientData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create client")
    }
    
    const data = await response.json()
    console.log("[Client API] Client created successfully:", data)
    return data
  } catch (error) {
    console.error("[Client API] Error creating client:", error)
    throw error
  }
}

export const updateClient = async (id: number, clientData: UpdateClientRequest): Promise<Client> => {
  try {
    console.log("[Client API] Updating client:", id, clientData)
    
    // Get token from localStorage
    const token = localStorage.getItem("auth_token")
    
    const response = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
      body: JSON.stringify(clientData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update client")
    }
    
    const data = await response.json()
    console.log("[Client API] Client updated successfully:", data)
    return data
  } catch (error) {
    console.error("[Client API] Error updating client:", error)
    throw error
  }
}

export const deleteClient = async (id: number): Promise<void> => {
  try {
    console.log("[Client API] Deleting client:", id)
    
    // Get token from localStorage
    const token = localStorage.getItem("auth_token")
    
    const response = await fetch(`/api/clients/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete client")
    }
    
    console.log("[Client API] Client deleted successfully")
  } catch (error) {
    console.error("[Client API] Error deleting client:", error)
    throw error
  }
}
