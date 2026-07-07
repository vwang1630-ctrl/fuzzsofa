/**
 * 地址存储系统 - 使用localStorage存储用户配送地址
 */

export interface SavedAddress {
  id: string;
  label: string; // 地址标签，如 "Home", "Office"
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'user_saved_addresses';

/**
 * 获取所有保存的地址
 */
export function getSavedAddresses(): SavedAddress[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 保存新地址
 */
export function saveAddress(address: Omit<SavedAddress, 'id' | 'createdAt'>): SavedAddress {
  const addresses = getSavedAddresses();
  
  const newAddress: SavedAddress = {
    ...address,
    id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  
  // 如果是默认地址，取消其他地址的默认状态
  if (newAddress.isDefault) {
    addresses.forEach(addr => addr.isDefault = false);
  }
  
  // 如果是第一个地址，自动设为默认
  if (addresses.length === 0) {
    newAddress.isDefault = true;
  }
  
  addresses.push(newAddress);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  
  return newAddress;
}

/**
 * 更新地址
 */
export function updateAddress(id: string, updates: Partial<SavedAddress>): SavedAddress | null {
  const addresses = getSavedAddresses();
  const index = addresses.findIndex(addr => addr.id === id);
  
  if (index === -1) return null;
  
  // 如果更新为默认地址，取消其他地址的默认状态
  if (updates.isDefault) {
    addresses.forEach(addr => addr.isDefault = false);
  }
  
  addresses[index] = { ...addresses[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  
  return addresses[index];
}

/**
 * 删除地址
 */
export function deleteAddress(id: string): boolean {
  const addresses = getSavedAddresses();
  const filtered = addresses.filter(addr => addr.id !== id);
  
  if (filtered.length === addresses.length) return false;
  
  // 如果删除的是默认地址，将第一个地址设为默认
  if (filtered.length > 0 && !filtered.some(addr => addr.isDefault)) {
    filtered[0].isDefault = true;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * 获取默认地址
 */
export function getDefaultAddress(): SavedAddress | null {
  const addresses = getSavedAddresses();
  return addresses.find(addr => addr.isDefault) || addresses[0] || null;
}

/**
 * 设置默认地址
 */
export function setDefaultAddress(id: string): boolean {
  return updateAddress(id, { isDefault: true }) !== null;
}

/**
 * 清除所有地址（用于测试）
 */
export function clearAllAddresses(): void {
  localStorage.removeItem(STORAGE_KEY);
}