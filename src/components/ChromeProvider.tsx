'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { CHROME, type ChromeContent } from '@/content/chrome';

const Ctx = createContext<ChromeContent>(CHROME);

/** Makes the CMS-managed header/footer content available to the (client) Header and Footer. */
export function ChromeProvider({ value, children }: { value: ChromeContent; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useChrome = () => useContext(Ctx);
