// Definições dos limites de cada plano de assinatura

export interface PlanLimits {
  maxSalesPerMonth: number | "unlimited";
  maxSellers: number | "unlimited";
  hasAdvancedReports: boolean;
  hasPrioritySupport: boolean;
  hasFullCustomization: boolean;
  hasIntegrations: boolean;
  hasDetailedAnalytics: boolean;
  hasPersonalizedAPI: boolean;
  hasAccountManager: boolean;
  hasSLAGuarantee: boolean;
  hasTraining: boolean;
  has24x7Support: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  trial: {
    maxSalesPerMonth: 10,
    maxSellers: 1,
    hasAdvancedReports: false,
    hasPrioritySupport: false,
    hasFullCustomization: false,
    hasIntegrations: false,
    hasDetailedAnalytics: false,
    hasPersonalizedAPI: false,
    hasAccountManager: false,
    hasSLAGuarantee: false,
    hasTraining: false,
    has24x7Support: false,
  },
  iniciante: {
    maxSalesPerMonth: 100,
    maxSellers: 1,
    hasAdvancedReports: false,
    hasPrioritySupport: false,
    hasFullCustomization: false,
    hasIntegrations: false,
    hasDetailedAnalytics: false,
    hasPersonalizedAPI: false,
    hasAccountManager: false,
    hasSLAGuarantee: false,
    hasTraining: false,
    has24x7Support: false,
  },
  professional: {
    maxSalesPerMonth: "unlimited",
    maxSellers: 5,
    hasAdvancedReports: true,
    hasPrioritySupport: true,
    hasFullCustomization: true,
    hasIntegrations: true,
    hasDetailedAnalytics: true,
    hasPersonalizedAPI: false,
    hasAccountManager: false,
    hasSLAGuarantee: false,
    hasTraining: false,
    has24x7Support: false,
  },
  enterprise: {
    maxSalesPerMonth: "unlimited",
    maxSellers: "unlimited",
    hasAdvancedReports: true,
    hasPrioritySupport: true,
    hasFullCustomization: true,
    hasIntegrations: true,
    hasDetailedAnalytics: true,
    hasPersonalizedAPI: true,
    hasAccountManager: true,
    hasSLAGuarantee: true,
    hasTraining: true,
    has24x7Support: true,
  },
};

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.trial;
}

export function canAccessFeature(userPlan: string, feature: keyof PlanLimits): boolean {
  const limits = getPlanLimits(userPlan);
  return Boolean(limits[feature]);
}

export function getSalesLimit(userPlan: string): number | "unlimited" {
  const limits = getPlanLimits(userPlan);
  return limits.maxSalesPerMonth;
}

export function getSellersLimit(userPlan: string): number | "unlimited" {
  const limits = getPlanLimits(userPlan);
  return limits.maxSellers;
}