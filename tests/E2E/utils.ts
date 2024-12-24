/**
 * Converts a formatted balance string (e.g., "$4 195 130") to a numeric value (e.g., 4195130).
 * @param balance - The balance string to convert.
 * @returns The numeric representation of the balance.
 */
export function convertBalanceToNumber(balance: string | null): number {
  if (!balance) throw new Error("Balance string is null or undefined.");
  return Number(balance.replace(/\$|\s/g, ""));
}
