import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";
import userService from "@/services/userService";
import categoryService from "@/services/categoryService";
import brandService from "@/services/brandService";
import productService from "@/services/productService";
import orderService from "@/services/orderService";

const ENTITY_CONFIG = {
  User: {
    service: userService,
    label: "User",
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

export const hardDelete = async (ids, type, setSelected, getData) => {
  const config = ENTITY_CONFIG[type];
  if (!config) return;

  const { service, label } = config;

  const result = await Swal.fire({
    title: `Delete ${label} Permanently`,
    text: `Are you sure you want to delete this ${label.toLowerCase()} permanently?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    confirmButtonColor: '#d50101',
  });

  if (!result.isConfirmed) return;

  try {
    await service.hardDelete(ids);

    enqueueSnackbar(`${label} deleted successfully`, {
      variant: 'success',
    });

    setSelected && setSelected([]);
    getData && getData();
  } catch (error) {
    enqueueSnackbar(
      error || 'Delete failed',
      { variant: 'error' }
    );
    console.error(error);
  }
};

export const softDelete = async (ids, type, setSelected, getData) => {
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
  });

  if (!result.isConfirmed) return;

  try {
    await service.softDelete(ids);

    enqueueSnackbar(`${label} deleted successfully`, {
      variant: 'success',
    });

    setSelected && setSelected([]);
    getData && getData();
  } catch (error) {
    enqueueSnackbar(
      error || 'Delete failed',
      { variant: 'error' }
    );
    console.error(error);
  }
};

export const restore = async (ids, type, setSelected, getData) => {
  const config = ENTITY_CONFIG[type];
  if (!config) return;

  const { service, label } = config;

  const result = await Swal.fire({
    title: `Restore ${label}`,
    text: `Are you sure you want to restore this ${label.toLowerCase()}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    confirmButtonColor: '#1d7451',
  });

  if (!result.isConfirmed) return;

  try {
    await service.restore(ids);

    enqueueSnackbar(`${label} restored successfully`, {
      variant: 'success',
    });

    setSelected && setSelected([]);
    getData && getData();
  } catch (error) {
    enqueueSnackbar(
      error || 'Restore failed',
      { variant: 'error' }
    );
    console.error(error);
  }
};


// // // Users List Functions
export const grantAdmin = async (ids, setSelected, getData) => {
  const result = await Swal.fire({
    title: 'Grant Admin',
    text: `Are you sure you want to grant admin for selected users?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, grant them',
    confirmButtonColor: '#1d7451',
  });

  if (!result.isConfirmed) return;

  try {
    await userService.grantAdmin(ids);
    enqueueSnackbar("Administration granted successfully", { variant: 'success' });
    setSelected([]);
    getData();
  } catch (error) {
    enqueueSnackbar("Failed to grant admin", { variant: 'error' });
    console.error(error);
  }
}

export const revokeAdmin = async (ids, setSelected, getData) => {
  const result = await Swal.fire({
    title: 'Revoke Admin',
    text: `Are you sure you want to revoke admin for selected users?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, revoke admin',
    confirmButtonColor: '#1d7451',
  });

  if (!result.isConfirmed) return;

  try {
    await userService.revokeAdmin(ids);
    enqueueSnackbar("Administration revoked successfully", { variant: 'success' });
    setSelected([]);
    getData();
  } catch (error) {
    enqueueSnackbar("Failed to revoke admin", { variant: 'error' });
    console.error(error);
  }
}

// // // Products List Functions
export const handleAddStock = async (id, setSelected, getData) => {
  const result = Swal.fire({
    title: 'Add Stock',
    text: 'Enter the value to add...',
    icon: 'question',
    input: 'number',
    inputPlaceholder: 'Type...',
    showCancelButton: true,
    confirmButtonColor: '#1d7451',
    confirmButtonText: 'Add',
  })

  if (!(await result).value) {
    return;
  }

  
  const stock = (await result).value;

  try {
    const response = await productService.addStock(id, Number(stock));
    enqueueSnackbar(response.data, {
      variant: 'success'
    });
    setSelected([]);
    getData();
  } catch (error) {
    enqueueSnackbar(error, {
      variant: 'error'
    });
    console.error(error);
  }
}

// // // Orders List Functions
export const handleCancel = async (id, setSelected, getData) => {
  const result = await Swal.fire({
    title: 'Cancel Order',
    text: 'Are you sure you want to cancel this order?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it',
    confirmButtonColor: '#d50101',
  });

  if (!result.isConfirmed) return;

  try {
    await orderService.updateToCancelled([id]);
    enqueueSnackbar('Order cancelled successfully', { variant: 'success' });
    setSelected([]);
    getData();
  } catch (error) {
    enqueueSnackbar('Failed to delete order', { variant: 'error' });
    console.error(error);
  }
};