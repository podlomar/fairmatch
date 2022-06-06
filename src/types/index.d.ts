import { DehydratedState } from "react-query";

export {};

declare global {
  interface Window {
    __REACT_QUERY_STATE__: DehydratedState;
  }
};