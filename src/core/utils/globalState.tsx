import React, { useState, FunctionComponent, useEffect } from "react";
import { CMS, CMSRepo } from "../models/CMS";
import FlagLoading from "../../app/components/FlagLoading";

/**
 * @interface GlobalState
 * @description The current global state of the website.
 */
export interface GlobalState {
  cms: CMS;
  setCMS: (cms: CMS) => void;
}

/**
 * @const A context to manage the global state.
 */
export const GlobalContext = React.createContext<GlobalState>({
  cms: CMSRepo.Default,
  setCMS: (cms: CMS) => { }
});

/**
 * @function GlobalStateProvider {FunctionComponent}
 * @description The wrapper component responsible to manage the global state.
 * @param props {any} The default react props.
 * @return `{Component}` - The children component wrapped by the global state;
 */
export const GlobalStateProvider: FunctionComponent = props => {
  // Overall state of the component
  const [cms, setCMS] = useState(CMSRepo.Default);
  const [loading, setLoading] = useState(true);

  // Wait for the cms data to be loaded
  useEffect(() => {
    CMSRepo.Instance.Load().then(cms => {
      setLoading(false);
      setCMS(cms);
    });
  }, []);

  // The value of the context
  const value = {
    cms,
    setCMS: async (cms: CMS) => {
      const id = await CMSRepo.Instance.Upsert(cms);
      if (id) cms.id = id;
      setCMS(cms);
    }
  };

  // JSX
  if (loading)
    return <FlagLoading />;

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
}