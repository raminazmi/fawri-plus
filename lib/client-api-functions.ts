import { Client, CreateClientRequest, UpdateClientRequest } from "./types"
export type { CreateClientRequest, UpdateClientRequest }
export const fetchClients = async (): Promise<Client[]> => {
  try {    
    const token = localStorage.getItem("auth_token")
    
    const response = await fetch("/api/clients", {
      headers: {
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    })    
    if (!response.ok) {
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
    return data
  } catch (error) {
    throw error
  }
}

export const updateClient = async (id: number, clientData: UpdateClientRequest): Promise<Client> => {
  try {
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
    return data
  } catch (error) {
    throw error
  }
}

export const deleteClient = async (id: number): Promise<void> => {
  try {
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
      } catch (error) {
    throw error
  }
}
