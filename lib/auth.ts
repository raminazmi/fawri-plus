export type UserRole = "admin" | "manager"

export interface User {
  id: string
  username: string
  role: UserRole
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
let realUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: {
      id: "1",
      username: "admin",
      role: "admin",
      createdAt: new Date(),
    },
  },
  manager: {
    password: "manager123",
    user: {
      id: "2",
      username: "وجد ",
      role: "manager",
      createdAt: new Date(),
    },
  },
  "test1@fawri-plus.com": {
    password: "Husa!nFawr1",
    user: {
      id: "3",
      username: "test1@fawri-plus.com",
      role: "admin",
      createdAt: new Date(),
    },
  },
}
export const addUserToAuth = (userData: { id: string; username: string; email: string; password: string; role: UserRole; createdAt: Date }) => {
  realUsers[userData.username] = {
    password: userData.password,
    user: {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      createdAt: userData.createdAt,
    },
  }
  realUsers[userData.email] = {
    password: userData.password,
    user: {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      createdAt: userData.createdAt,
    },
  }
}

export const updateUserInAuth = (oldUsername: string, oldEmail: string, userData: { id: string; username: string; email: string; password?: string; role: UserRole; createdAt: Date }) => {
  delete realUsers[oldUsername]
  delete realUsers[oldEmail]
    const password = userData.password || realUsers[oldUsername]?.password || "defaultPassword123"
  realUsers[userData.username] = {
    password,
    user: {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      createdAt: userData.createdAt,
    },
  }
  realUsers[userData.email] = {
    password,
    user: {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      createdAt: userData.createdAt,
    },
  }
}

export const deleteUserFromAuth = (username: string, email: string) => {
  delete realUsers[username]
  delete realUsers[email]
}

export const authenticate = async (email: string, password: string): Promise<{user: User, token: string} | null> => {
  try {
    const response = await fetch("https://backend.fawri-plus.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        device_name: "web-app"
      }),
    })

    if (response.ok) {
      const data = await response.json()
            const user = {
        id: data.user.id.toString(),
        username: data.user.name || data.user.email,
        role: data.user.role || "manager", // Default role if not provided
        createdAt: new Date()
      }
      
      return {
        user,
        token: data.token
      }
    }
    
    return null
  } catch (error) {
    return null
  }
}

export const hasPermission = (user: User | null, action: string): boolean => {
  if (!user) return false
  if (user.role === "admin") return true
  if (user.role === "manager") {
    const restrictedActions = ["delete", "add_user", "change_permissions"]
    return !restrictedActions.some((restricted) => action.includes(restricted))
  }

  return false
}
