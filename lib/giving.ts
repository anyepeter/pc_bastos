/**
 * Giving details shown on /give.
 *
 * These are deliberately empty. Nothing here is guessed — a wrong account
 * number sends real money to the wrong place — so the page falls back to
 * "contact the office" until someone fills these in with the council's real
 * details. As soon as a section below is populated it appears on the page.
 */

export interface BankTransferDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  /** Optional, for transfers from abroad. */
  swift?: string;
}

export interface MobileMoneyAccount {
  /** e.g. 'MTN Mobile Money', 'Orange Money'. */
  provider: string;
  number: string;
  accountName: string;
}

/** Set to a `BankTransferDetails` object to show the bank transfer card. */
export const BANK_TRANSFER: BankTransferDetails | null = null;

/** Add entries to show the mobile money card. */
export const MOBILE_MONEY: MobileMoneyAccount[] = [];

export const hasBankTransfer = () => BANK_TRANSFER !== null;
export const hasMobileMoney = () => MOBILE_MONEY.length > 0;

/** True while no payment details have been configured yet. */
export const givingDetailsMissing = () => !hasBankTransfer() && !hasMobileMoney();
