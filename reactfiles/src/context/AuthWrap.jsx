import { createContext } from "react";

export const AuthWrap = createContext({
  auth: {},
  setAuth: () => {},
});
