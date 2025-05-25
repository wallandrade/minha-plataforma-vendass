// Utilitários para cálculo de datas e prazos na gamificação

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
  isExpiringSoon: boolean; // últimas 48 horas
  percentage: number; // percentual do tempo decorrido
}

export function calculateTimeRemaining(endDate: Date | string, startDate?: Date | string): TimeRemaining {
  const now = new Date();
  const end = new Date(endDate);
  const start = startDate ? new Date(startDate) : null;
  
  const totalMs = end.getTime() - now.getTime();
  const isExpired = totalMs <= 0;
  
  if (isExpired) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isExpired: true,
      isExpiringSoon: false,
      percentage: 100
    };
  }
  
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const isExpiringSoon = totalMs <= (48 * 60 * 60 * 1000); // 48 horas
  
  // Calcular percentual de tempo decorrido
  let percentage = 0;
  if (start) {
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  }
  
  return {
    days,
    hours,
    minutes,
    isExpired,
    isExpiringSoon,
    percentage
  };
}

export function formatTimeRemaining(timeRemaining: TimeRemaining): string {
  if (timeRemaining.isExpired) {
    return "Prazo expirado";
  }
  
  const { days, hours, minutes } = timeRemaining;
  
  if (days > 0) {
    return `${days} dias, ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes} minutos`;
  }
}

export function getTimeRemainingColor(timeRemaining: TimeRemaining): string {
  if (timeRemaining.isExpired) {
    return "text-red-600 dark:text-red-400";
  } else if (timeRemaining.isExpiringSoon) {
    return "text-orange-600 dark:text-orange-400";
  } else if (timeRemaining.days <= 7) {
    return "text-yellow-600 dark:text-yellow-400";
  } else {
    return "text-green-600 dark:text-green-400";
  }
}

export function isGamificationActive(store: any): boolean {
  if (!store.gamificationEnabled) {
    return false;
  }
  
  const now = new Date();
  
  if (store.gamificationStartDate && new Date(store.gamificationStartDate) > now) {
    return false; // Ainda não começou
  }
  
  if (store.gamificationEndDate && new Date(store.gamificationEndDate) < now) {
    return false; // Já terminou
  }
  
  return true;
}

export function getGamificationStatus(store: any): 'active' | 'not_started' | 'ended' | 'disabled' {
  if (!store.gamificationEnabled) {
    return 'disabled';
  }
  
  const now = new Date();
  
  if (store.gamificationStartDate && new Date(store.gamificationStartDate) > now) {
    return 'not_started';
  }
  
  if (store.gamificationEndDate && new Date(store.gamificationEndDate) < now) {
    return 'ended';
  }
  
  return 'active';
}