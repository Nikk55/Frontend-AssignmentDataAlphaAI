// src/hooks/useLoans.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans } from "../redux/loansSlice";

/**
 * useLoans custom hook
 * - dispatches fetchLoans once (if items empty)
 * - returns items, loading, error and a refetch function
 */
export default function useLoans() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.loans || {
    items: [], loading: false, error: null
  });

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchLoans());
    }
  }, [dispatch]); // intentionally no items dependency to avoid repeated calls

  const refetch = () => dispatch(fetchLoans());

  return { items, loading, error, refetch };
}
