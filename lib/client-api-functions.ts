import { Client, CreateClientRequest, UpdateClientRequest } from "./types"
export type { CreateClientRequest, UpdateClientRequest }
export const fetchClients = async (): Promise<Client[]> => {
  try {    
    const token = localStorage.getItem("auth_token")
    
    if (!token) {
      throw new Error("Authentication required. Please login first.")
    }
    
    const response = await fetch("/api/clients", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })    
    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        throw new Error("Session expired. Please login again.")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.clients || []
  } catch (error) {
    throw error
  }
}

export const createClient = async (clientData: CreateClientRequest): Promise<Client> => {
  try {
    const token = localStorage.getItem("auth_token")
    
    if (!token) {
      throw new Error("Authentication required. Please login first.")
    }
    
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        throw new Error("Session expired. Please login again.")
      }
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create client")
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

export const updateClient = async (id: number, clientData: UpdateClientRequest): Promise<Client> => {
  try {
    const token = localStorage.getItem("auth_token")
    
    if (!token) {
      throw new Error("Authentication required. Please login first.")
    }
    
    const response = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        throw new Error("Session expired. Please login again.")
      }
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update client")
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

export const deleteClient = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem("auth_token")
    
    if (!token) {
      throw new Error("Authentication required. Please login first.")
    }
    
    const response = await fetch(`/api/clients/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        throw new Error("Session expired. Please login again.")
      }
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete client")
    }
  } catch (error) {
    throw error
  }
}
