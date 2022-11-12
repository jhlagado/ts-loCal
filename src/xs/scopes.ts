import { Header, Action } from "./types";

let scopes: (Header | null)[] = [];
let lastHeader: Header | null = null;

export const addHeader = (name: string, action: Action) => {
  const header: Header = {
    name,
    action,
    backlink: lastHeader,
  };
  lastHeader = header;
};

export const getLastHeader = (): Header | null => lastHeader;

export const beginScope = () => {
  scopes.push(lastHeader);
};

export const endScope = () => {
  if (scopes.length === 0) return null;
  lastHeader = scopes.pop() || null;
};

export const scopeLookup = (symbol: string) => {
  const lookup = (header: Header | null, symbol: string) => {
    if (header === null) return null;
    if (header.name === symbol) {
      return lastHeader;
    }
    return null;
  };

  return lookup(lastHeader, symbol);
};
