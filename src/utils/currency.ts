/**
 * Funções utilitárias para formatação de moeda com digitação da direita para a esquerda
 */

export const formatCurrencyInput = (value: number): string => {
  // Converte o valor para centavos
  const centavos = Math.round(value * 100);
  
  // Formata como moeda brasileira
  return (centavos / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const handleCurrencyInput = (
  inputValue: string, 
  currentValue: number, 
  onChange: (value: number) => void
): void => {
  // Remove tudo que não é dígito
  const digitsOnly = inputValue.replace(/\D/g, '');
  
  // Se não há dígitos, valor é 0
  if (!digitsOnly) {
    onChange(0);
    return;
  }
  
  // Converte para número (em centavos) e depois para reais
  const valueInCents = parseInt(digitsOnly, 10);
  const valueInReais = valueInCents / 100;
  
  onChange(valueInReais);
};

/**
 * Função para formatar um valor numérico como moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Função para converter uma string de moeda em número
 */
export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  
  // Remove todos os caracteres que não são dígitos ou vírgula
  const cleanValue = value.replace(/[^\d,]/g, '');
  
  // Substitui vírgula por ponto e converte para número
  const numericValue = parseFloat(cleanValue.replace(',', '.')) || 0;
  
  return numericValue;
};
