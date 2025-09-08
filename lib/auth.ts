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

// Real users storage - will be synchronized with users.ts
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

// Add user to authentication system
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
  // Also allow login with email
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

// Update user in authentication system
export const updateUserInAuth = (oldUsername: string, oldEmail: string, userData: { id: string; username: string; email: string; password?: string; role: UserRole; createdAt: Date }) => {
  // Remove old entries
  delete realUsers[oldUsername]
  delete realUsers[oldEmail]
  
  // Add updated entries
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

// Delete user from authentication system
export const deleteUserFromAuth = (username: string, email: string) => {
  delete realUsers[username]
  delete realUsers[email]
}

export const authenticate = async (email: string, password: string): Promise<{user: User, token: string} | null> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
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
      
      // Map the external API response to our User interface
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
    console.error("Authentication error:", error)
    return null
  }
}

export const hasPermission = (user: User | null, action: string): boolean => {
  if (!user) return false

  // Admin has all permissions
  if (user.role === "admin") return true

  // Manager permissions - cannot delete data, add users, or change permissions
  if (user.role === "manager") {
    const restrictedActions = ["delete", "add_user", "change_permissions"]
    return !restrictedActions.some((restricted) => action.includes(restricted))
  }

  return false
}
