import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook useField
export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

// Hook useCountry
export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      if (name) {
        try {
          const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`);
          setCountry({ found: true, data: response.data });
        } catch (error) {
          console.error(error);
          setCountry({ found: false });
        }
      }
    };

    fetchCountry();
  }, [name]);

  return country;
};