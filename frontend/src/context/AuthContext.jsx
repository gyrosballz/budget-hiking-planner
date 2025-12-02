import { createContext, useContext, useState } from 'react'
const AuthContext = createContext()
export function AuthProvider({children}){
  const [role, setRole] = useState(localStorage.getItem('role')||'user')
  function setRoleAndSave(r){ setRole(r); localStorage.setItem('role', r) }
  return <AuthContext.Provider value={{role, setRole:setRoleAndSave}}>{children}</AuthContext.Provider>
}
export function useAuth(){ return useContext(AuthContext) }
