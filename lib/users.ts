import { User, UserRole, addUserToAuth, updateUserInAuth, deleteUserFromAuth } from "@/lib/auth"

export interface UserData {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: Date
  password?: string
}

// Real users database - stores actual user data with passwords
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

// Get all users
export const getUsers = async (): Promise<UserData[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return realUsersData.map(user => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })
}

// Get user by ID
export const getUserById = async (id: string): Promise<UserData | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  const user = realUsersData.find(u => u.id === id)
  if (!user) return null
  
  // Never return password
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Add new user
export const addUser = async (userData: Omit<UserData, "id" | "createdAt"> & { password: string }): Promise<UserData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  // Check if username already exists
  if (realUsersData.some(u => u.username === userData.username)) {
    throw new Error("اسم المستخدم موجود بالفعل")
  }
  
  // Check if email already exists
  if (realUsersData.some(u => u.email === userData.email)) {
    throw new Error("البريد الإلكتروني موجود بالفعل")
  }
  
  const newUser = {
    ...userData,
    id: String(realUsersData.length + 1),
    createdAt: new Date(),
  }
  
  // Add to users database
  realUsersData.push(newUser)
  
  // Add to authentication system
  addUserToAuth(newUser)
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Update user
export const updateUser = async (id: string, userData: Partial<Omit<UserData, "id" | "createdAt">> & { password?: string }): Promise<UserData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  const userIndex = realUsersData.findIndex(u => u.id === id)
  if (userIndex === -1) {
    throw new Error("المستخدم غير موجود")
  }
  
  const existingUser = realUsersData[userIndex]
  
  // Check if new username already exists (if username is being changed)
  if (userData.username && userData.username !== existingUser.username) {
    if (realUsersData.some(u => u.username === userData.username && u.id !== id)) {
      throw new Error("اسم المستخدم موجود بالفعل")
    }
  }
  
  // Check if new email already exists (if email is being changed)
  if (userData.email && userData.email !== existingUser.email) {
    if (realUsersData.some(u => u.email === userData.email && u.id !== id)) {
      throw new Error("البريد الإلكتروني موجود بالفعل")
    }
  }
  
  // Update user data
  const updatedUser = {
    ...existingUser,
    ...userData,
    id: existingUser.id, // Keep original ID
    createdAt: existingUser.createdAt, // Keep original creation date
  }
  
  realUsersData[userIndex] = updatedUser
  
  // Update in authentication system
  updateUserInAuth(existingUser.username, existingUser.email, updatedUser)
  
  // Return user without password
  const { password, ...userWithoutPassword } = updatedUser
  return userWithoutPassword
}

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const userIndex = realUsersData.findIndex(u => u.id === id)
  if (userIndex === -1) {
    throw new Error("المستخدم غير موجود")
  }
  
  const user = realUsersData[userIndex]
  
  // Remove from users database
  realUsersData.splice(userIndex, 1)
  
  // Remove from authentication system
  deleteUserFromAuth(user.username, user.email)
}