import { pgTable, text, serial, timestamp, boolean, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  supabaseId: text("supabase_id").notNull().unique(),
  isAdmin: boolean("is_admin").notNull().default(false),
  storeId: integer("store_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  logoUrl: text("logo_url"),
  // Enhanced Visual Customization
  primaryColor: text("primary_color").notNull().default("#3B82F6"),
  secondaryColor: text("secondary_color").default("#10B981"),
  accentColor: text("accent_color").default("#F59E0B"),
  backgroundColor: text("background_color").default("#FFFFFF"),
  textColor: text("text_color").default("#1F2937"),
  fontFamily: text("font_family").default("Inter"), // Inter, Roboto, Poppins, Open Sans
  layout: text("layout").default("modern"), // modern, classic, minimal
  headerStyle: text("header_style").default("standard"), // standard, centered, minimal
  buttonStyle: text("button_style").default("rounded"), // rounded, square, pill
  // Store branding
  bannerUrl: text("banner_url"), // Header banner image
  favicon: text("favicon"), // Store favicon
  // Custom terminology settings
  customTerminology: text("custom_terminology"), // JSON string with custom terms
  // Sales configuration settings
  autoApproveSales: boolean("auto_approve_sales").default(false),
  emailNotifications: boolean("email_notifications").default(false),
  autoCalculateCommission: boolean("auto_calculate_commission").default(true),
  maxDiscountPercent: integer("max_discount_percent").default(20), // percentage
  defaultMonthlyTarget: integer("default_monthly_target").default(500000), // in cents (R$ 5000)
  // Configurações de vendas agregadas
  aggregatedSalesPointsMode: text("aggregated_sales_points_mode").default("fixed"), // fixed, range
  aggregatedSalesFixedPoints: integer("aggregated_sales_fixed_points").default(5), // Pontos fixos por item
  aggregatedSalesRanges: text("aggregated_sales_ranges"), // JSON com faixas de valor e pontos
  // Configurações de validade da gamificação
  gamificationEnabled: boolean("gamification_enabled").default(true),
  gamificationStartDate: timestamp("gamification_start_date").defaultNow(),
  gamificationEndDate: timestamp("gamification_end_date"), // Data de fim da campanha
  monthlyResetEnabled: boolean("monthly_reset_enabled").default(true), // Reset mensal automático
  ownerId: integer("owner_id").notNull(),
  // Subscription fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("trial"), // trial, active, canceled, past_due
  subscriptionPlan: text("subscription_plan").default("trial"), // trial, starter, professional, enterprise
  subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
  trialStartDate: timestamp("trial_start_date").defaultNow(),
  trialEndDate: timestamp("trial_end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(), // hashed password for login
  phone: text("phone"),
  role: text("role").notNull().default("seller"), // "seller" or "admin"
  storeId: integer("store_id").notNull(),
  commissionType: text("commission_type").notNull().default("percentage"), // "percentage" or "fixed"
  commissionRate: integer("commission_rate").default(10), // percentage (1-100)
  commissionAmount: integer("commission_amount"), // fixed amount in cents
  menuPermissions: text("menu_permissions"), // JSON string with allowed menus
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  supplier: text("supplier"),
  costPrice: integer("cost_price").notNull(), // preço de custo em centavos
  salePrice: integer("sale_price").notNull(), // preço de venda em centavos
  purchaseDate: date("purchase_date"),
  serialNumber: text("serial_number"),
  quantity: integer("quantity").notNull().default(1),
  storage: text("storage"), // capacidade de armazenamento
  color: text("color"),
  condition: text("condition").notNull().default("novo"), // novo, seminovo, usado
  storeId: integer("store_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  // Novos campos para gestão avançada
  category: text("category").default("celular"), // celular, acessorio, tablet, etc
  sku: text("sku"), // código único do produto
  barcode: text("barcode"), // código de barras
  images: text("images").array().default([]), // URLs das imagens do produto
  description: text("description"), // descrição detalhada
  minStock: integer("min_stock").default(1), // estoque mínimo
  maxStock: integer("max_stock").default(100), // estoque máximo
  location: text("location"), // localização no estoque
  weight: integer("weight"), // peso em gramas
  dimensions: text("dimensions"), // dimensões (LxAxP)
  warranty: integer("warranty").default(0), // garantia em meses
  tags: text("tags").array().default([]), // tags para busca
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  storeId: integer("store_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  salePrice: integer("sale_price").notNull(), // in cents
  paymentMethod: text("payment_method").notNull(), // dinheiro, cartao, pix
  commissionAmount: integer("commission_amount").notNull(), // in cents
  // Vendas Agregadas para Gamificação
  additionalItems: text("additional_items").array().default([]), // itens vendidos junto (capinha, película, etc)
  additionalItemsValue: integer("additional_items_value").default(0), // valor total dos itens agregados em centavos
  additionalItemsCount: integer("additional_items_count").default(0), // quantidade de itens agregados
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  sellerId: integer("seller_id"), // null for store goals
  type: text("type").notNull(), // "store" or "seller"
  name: text("name"),
  valueType: text("value_type").notNull(), // "currency" or "units"
  targetValue: integer("target_value").notNull(), // in cents for currency, units for units
  currentValue: integer("current_value").default(0), // in cents for currency, units for units
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  period: text("period").notNull(), // "monthly", "quarterly", "yearly"
  // Configurações de validade da meta
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"), // Data limite para atingir a meta
  isActive: boolean("is_active").default(true), // Meta ativa ou não
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketAnalyses = pgTable("market_analyses", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  productModel: text("product_model").notNull(),
  condition: text("condition").notNull(),
  storage: text("storage"),
  averagePrice: integer("average_price").notNull(),
  minPrice: integer("min_price").notNull(),
  maxPrice: integer("max_price").notNull(),
  recommendedPrice: integer("recommended_price").notNull(),
  marketTrend: text("market_trend").notNull(), // 'up', 'down', 'stable'
  sources: text("sources").array().notNull(),
  recommendations: text("recommendations").array().notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  supabaseId: true,
  isAdmin: true,
});

export const insertStoreSchema = createInsertSchema(stores).pick({
  name: true,
  subdomain: true,
  logoUrl: true,
  primaryColor: true,
  secondaryColor: true,
  accentColor: true,
  backgroundColor: true,
  textColor: true,
  fontFamily: true,
  layout: true,
  headerStyle: true,
  buttonStyle: true,
  bannerUrl: true,
  favicon: true,
  subscriptionStatus: true,
  subscriptionPlan: true,
});

export const insertSellerSchema = createInsertSchema(sellers).pick({
  name: true,
  email: true,
  password: true,
  phone: true,
  role: true,
  commissionType: true,
  commissionRate: true,
  commissionAmount: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  brand: true,
  model: true,
  supplier: true,
  costPrice: true,
  salePrice: true,
  purchaseDate: true,
  serialNumber: true,
  quantity: true,
  storage: true,
  color: true,
  condition: true,
});

export const insertSaleSchema = createInsertSchema(sales).pick({
  productId: true,
  sellerId: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  salePrice: true,
  paymentMethod: true,
  additionalItems: true,
  additionalItemsValue: true,
  additionalItemsCount: true,
  notes: true,
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  sellerId: true,
  type: true,
  name: true,
  valueType: true,
  targetValue: true,
  month: true,
  year: true,
  period: true,
});

export const insertMarketAnalysisSchema = createInsertSchema(marketAnalyses).pick({
  productModel: true,
  condition: true,
  storage: true,
});

// SISTEMA FINANCEIRO - Contas a Pagar
export const accountsPayable = pgTable("accounts_payable", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  supplierId: integer("supplier_id"), // nullable for generic expenses
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // in cents
  dueDate: date("due_date").notNull(),
  paidDate: date("paid_date"),
  status: text("status").notNull().default("pending"), // pending, paid, overdue
  category: text("category").notNull(), // suppliers, rent, utilities, marketing, other
  paymentMethod: text("payment_method"), // cash, credit_card, bank_transfer, pix
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SISTEMA FINANCEIRO - Contas a Receber
export const accountsReceivable = pgTable("accounts_receivable", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  customerId: integer("customer_id"), // nullable for generic income
  saleId: integer("sale_id"), // link to sales table
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // in cents
  dueDate: date("due_date").notNull(),
  receivedDate: date("received_date"),
  status: text("status").notNull().default("pending"), // pending, received, overdue
  paymentMethod: text("payment_method"), // cash, credit_card, bank_transfer, pix
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SISTEMA FINANCEIRO - Fluxo de Caixa
export const cashFlow = pgTable("cash_flow", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  type: text("type").notNull(), // income, expense
  category: text("category").notNull(), // sales, suppliers, rent, utilities, marketing, other
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // in cents
  date: date("date").notNull(),
  paymentMethod: text("payment_method"), // cash, credit_card, bank_transfer, pix
  referenceId: integer("reference_id"), // reference to sales, accounts_payable, etc
  referenceType: text("reference_type"), // sale, payable, receivable, other
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SISTEMA FINANCEIRO - Fornecedores
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  cnpj: text("cnpj"), // Brazilian tax ID
  paymentTerms: text("payment_terms"), // 30 days, 60 days, etc
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SISTEMA FINANCEIRO - Clientes
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  cpf: text("cpf"), // Brazilian tax ID
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAccountsPayableSchema = createInsertSchema(accountsPayable).pick({
  supplierId: true,
  description: true,
  amount: true,
  dueDate: true,
  category: true,
  paymentMethod: true,
  notes: true,
});

export const insertAccountsReceivableSchema = createInsertSchema(accountsReceivable).pick({
  customerId: true,
  saleId: true,
  description: true,
  amount: true,
  dueDate: true,
  paymentMethod: true,
  notes: true,
});

export const insertCashFlowSchema = createInsertSchema(cashFlow).pick({
  type: true,
  category: true,
  description: true,
  amount: true,
  date: true,
  paymentMethod: true,
  referenceId: true,
  referenceType: true,
  notes: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  cnpj: true,
  paymentTerms: true,
  notes: true,
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  cpf: true,
  notes: true,
});

export type User = typeof users.$inferSelect;
export type Store = typeof stores.$inferSelect;
export type Seller = typeof sellers.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type MarketAnalysis = typeof marketAnalyses.$inferSelect;
export type AccountsPayable = typeof accountsPayable.$inferSelect;
export type AccountsReceivable = typeof accountsReceivable.$inferSelect;
export type CashFlow = typeof cashFlow.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Customer = typeof customers.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type InsertMarketAnalysis = z.infer<typeof insertMarketAnalysisSchema>;
export type InsertAccountsPayable = z.infer<typeof insertAccountsPayableSchema>;
export type InsertAccountsReceivable = z.infer<typeof insertAccountsReceivableSchema>;
export type InsertCashFlow = z.infer<typeof insertCashFlowSchema>;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// SISTEMA DE GAMIFICAÇÃO - Badges e Conquistas
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // emoji ou nome do ícone
  type: text("type").notNull(), // sales, target, streak, milestone
  requirement: integer("requirement").notNull(), // valor necessário para desbloquear
  color: text("color").notNull().default("#3B82F6"), // cor do badge
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SISTEMA DE GAMIFICAÇÃO - Conquistas dos Vendedores
export const sellerAchievements = pgTable("seller_achievements", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  notified: boolean("notified").notNull().default(false), // se o vendedor foi notificado
});

// SISTEMA DE GAMIFICAÇÃO - Pontuações e Ranking
export const sellerScores = pgTable("seller_scores", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  totalSales: integer("total_sales").notNull().default(0), // valor total em centavos
  salesCount: integer("sales_count").notNull().default(0), // quantidade de vendas
  goalsAchieved: integer("goals_achieved").notNull().default(0), // metas atingidas
  streakDays: integer("streak_days").notNull().default(0), // dias consecutivos vendendo
  points: integer("points").notNull().default(0), // pontuação total do gamification
  level: integer("level").notNull().default(1), // nível do vendedor
  badgesCount: integer("badges_count").notNull().default(0), // total de badges conquistados
  ranking: integer("ranking").default(null), // posição no ranking mensal
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// SCHEMAS DE INSERÇÃO PARA GAMIFICAÇÃO
export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  icon: true,
  type: true,
  requirement: true,
  color: true,
  isActive: true,
});

export const insertSellerAchievementSchema = createInsertSchema(sellerAchievements).pick({
  storeId: true,
  sellerId: true,
  badgeId: true,
  notified: true,
});

export const insertSellerScoreSchema = createInsertSchema(sellerScores).pick({
  storeId: true,
  sellerId: true,
  month: true,
  year: true,
  totalSales: true,
  salesCount: true,
  goalsAchieved: true,
  streakDays: true,
  points: true,
  level: true,
  badgesCount: true,
  ranking: true,
});

// TIPOS PARA GAMIFICAÇÃO
export type Badge = typeof badges.$inferSelect;
export type SellerAchievement = typeof sellerAchievements.$inferSelect;
export type SellerScore = typeof sellerScores.$inferSelect;

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type InsertSellerAchievement = z.infer<typeof insertSellerAchievementSchema>;
export type InsertSellerScore = z.infer<typeof insertSellerScoreSchema>;
