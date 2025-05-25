import { users, stores, sellers, products, sales, goals, marketAnalyses, accountsPayable, accountsReceivable, cashFlow, suppliers, customers, badges, sellerAchievements, sellerScores, type User, type Store, type Seller, type Product, type Sale, type Goal, type MarketAnalysis, type AccountsPayable, type AccountsReceivable, type CashFlow, type Supplier, type Customer, type Badge, type SellerAchievement, type SellerScore, type InsertUser, type InsertStore, type InsertSeller, type InsertProduct, type InsertSale, type InsertGoal, type InsertMarketAnalysis, type InsertAccountsPayable, type InsertAccountsReceivable, type InsertCashFlow, type InsertSupplier, type InsertCustomer, type InsertBadge, type InsertSellerAchievement, type InsertSellerScore } from "@shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, desc } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserBySupabaseId(supabaseId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { storeId?: number }): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  
  // Store operations
  getStore(id: number): Promise<Store | undefined>;
  getStoreBySubdomain(subdomain: string): Promise<Store | undefined>;
  createStore(store: InsertStore & { ownerId: number }): Promise<Store>;
  updateStore(id: number, store: Partial<Store>): Promise<Store>;
  updateStoreSubscription(id: number, subscription: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionPlan?: string;
    subscriptionCurrentPeriodEnd?: Date;
  }): Promise<Store>;
  
  // Seller operations
  getSellersByStore(storeId: number): Promise<Seller[]>;
  getSellerByEmail(email: string): Promise<Seller | undefined>;
  createSeller(seller: InsertSeller & { storeId: number }): Promise<Seller>;
  updateSeller(id: number, seller: Partial<Seller>): Promise<Seller>;
  deleteSeller(id: number): Promise<void>;
  
  // Access Control operations
  getSellersWithPermissions(storeId: number): Promise<Seller[]>;
  updateSellerPermissions(sellerId: number, permissions: string[]): Promise<void>;
  getSellerPermissions(sellerId: number): Promise<string[]>;
  
  // Product operations
  getProductsByStore(storeId: number): Promise<Product[]>;
  createProduct(product: InsertProduct & { storeId: number }): Promise<Product>;
  updateProduct(productId: number, storeId: number, productData: Partial<Product>): Promise<Product>;
  deleteProduct(productId: number, storeId: number): Promise<void>;
  
  // Sale operations
  getSalesByStore(storeId: number): Promise<Sale[]>;
  createSale(sale: InsertSale & { storeId: number }): Promise<Sale>;
  updateSale(id: number, sale: Partial<Sale>): Promise<Sale>;
  deleteSale(id: number): Promise<void>;
  
  // Goal operations
  getGoalsByStore(storeId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal & { storeId: number }): Promise<Goal>;
  updateGoal(id: number, goal: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: number): Promise<void>;
  
  // Market Analysis operations
  getMarketAnalysesByStore(storeId: number): Promise<MarketAnalysis[]>;
  createMarketAnalysis(analysis: InsertMarketAnalysis & { storeId: number; averagePrice: number; minPrice: number; maxPrice: number; recommendedPrice: number; marketTrend: string; sources: string[]; recommendations: string[]; confidence: number }): Promise<MarketAnalysis>;
  
  // SISTEMA FINANCEIRO - Contas a Pagar
  getAccountsPayableByStore(storeId: number): Promise<AccountsPayable[]>;
  createAccountsPayable(payable: InsertAccountsPayable & { storeId: number }): Promise<AccountsPayable>;
  updateAccountsPayable(id: number, payable: Partial<AccountsPayable>): Promise<AccountsPayable>;
  deleteAccountsPayable(id: number): Promise<void>;
  
  // SISTEMA FINANCEIRO - Contas a Receber
  getAccountsReceivableByStore(storeId: number): Promise<AccountsReceivable[]>;
  createAccountsReceivable(receivable: InsertAccountsReceivable & { storeId: number }): Promise<AccountsReceivable>;
  updateAccountsReceivable(id: number, receivable: Partial<AccountsReceivable>): Promise<AccountsReceivable>;
  deleteAccountsReceivable(id: number): Promise<void>;
  
  // SISTEMA FINANCEIRO - Fluxo de Caixa
  getCashFlowByStore(storeId: number): Promise<CashFlow[]>;
  createCashFlow(cashFlow: InsertCashFlow & { storeId: number }): Promise<CashFlow>;
  updateCashFlow(id: number, cashFlow: Partial<CashFlow>): Promise<CashFlow>;
  deleteCashFlow(id: number): Promise<void>;
  
  // SISTEMA FINANCEIRO - Fornecedores
  getSuppliersByStore(storeId: number): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier & { storeId: number }): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<Supplier>): Promise<Supplier>;
  deleteSupplier(id: number): Promise<void>;
  
  // SISTEMA FINANCEIRO - Clientes
  getCustomersByStore(storeId: number): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer & { storeId: number }): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;
  
  // SISTEMA FINANCEIRO - Relatórios
  getFinancialReport(storeId: number, startDate: string, endDate: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    pendingReceivables: number;
    pendingPayables: number;
    cashFlowByCategory: { category: string; amount: number; type: 'income' | 'expense' }[];
  }>;
  
  // Dashboard operations
  resetDashboardData(storeId: number): Promise<void>;
  
  // SISTEMA DE GAMIFICAÇÃO - Badges
  getBadges(): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // SISTEMA DE GAMIFICAÇÃO - Conquistas
  getSellerAchievements(storeId: number, sellerId?: number): Promise<SellerAchievement[]>;
  createSellerAchievement(achievement: InsertSellerAchievement): Promise<SellerAchievement>;
  checkAndUnlockBadges(storeId: number, sellerId: number): Promise<SellerAchievement[]>;
  
  // SISTEMA DE GAMIFICAÇÃO - Pontuações e Ranking
  getSellerScores(storeId: number, month?: number, year?: number): Promise<SellerScore[]>;
  updateSellerScore(storeId: number, sellerId: number, month: number, year: number): Promise<SellerScore>;
  getLeaderboard(storeId: number, month: number, year: number): Promise<SellerScore[]>;
  
  // Utility
  getUserCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUserCount(): Promise<number> {
    const result = await db.select().from(users);
    return result.length;
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserBySupabaseId(supabaseId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.supabaseId, supabaseId));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser & { storeId?: number }): Promise<User> {
    console.log("🔧 Criando usuário como ADMINISTRADOR:", user.email);
    
    // White label: TODOS os usuários são admins de suas próprias lojas
    const result = await db.insert(users).values({
      ...user,
      isAdmin: true, // FORÇAR SEMPRE ADMIN
    }).returning();
    
    console.log("✅ Usuário criado com is_admin:", result[0].isAdmin);
    return result[0];
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getStore(id: number): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.id, id));
    return result[0];
  }

  async getStoreBySubdomain(subdomain: string): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.subdomain, subdomain));
    return result[0];
  }

  async createStore(store: InsertStore & { ownerId: number }): Promise<Store> {
    // White label: todas as lojas criadas com 7 dias de teste grátis
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias a partir de agora
    
    const storeData = {
      ...store,
      subscriptionStatus: "trial",
      subscriptionPlan: "trial", 
      trialStartDate: now,
      trialEndDate: trialEndDate
    };
    
    const result = await db.insert(stores).values(storeData).returning();
    console.log(`🎯 Nova loja criada com teste de 7 dias: ${store.name} (expira em ${trialEndDate.toLocaleDateString('pt-BR')})`);
    return result[0];
  }

  async updateStore(id: number, store: Partial<Store>): Promise<Store> {
    console.log(`🔐 SEGURANÇA: Atualizando loja ID ${id} com dados:`, store);
    const result = await db.update(stores).set(store).where(eq(stores.id, id)).returning();
    return result[0];
  }

  async getSellersByStore(storeId: number): Promise<Seller[]> {
    return db.select().from(sellers).where(eq(sellers.storeId, storeId));
  }

  async getSellerByEmail(email: string): Promise<Seller | undefined> {
    const result = await db.select().from(sellers).where(eq(sellers.email, email));
    return result[0];
  }

  async createSeller(seller: InsertSeller & { storeId: number }): Promise<Seller> {
    const result = await db.insert(sellers).values(seller).returning();
    return result[0];
  }

  async updateSeller(id: number, seller: Partial<Seller>): Promise<Seller> {
    const [updatedSeller] = await db
      .update(sellers)
      .set(seller)
      .where(eq(sellers.id, id))
      .returning();
    return updatedSeller;
  }

  async deleteSeller(id: number): Promise<void> {
    await db.delete(sellers).where(eq(sellers.id, id));
  }

  // Access Control operations
  async getSellersWithPermissions(storeId: number): Promise<Seller[]> {
    const result = await db.select().from(sellers).where(eq(sellers.storeId, storeId));
    console.log(`📋 Vendedores encontrados para loja ${storeId}:`, result);
    return result;
  }

  async updateSellerPermissions(sellerId: number, permissions: string[]): Promise<void> {
    const permissionsJson = JSON.stringify(permissions);
    await db.update(sellers)
      .set({ menuPermissions: permissionsJson })
      .where(eq(sellers.id, sellerId));
  }

  async getSellerPermissions(sellerId: number): Promise<string[]> {
    const result = await db.select({ menuPermissions: sellers.menuPermissions })
      .from(sellers)
      .where(eq(sellers.id, sellerId));
    
    if (result[0]?.menuPermissions) {
      try {
        return JSON.parse(result[0].menuPermissions);
      } catch (error) {
        console.error("Error parsing menu permissions:", error);
        return ["dashboard"]; // Default to only dashboard
      }
    }
    
    return ["dashboard"]; // Default to only dashboard if no permissions set
  }

  async updateStoreSubscription(id: number, subscription: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionPlan?: string;
    subscriptionCurrentPeriodEnd?: Date;
  }): Promise<Store> {
    const [updatedStore] = await db
      .update(stores)
      .set(subscription)
      .where(eq(stores.id, id))
      .returning();
    return updatedStore;
  }

  async getProductsByStore(storeId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.storeId, storeId)).orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct & { storeId: number }): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(productId: number, storeId: number, productData: Partial<Product>): Promise<Product> {
    const [updatedProduct] = await db.update(products)
      .set(productData)
      .where(
        and(
          eq(products.id, productId),
          eq(products.storeId, storeId)
        )
      )
      .returning();
    
    console.log(`📝 Produto atualizado - ID: ${productId}, Store: ${storeId}`);
    return updatedProduct;
  }

  async deleteProduct(productId: number, storeId: number): Promise<void> {
    console.log(`🎯 Storage: Deletando produto ${productId} da loja ${storeId}`);
    
    // Primeiro vamos verificar se o produto existe
    const existingProduct = await db.select().from(products)
      .where(
        and(
          eq(products.id, productId),
          eq(products.storeId, storeId)
        )
      );
    
    console.log(`🔍 Produto encontrado:`, existingProduct);
    
    if (existingProduct.length === 0) {
      console.log(`❌ Produto ${productId} não encontrado na loja ${storeId}`);
      throw new Error(`Produto não encontrado`);
    }
    
    const result = await db.delete(products)
      .where(
        and(
          eq(products.id, productId),
          eq(products.storeId, storeId)
        )
      );
    
    console.log(`🗑️ Produto deletado - ID: ${productId}, Store: ${storeId}, Resultado:`, result);
    console.log(`✅ Deleção bem-sucedida!`);
  }

  async getSalesByStore(storeId: number): Promise<Sale[]> {
    return db.select().from(sales).where(eq(sales.storeId, storeId)).orderBy(desc(sales.createdAt));
  }

  async createSale(sale: InsertSale & { storeId: number }): Promise<Sale> {
    const [newSale] = await db.insert(sales).values(sale).returning();
    return newSale;
  }

  async updateSale(id: number, saleData: Partial<Sale>): Promise<Sale> {
    const [updatedSale] = await db
      .update(sales)
      .set(saleData)
      .where(eq(sales.id, id))
      .returning();
    return updatedSale;
  }

  async deleteSale(id: number): Promise<void> {
    console.log(`🗑️ Deletando venda com ID: ${id}`);
    try {
      // Usar SQL direto para garantir que funcione
      const result = await sql`DELETE FROM sales WHERE id = ${id}`;
      console.log(`✅ Venda ${id} deletada com SQL direto:`, result);
      
      // Verificar se realmente foi deletada
      const verification = await sql`SELECT * FROM sales WHERE id = ${id}`;
      if (verification.length === 0) {
        console.log(`✅ Confirmado: Venda ${id} foi removida do banco`);
      } else {
        console.log(`❌ Erro: Venda ${id} ainda existe no banco`);
        throw new Error(`Falha ao deletar venda ${id}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao deletar venda ${id}:`, error);
      throw error;
    }
  }

  // Goal operations
  async getGoalsByStore(storeId: number): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.storeId, storeId))
      .orderBy(desc(goals.createdAt));
  }

  async createGoal(goal: InsertGoal & { storeId: number }): Promise<Goal> {
    const [newGoal] = await db.insert(goals).values({
      storeId: goal.storeId,
      sellerId: goal.sellerId,
      type: goal.type,
      name: goal.name,
      valueType: goal.valueType,
      targetValue: goal.targetValue,
      targetType: goal.targetType,
      month: goal.month,
      year: goal.year,
      period: goal.period,
    }).returning();
    return newGoal;
  }

  async updateGoal(id: number, goalData: Partial<Goal>): Promise<Goal> {
    const [updatedGoal] = await db
      .update(goals)
      .set(goalData)
      .where(eq(goals.id, id))
      .returning();
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  async getMarketAnalysesByStore(storeId: number): Promise<MarketAnalysis[]> {
    return await db.select().from(marketAnalyses).where(eq(marketAnalyses.storeId, storeId)).orderBy(desc(marketAnalyses.createdAt));
  }

  async createMarketAnalysis(analysis: InsertMarketAnalysis & { storeId: number; averagePrice: number; minPrice: number; maxPrice: number; recommendedPrice: number; marketTrend: string; sources: string[]; recommendations: string[]; confidence: number }): Promise<MarketAnalysis> {
    const [newAnalysis] = await db.insert(marketAnalyses).values({
      storeId: analysis.storeId,
      productModel: analysis.productModel,
      condition: analysis.condition,
      storage: analysis.storage,
      averagePrice: analysis.averagePrice,
      minPrice: analysis.minPrice,
      maxPrice: analysis.maxPrice,
      recommendedPrice: analysis.recommendedPrice,
      marketTrend: analysis.marketTrend,
      sources: analysis.sources,
      recommendations: analysis.recommendations,
      confidence: analysis.confidence
    }).returning();
    return newAnalysis;
  }

  async resetDashboardData(storeId: number): Promise<void> {
    console.log(`🔄 Iniciando reset do dashboard para loja ${storeId}`);
    
    try {
      // 1. Deletar vendas primeiro (podem referenciar produtos e vendedores)
      const deletedSales = await db.delete(sales).where(eq(sales.storeId, storeId)).returning();
      console.log(`🗑️ Vendas deletadas: ${deletedSales.length}`);
      
      // 2. Deletar metas (podem referenciar vendedores)
      const deletedGoals = await db.delete(goals).where(eq(goals.storeId, storeId)).returning();
      console.log(`🗑️ Metas deletadas: ${deletedGoals.length}`);
      
      // 3. Deletar análises de mercado (referenciam produtos)
      const deletedAnalyses = await db.delete(marketAnalyses).where(eq(marketAnalyses.storeId, storeId)).returning();
      console.log(`🗑️ Análises deletadas: ${deletedAnalyses.length}`);
      
      // 4. Deletar produtos
      const deletedProducts = await db.delete(products).where(eq(products.storeId, storeId)).returning();
      console.log(`🗑️ Produtos deletados: ${deletedProducts.length}`);
      
      // 5. Deletar vendedores (exceto o administrador principal)
      const deletedSellers = await db.delete(sellers).where(and(
        eq(sellers.storeId, storeId),
        eq(sellers.isAdmin, false) // Manter apenas administradores
      )).returning();
      console.log(`🗑️ Vendedores deletados: ${deletedSellers.length}`);
      
      console.log(`✅ Dashboard data resetado com sucesso para loja ${storeId}`);
    } catch (error) {
      console.error(`❌ Erro ao resetar dashboard da loja ${storeId}:`, error);
      throw error;
    }
  }

  async getSellerById(sellerId: number): Promise<Seller | null> {
    try {
      const result = await db.select().from(sellers).where(eq(sellers.id, sellerId));
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Erro ao buscar vendedor por ID:', error);
      return null;
    }
  }

  // SISTEMA FINANCEIRO - Contas a Pagar
  async getAccountsPayableByStore(storeId: number): Promise<AccountsPayable[]> {
    const result = await db.select().from(accountsPayable).where(eq(accountsPayable.storeId, storeId)).orderBy(desc(accountsPayable.dueDate));
    return result;
  }

  async createAccountsPayable(payable: InsertAccountsPayable & { storeId: number }): Promise<AccountsPayable> {
    const result = await db.insert(accountsPayable).values(payable).returning();
    return result[0];
  }

  async updateAccountsPayable(id: number, payableData: Partial<AccountsPayable>): Promise<AccountsPayable> {
    const result = await db.update(accountsPayable).set(payableData).where(eq(accountsPayable.id, id)).returning();
    return result[0];
  }

  async deleteAccountsPayable(id: number): Promise<void> {
    await db.delete(accountsPayable).where(eq(accountsPayable.id, id));
  }

  // SISTEMA FINANCEIRO - Contas a Receber
  async getAccountsReceivableByStore(storeId: number): Promise<AccountsReceivable[]> {
    const result = await db.select().from(accountsReceivable).where(eq(accountsReceivable.storeId, storeId)).orderBy(desc(accountsReceivable.dueDate));
    return result;
  }

  async createAccountsReceivable(receivable: InsertAccountsReceivable & { storeId: number }): Promise<AccountsReceivable> {
    const result = await db.insert(accountsReceivable).values(receivable).returning();
    return result[0];
  }

  async updateAccountsReceivable(id: number, receivableData: Partial<AccountsReceivable>): Promise<AccountsReceivable> {
    const result = await db.update(accountsReceivable).set(receivableData).where(eq(accountsReceivable.id, id)).returning();
    return result[0];
  }

  async deleteAccountsReceivable(id: number): Promise<void> {
    await db.delete(accountsReceivable).where(eq(accountsReceivable.id, id));
  }

  // SISTEMA FINANCEIRO - Fluxo de Caixa
  async getCashFlowByStore(storeId: number): Promise<CashFlow[]> {
    const result = await db.select().from(cashFlow).where(eq(cashFlow.storeId, storeId)).orderBy(desc(cashFlow.date));
    return result;
  }

  async createCashFlow(cashFlowData: InsertCashFlow & { storeId: number }): Promise<CashFlow> {
    const result = await db.insert(cashFlow).values(cashFlowData).returning();
    return result[0];
  }

  async updateCashFlow(id: number, cashFlowData: Partial<CashFlow>): Promise<CashFlow> {
    const result = await db.update(cashFlow).set(cashFlowData).where(eq(cashFlow.id, id)).returning();
    return result[0];
  }

  async deleteCashFlow(id: number): Promise<void> {
    await db.delete(cashFlow).where(eq(cashFlow.id, id));
  }

  // SISTEMA FINANCEIRO - Fornecedores
  async getSuppliersByStore(storeId: number): Promise<Supplier[]> {
    const result = await db.select().from(suppliers).where(eq(suppliers.storeId, storeId)).orderBy(suppliers.name);
    return result;
  }

  async createSupplier(supplier: InsertSupplier & { storeId: number }): Promise<Supplier> {
    const result = await db.insert(suppliers).values(supplier).returning();
    return result[0];
  }

  async updateSupplier(id: number, supplierData: Partial<Supplier>): Promise<Supplier> {
    const result = await db.update(suppliers).set(supplierData).where(eq(suppliers.id, id)).returning();
    return result[0];
  }

  async deleteSupplier(id: number): Promise<void> {
    await db.delete(suppliers).where(eq(suppliers.id, id));
  }

  // SISTEMA FINANCEIRO - Clientes
  async getCustomersByStore(storeId: number): Promise<Customer[]> {
    const result = await db.select().from(customers).where(eq(customers.storeId, storeId)).orderBy(customers.name);
    return result;
  }

  async createCustomer(customer: InsertCustomer & { storeId: number }): Promise<Customer> {
    const result = await db.insert(customers).values(customer).returning();
    return result[0];
  }

  async updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer> {
    const result = await db.update(customers).set(customerData).where(eq(customers.id, id)).returning();
    return result[0];
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  // SISTEMA FINANCEIRO - Relatórios
  async getFinancialReport(storeId: number, startDate: string, endDate: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    pendingReceivables: number;
    pendingPayables: number;
    cashFlowByCategory: { category: string; amount: number; type: 'income' | 'expense' }[];
  }> {
    // Get all cash flow entries within date range
    const flows = await db.select().from(cashFlow).where(
      and(
        eq(cashFlow.storeId, storeId),
        // Add date filtering here when needed
      )
    );

    // Get pending receivables
    const pendingReceivables = await db.select().from(accountsReceivable).where(
      and(
        eq(accountsReceivable.storeId, storeId),
        eq(accountsReceivable.status, 'pending')
      )
    );

    // Get pending payables
    const pendingPayables = await db.select().from(accountsPayable).where(
      and(
        eq(accountsPayable.storeId, storeId),
        eq(accountsPayable.status, 'pending')
      )
    );

    const totalIncome = flows.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
    const totalExpenses = flows.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const pendingReceivablesTotal = pendingReceivables.reduce((sum, r) => sum + r.amount, 0);
    const pendingPayablesTotal = pendingPayables.reduce((sum, p) => sum + p.amount, 0);

    // Group by category
    const categoryMap = new Map<string, { amount: number; type: 'income' | 'expense' }>();
    flows.forEach(f => {
      const key = f.category;
      if (categoryMap.has(key)) {
        categoryMap.get(key)!.amount += f.amount;
      } else {
        categoryMap.set(key, { amount: f.amount, type: f.type as 'income' | 'expense' });
      }
    });

    const cashFlowByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      amount: data.amount,
      type: data.type
    }));

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      pendingReceivables: pendingReceivablesTotal,
      pendingPayables: pendingPayablesTotal,
      cashFlowByCategory
    };
  }

  // SISTEMA DE GAMIFICAÇÃO - Implementações

  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.isActive, true));
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const [newBadge] = await db.insert(badges).values(badge).returning();
    return newBadge;
  }

  async getSellerAchievements(storeId: number, sellerId?: number): Promise<SellerAchievement[]> {
    if (sellerId) {
      return await db.select().from(sellerAchievements)
        .where(and(eq(sellerAchievements.storeId, storeId), eq(sellerAchievements.sellerId, sellerId)))
        .orderBy(desc(sellerAchievements.unlockedAt));
    }
    return await db.select().from(sellerAchievements)
      .where(eq(sellerAchievements.storeId, storeId))
      .orderBy(desc(sellerAchievements.unlockedAt));
  }

  async createSellerAchievement(achievement: InsertSellerAchievement): Promise<SellerAchievement> {
    const [newAchievement] = await db.insert(sellerAchievements).values(achievement).returning();
    return newAchievement;
  }

  async checkAndUnlockBadges(storeId: number, sellerId: number): Promise<SellerAchievement[]> {
    const newAchievements: SellerAchievement[] = [];
    
    // Buscar vendas do vendedor
    const sellerSales = await db.select().from(sales)
      .where(and(eq(sales.storeId, storeId), eq(sales.sellerId, sellerId)));
    
    const salesCount = sellerSales.length;
    const totalSales = sellerSales.reduce((sum, sale) => sum + sale.salePrice, 0);
    
    // Buscar badges já conquistados
    const existingAchievements = await this.getSellerAchievements(storeId, sellerId);
    const unlockedBadgeIds = existingAchievements.map(a => a.badgeId);
    
    // Buscar todos os badges disponíveis
    const availableBadges = await this.getBadges();
    
    // Verificar conquistas baseadas em vendas
    for (const badge of availableBadges) {
      if (unlockedBadgeIds.includes(badge.id)) continue;
      
      let shouldUnlock = false;
      
      if (badge.type === 'sales' && salesCount >= badge.requirement) {
        shouldUnlock = true;
      } else if (badge.type === 'milestone') {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const monthlySales = sellerSales
          .filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate.getMonth() + 1 === currentMonth && saleDate.getFullYear() === currentYear;
          })
          .reduce((sum, sale) => sum + sale.salePrice, 0);
        
        if (monthlySales >= badge.requirement) {
          shouldUnlock = true;
        }
      }
      
      if (shouldUnlock) {
        const achievement = await this.createSellerAchievement({
          storeId,
          sellerId,
          badgeId: badge.id,
          notified: false
        });
        newAchievements.push(achievement);
      }
    }
    
    return newAchievements;
  }

  async getSellerScores(storeId: number, month?: number, year?: number): Promise<SellerScore[]> {
    let query = db.select().from(sellerScores).where(eq(sellerScores.storeId, storeId));
    
    if (month && year) {
      query = query.where(and(
        eq(sellerScores.storeId, storeId),
        eq(sellerScores.month, month),
        eq(sellerScores.year, year)
      ));
    }
    
    return await query.orderBy(desc(sellerScores.points));
  }

  async updateSellerScore(storeId: number, sellerId: number, month: number, year: number): Promise<SellerScore> {
    // Buscar vendas do mês
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const monthlySales = await db.select().from(sales)
      .where(and(
        eq(sales.storeId, storeId),
        eq(sales.sellerId, sellerId)
        // Adicionar filtro de data quando tivermos o campo
      ));
    
    const totalSales = monthlySales.reduce((sum, sale) => sum + sale.salePrice, 0);
    const salesCount = monthlySales.length;
    
    // Buscar metas atingidas
    const achievedGoals = await db.select().from(goals)
      .where(and(
        eq(goals.storeId, storeId),
        eq(goals.sellerId, sellerId),
        eq(goals.month, month),
        eq(goals.year, year)
      ));
    
    const goalsAchieved = achievedGoals.filter(goal => goal.currentValue >= goal.targetValue).length;
    
    // Buscar badges conquistados
    const achievements = await this.getSellerAchievements(storeId, sellerId);
    const badgesCount = achievements.length;
    
    // Calcular pontos
    const points = (salesCount * 10) + (goalsAchieved * 100) + (badgesCount * 50);
    
    // Calcular nível
    const level = Math.floor(points / 1000) + 1;
    
    // Verificar se já existe um score para este mês
    const existingScore = await db.select().from(sellerScores)
      .where(and(
        eq(sellerScores.storeId, storeId),
        eq(sellerScores.sellerId, sellerId),
        eq(sellerScores.month, month),
        eq(sellerScores.year, year)
      ));
    
    if (existingScore.length > 0) {
      const [updatedScore] = await db.update(sellerScores)
        .set({
          totalSales,
          salesCount,
          goalsAchieved,
          points,
          level,
          badgesCount,
          updatedAt: new Date()
        })
        .where(eq(sellerScores.id, existingScore[0].id))
        .returning();
      return updatedScore;
    } else {
      const [newScore] = await db.insert(sellerScores)
        .values({
          storeId,
          sellerId,
          month,
          year,
          totalSales,
          salesCount,
          goalsAchieved,
          streakDays: 0,
          points,
          level,
          badgesCount
        })
        .returning();
      return newScore;
    }
  }

  async getLeaderboard(storeId: number, month: number, year: number): Promise<SellerScore[]> {
    const scores = await db.select().from(sellerScores)
      .where(and(
        eq(sellerScores.storeId, storeId),
        eq(sellerScores.month, month),
        eq(sellerScores.year, year)
      ))
      .orderBy(desc(sellerScores.points));
    
    // Atualizar rankings
    for (let i = 0; i < scores.length; i++) {
      await db.update(sellerScores)
        .set({ ranking: i + 1 })
        .where(eq(sellerScores.id, scores[i].id));
      scores[i].ranking = i + 1;
    }
    
    return scores;
  }
}

export const storage = new DatabaseStorage();
export { db };
