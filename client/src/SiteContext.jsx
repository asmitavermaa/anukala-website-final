import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api.js';
import EnquireModal from './components/EnquireModal.jsx';

const Ctx = createContext(null);
export const useSite = () => useContext(Ctx);

export function SiteProvider({ children }) {
  const [site, setSite] = useState(null);
  const [categories, setCategories] = useState([]);
  const [enquiry, setEnquiry] = useState(null); // product being enquired about, or {} for a general enquiry
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api('/site').then(setSite).catch(() => {});
    api('/categories').then(setCategories).catch(() => {});
  }, []);

  const openEnquiry = useCallback((product) => {
    setEnquiry(product || null);
    setOpen(true);
  }, []);

  return (
    <Ctx.Provider value={{ site, categories, openEnquiry }}>
      {children}
      {open && site && <EnquireModal site={site} product={enquiry} onClose={() => setOpen(false)} />}
    </Ctx.Provider>
  );
}
