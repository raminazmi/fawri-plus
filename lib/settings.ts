export interface HubLocation {
  id: string
  name: string
  phone: string
  location: {
    lat: number
    lng: number
    address: string
  }
  address: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AppSettings {
  shipdayApiKey: string
  defaultHubId: string
  timezone: string
  language: "ar" | "en"
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

// Mock data for demonstration
const mockHubs: HubLocation[] = [
  {
    id: "1",
    name: "المركز الرئيسي",
    phone: "+973-1234-5678",
    location: {
      lat: 26.2285,
      lng: 50.586,
      address: "المنامة، البحرين",
    },
    address: "شارع الملك فيصل، المنامة",
    isDefault: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

let mockSettings: AppSettings = {
  shipdayApiKey: "HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa",
  defaultHubId: "1",
  timezone: "Asia/Bahrain",
  language: "ar",
  notifications: {
    email: true,
    sms: true,
    push: true,
  },
}

export const getHubs = async (): Promise<HubLocation[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...mockHubs]
}

export const getHubById = async (id: string): Promise<HubLocation | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockHubs.find((hub) => hub.id === id) || null
}

export const createHub = async (hubData: Omit<HubLocation, "id" | "createdAt" | "updatedAt">): Promise<HubLocation> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newHub: HubLocation = {
    ...hubData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockHubs.push(newHub)
  return newHub
}

export const updateHub = async (id: string, hubData: Partial<HubLocation>): Promise<HubLocation | null> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const hubIndex = mockHubs.findIndex((hub) => hub.id === id)
  if (hubIndex === -1) return null

  mockHubs[hubIndex] = {
    ...mockHubs[hubIndex],
    ...hubData,
    updatedAt: new Date(),
  }

  return mockHubs[hubIndex]
}

export const deleteHub = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const hubIndex = mockHubs.findIndex((hub) => hub.id === id)
  if (hubIndex === -1) return false

  mockHubs.splice(hubIndex, 1)
  return true
}

export const getSettings = async (): Promise<AppSettings> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("shipday-settings")
    if (stored) {
      return JSON.parse(stored)
    }
  }

  return { ...mockSettings }
}

export const updateSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  mockSettings = { ...mockSettings, ...settings }

  if (typeof window !== "undefined") {
    localStorage.setItem("shipday-settings", JSON.stringify(mockSettings))
  }

  return { ...mockSettings }
}
