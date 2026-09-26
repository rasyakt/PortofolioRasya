"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import CommandPalette from "./CommandPalette";

const CommandPaletteContext = createContext<{
  open: () => void;
  close: () => void;
  isOpen: boolean;
}>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export interface PaletteContact {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
}

export function CommandPaletteProvider({
  children,
  contact,
}: {
  children: React.ReactNode;
  contact: PaletteContact;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ open, close, isOpen }}>
      {children}
      <CommandPalette open={isOpen} onClose={close} contact={contact} />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}
