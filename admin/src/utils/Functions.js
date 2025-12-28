import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";
import userService from "@/services/userService";
import categoryService from "@/services/categoryService";
import brandService from "@/services/brandService";
import productService from "@/services/productService";
import orderService from "@/services/orderService";
import { shippingService } from "@/services/shippingService";

const ENTITY_CONFIG = {
  User: {
    service: userService,
    label: "User",
  },
  Shipping: {
    service: shippingService,
    label: "Shipping",
  },
  Category: {
    service: categoryService,
    label: "Category",
  },
  Brand: {
    service: brandService,
    label: "Brand",
  },
  Product: {
    service: productService,
    label: "Product",
  },
  Order: {
    service: orderService,
    label: "Order",
  },
};

// // // Delete & Restore functions

export const hardDelete = async (ids, type, setSelected, action) => {
  const config = ENTITY_CONFIG[type];
  if (!config) return;

  const { service, label } = config;

  const result = await Swal.fire({
    title: `Delete ${label} Permenatly`,
    text: `Are you sure you want to delete this ${label.toLowerCase()} permenantly?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    confirmButtonColor: '#d50101',
    allowOutsideClick: false,
    preConfirm: async () => {
      Swal.showLoading();
      try {
        await service.hardDelete(ids);
        return true;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
        return false;
      }
    }
  });

  if (result.isConfirmed) {
    enqueueSnackbar(`${label} deleted permenantly successfully`, {
      variant: 'success',
    });
    
    setSelected && setSelected([]);
    action && action();
  }
};

export const deleteItem = async (id, type, action) => {
  const config = ENTITY_CONFIG[type];
  if (!config) return;

  const { service, label } = config;

  const result = await Swal.fire({
    title: `Delete ${label}`,
    text: `Are you sure you want to delete this ${label.toLowerCase()}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    confirmButtonColor: '#d50101',
    allowOutsideClick: false,
    preConfirm: async () => {
      Swal.showLoading();
      try {
        await service.delete(id);
        return true;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
        return false;
      }
    }
  });

  if (result.isConfirmed) {
    enqueueSnackbar(`${label} deleted successfully`, {
      variant: 'success',
    });
    
    action && action();
  }
};

export const softDelete = async (ids, type, setSelected, action) => {
  const config = ENTITY_CONFIG[type];
  if (!config) return;

  const { service, label } = config;

  const result = await Swal.fire({
    title: `Delete ${label}`,
    text: `Are you sure you want to delete this ${label.toLowerCase()}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    confirmButtonColor: '#d50101',
    allowOutsideClick: false,
    preConfirm: async () => {
      Swal.showLoading();
      try {
        await service.softDelete(ids);
        return true;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
        return false;
      }
    }
  });

  if (result.isConfirmed) {
    enqueueSnackbar(`${label} deleted successfully`, {
      variant: 'success',
    });
    
    setSelected && setSelected([]);
    action && action();
  }
};

export const restore = async (ids, type, setSelected, action) => {
  const config = ENTITY_CONFIG[type];
  if (!config) return;

  const { service, label } = config;

  const result = await Swal.fire({
    title: `Restore ${label}`,
    text: `Are you sure you want to restore this ${label.toLowerCase()}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, restore it',
    confirmButtonColor: '#1d7451',
    allowOutsideClick: false,
    preConfirm: async () => {
      Swal.showLoading();
      try {
        await service.restore(ids);
        return true;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
        return false;
      }
    }
  });

  if (result.isConfirmed) {
    enqueueSnackbar(`${label} restored successfully`, {
      variant: 'success',
    });
    
    setSelected && setSelected([]);
    action && action();
  }
};


// // // Users List Functions
export const grantAdmin = async (ids, setSelected, action) => {
  const result = await Swal.fire({
    title: 'Grant Admin',
    text: `Are you sure you want to grant admin for selected users?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, grant them',
    confirmButtonColor: '#1d7451',
    allowOutsideClick: false,
    preConfirm: async () => {
      Swal.showLoading();
      try {
        await userService.grantAdmin(ids);
        return true;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
        return false;
      }
    }
  });

  if (result.isConfirmed) {
    enqueueSnackbar(`Administration granted successfully`, {
      variant: 'success',
    });
    
    setSelected && setSelected([]);
    action && action();
  }
}

export const revokeAdmin = async (ids, setSelected, action) => {
  const result = await Swal.fire({
    title: 'Revoke Admin',
    text: `Are you sure you want to revoke admin for selected users?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, revoke them',
    confirmButtonColor: '#1d7451',
    allowOutsideClick: false,
    preConfirm: async () => {
      Swal.showLoading();
      try {
        await userService.revokeAdmin(ids);
        return true;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
        return false;
      }
    }
  });

  if (result.isConfirmed) {
    enqueueSnackbar(`Administration revoked successfully`, {
      variant: 'success',
    });
    
    setSelected && setSelected([]);
    action && action();
  }
}

// // // Products List Functions
export const handleAddStock = async (id, setSelected, action) => {
  const result = await Swal.fire({
    title: 'Add Stock',
    text: 'Enter the value to add...',
    icon: 'question',
    input: 'number',
    inputPlaceholder: 'Type...',
    showCancelButton: true,
    confirmButtonColor: '#1d7451',
    confirmButtonText: 'Add',
    allowOutsideClick: false, // prevent closing while loading
    preConfirm: async (stock) => {
      if (!stock) {
        Swal.showValidationMessage('You must enter a value');
        return false;
      }

      Swal.showLoading(); // show spinner inside modal

      try {
        const response = await productService.addStock(id, Number(stock));
        return response.data; // return data to result
      } catch (err) {
        Swal.showValidationMessage(`Request failed: ${err.message}`);
        return false;
      }
    },
  });

  if (result.isConfirmed && result.value) {
    enqueueSnackbar(result.value, { variant: 'success' });
    setSelected && setSelected([]);
    action && action();
  }
};

// // // Orders List Functions
export const handleCancel = async (id, setSelected, action) => {
  const result = await Swal.fire({
    title: `Cancel Order`,
    text: `Are you sure you want to cancel this order?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it',
    confirmButtonColor: '#d50101',
    allowOutsideClick: false,
    preConfirm: async () => {
      Swal.showLoading();
      try {
        await orderService.updateToCancelled([id]);
        return true;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
        return false;
      }
    }
  });

  if (result.isConfirmed) {
    enqueueSnackbar(`Order cancelled successfully`, {
      variant: 'success',
    });
    
    setSelected && setSelected([]);
    action && action();
  }
};

export const makeDefault = async (id, action) => {
  const result = await Swal.fire({
    title: `Make Default`,
    text: `Are you sure you want to make this shipping address default?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, make it default',
    confirmButtonColor: '#1d7451',
    allowOutsideClick: false,
    preConfirm: async () => {
      Swal.showLoading();
      try {
        await shippingService.makeDefault(id);
        return true;
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
        return false;
      }
    }
  });

  if (result.isConfirmed) {
    enqueueSnackbar(`Shipping address made default successfully`, {
      variant: 'success',
    });
    
    action && action();
  }
};