/**
 * Utility functions for formatting data
 */

/**
 * Format a CNPJ string with proper punctuation
 */
export const formatCNPJ = (value: string): string => {
    // Remove non-digits
    const cnpj = value.replace(/\D/g, '');

    if (cnpj.length <= 2) return cnpj;
    if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
};

/**
 * Format a CEP string with proper punctuation
 */
export const formatCEP = (value: string): string => {
    const cep = value.replace(/\D/g, '');
    if (cep.length <= 5) return cep;
    return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
};

/**
 * Format a phone number with Brazilian formatting
 */
export const formatPhoneNumber = (value: string): string => {
    if (!value) return "-";
    const phone = value.replace(/\D/g, '');

    if (phone.length <= 2) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
    if (phone.length <= 10) return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
};
