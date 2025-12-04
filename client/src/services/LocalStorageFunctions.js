// Read
export const readLocalStorageItem = (key) => {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    return items;
}

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