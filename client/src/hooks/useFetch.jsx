import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { backendLink } from "../utils/constants";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(backendLink + url, config);
        setData(res.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(backendLink + url, config);
      setData(res.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };
  return { data, loading, error, reFetch };
};

export default useFetch;
