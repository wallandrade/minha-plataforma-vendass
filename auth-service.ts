import { storage } from "./storage";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  supabaseId: string;
  isAdmin: boolean;
  storeId: number;
}

export async function authenticateUser(loginRequest: LoginRequest): Promise<AuthUser | null> {
  const { email, password } = loginRequest;
  
  if (!email || !password) {
    return null;
  }
  
  // Try admin user first
  const adminUser = await storage.getUserByEmail(email);
  if (adminUser) {
    return {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      supabaseId: adminUser.supabaseId,
      isAdmin: adminUser.isAdmin,
      storeId: adminUser.storeId || 1
    };
  }
  
  // Try direct seller authentication using exact database query
  try {
    // Buscar vendedores diretamente do banco
    const sellers = await storage.getSellersByStore(1);
    
    // Verificar cada vendedor
    for (const seller of sellers) {
      // Comparação exata de string
      if (seller.email.trim() === email.trim() && seller.password?.trim() === password.trim()) {
        return {
          id: seller.id,
          email: seller.email,
          name: seller.name,
          supabaseId: `seller_${seller.id}`,
          isAdmin: seller.role === 'admin',
          storeId: seller.storeId || 1
        };
      }
    }
  } catch (error) {
    console.error('Erro na autenticação de vendedor:', error);
  }
  
  return null;
}