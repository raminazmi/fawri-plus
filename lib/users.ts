import { User, UserRole, addUserToAuth, updateUserInAuth, deleteUserFromAuth } from "@/lib/auth"

export interface UserData {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: Date
  password?: string
}

let realUsersData: (UserData & { password: string })[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date(),
    password: "admin123",
  },
  {
    id: "2",
    username: "manager",
    email: "manager@example.com",
    role: "manager",
    createdAt: new Date(),
    password: "manager123",
  },
]

export const getUsers = async (): Promise<UserData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return realUsersData.map(user => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })
}

export const getUserById = async (id: string): Promise<UserData | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const user = realUsersData.find(u => u.id === id)
  if (!user) return null
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

export const addUser = async (userData: Omit<UserData, "id" | "createdAt"> & { password: string }): Promise<UserData> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
    if (realUsersData.some(u => u.username === userData.username)) {
    throw new Error("اسم المستخدم موجود بالفعل")
  }
  
  if (realUsersData.some(u => u.email === userData.email)) {
    throw new Error("البريد الإلكتروني موجود بالفعل")
  }
  
  const newUser = {
    ...userData,
    id: String(realUsersData.length + 1),
    createdAt: new Date(),
  }
  
  realUsersData.push(newUser)
  addUserToAuth(newUser)

  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export const updateUser = async (id: string, userData: Partial<Omit<UserData, "id" | "createdAt">> & { password?: string }): Promise<UserData> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  const userIndex = realUsersData.findIndex(u => u.id === id)
  if (userIndex === -1) {
    throw new Error("المستخدم غير موجود")
  }
  
  const existingUser = realUsersData[userIndex]
  if (userData.username && userData.username !== existingUser.username) {
    if (realUsersData.some(u => u.username === userData.username && u.id !== id)) {
      throw new Error("اسم المستخدم موجود بالفعل")
    }
  }
  
  if (userData.email && userData.email !== existingUser.email) {
    if (realUsersData.some(u => u.email === userData.email && u.id !== id)) {
      throw new Error("البريد الإلكتروني موجود بالفعل")
    }
  }
  
  const updatedUser = {
    ...existingUser,
    ...userData,
    id: existingUser.id,
    createdAt: existingUser.createdAt,
  }
  
  realUsersData[userIndex] = updatedUser
  updateUserInAuth(existingUser.username, existingUser.email, updatedUser)
  const { password, ...userWithoutPassword } = updatedUser
  return userWithoutPassword
}

export const deleteUser = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const userIndex = realUsersData.findIndex(u => u.id === id)
  if (userIndex === -1) {
    throw new Error("المستخدم غير موجود")
  }
  const user = realUsersData[userIndex]
  realUsersData.splice(userIndex, 1)
  deleteUserFromAuth(user.username, user.email)
}