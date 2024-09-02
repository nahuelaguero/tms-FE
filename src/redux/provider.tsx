"use client";

import { Provider } from "react-redux";
import store from "./store";
import { makeServer } from "../mirage/server";

if (typeof window !== "undefined") {
  makeServer();
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
