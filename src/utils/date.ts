import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  parseISO, 
  isValid,
  startOfDay,
  endOfDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Utilitários para manipulação de datas usando date-fns
 */

/**
 * Formatar data para exibição em português brasileiro
 */
export const formatDate = (date: Date | string, pattern: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }
  
  return format(dateObj, pattern, { locale: ptBR });
};

/**
 * Formatar data para input type="date" (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }
  
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * Obter o primeiro dia do mês atual formatado para input
 */
export const getStartOfCurrentMonth = (): string => {
  const startDate = startOfMonth(new Date());
  return formatDateForInput(startDate);
};

/**
 * Obter o dia atual formatado para input
 */
export const getCurrentDate = (): string => {
  return formatDateForInput(new Date());
};

/**
 * Obter o último dia do mês atual formatado para input
 */
export const getEndOfCurrentMonth = (): string => {
  const endDate = endOfMonth(new Date());
  return formatDateForInput(endDate);
};

/**
 * Verificar se uma data está dentro de um intervalo
 */
export const isDateInRange = (
  date: Date | string, 
  startDate: Date | string, 
  endDate: Date | string
): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const startObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(dateObj) || !isValid(startObj) || !isValid(endObj)) {
    return false;
  }
  
  return isWithinInterval(dateObj, { start: startObj, end: endObj });
};

/**
 * Converter string de data para objeto Date
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const parsed = parseISO(dateString);
  return isValid(parsed) ? parsed : null;
};

/**
 * Obter filtros de data padrão para o mês atual
 */
export const getDefaultDateFilters = () => {
  return {
    startDate: getStartOfCurrentMonth(),
    endDate: getCurrentDate()
  };
};

/**
 * Formatar data para exibição amigável (ex: "15 de agosto de 2025")
 */
export const formatDateFriendly = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }
  
  return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Formatar data para exibição curta (ex: "15/08/2025")
 */
export const formatDateShort = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yyyy');
};

/**
 * Formatar data com hora (ex: "15/08/2025 14:30")
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Obter data de hoje no início do dia
 */
export const getTodayStart = (): Date => {
  return startOfDay(new Date());
};

/**
 * Obter data de hoje no fim do dia
 */
export const getTodayEnd = (): Date => {
  return endOfDay(new Date());
};
