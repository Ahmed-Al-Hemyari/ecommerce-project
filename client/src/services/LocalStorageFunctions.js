// Read
export const readLocalStorageItem = (key) => {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (err) {
    console.error(`Invalid JSON in localStorage for key "${key}"`, value);
    return null;
  }
};

// Create
export const addToLocalStorage = (key, newObj) => {
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push(newObj);
    localStorage.setItem(key, JSON.stringify(existing));
}

// Update
export const updateLocalStorageItem = (key, updatedItem) => {
    const items = JSON.parse(localStorage.getItem(key)) || [];

    const newArray = items.map(
        (item) => item._id === updatedItem._id ? updatedItem : item
    );

    localStorage.setItem(key, JSON.stringify(newArray));
}

// Delete
export const removeFromLocalStorage = (key, id) => {
  const items = JSON.parse(localStorage.getItem(key)) || [];
  const updated = items.filter(item => item._id !== id);

  localStorage.setItem(key, JSON.stringify(updated));
}

// Extract Phone Parts
export const extractPhoneParts = (phone, countries) => {
  // sort by longest dial code first (important!)
  const sorted = [...countries].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );

  for (const c of sorted) {
    if (phone.startsWith(c.dialCode)) {
      return {
        countryCode: c.dialCode,
        number: phone.slice(c.dialCode.length)
      };
    }
  }

  // fallback
  return {
    countryCode: "",
    number: phone
  };
};
