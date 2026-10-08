import type { Product } from "../types";

/**
 * Mock data for the MVP. Replace with Laravel API responses later:
 *   GET /api/products?featured=1
 */

export const mockFeaturedProducts: Product[] = [
  {
    id: 1,
    name: "Catalyst 9200 24-Port Gigabit Switch",
    brand: "Cisco",
    sku: "C9200-24T",
    price: 2450,
    image: "",
    inStock: true,
    categoryId: 2,
  },
  {
    id: 2,
    name: "UniFi 6 Pro Wireless Access Point",
    brand: "Ubiquiti",
    sku: "U6-PRO",
    price: 189,
    image: "",
    inStock: true,
    categoryId: 3,
  },
  {
    id: 3,
    name: "FortiGate 60F Security Firewall",
    brand: "Fortinet",
    sku: "FG-60F",
    price: 612.5,
    image: "",
    inStock: true,
    categoryId: 4,
  },
  {
    id: 4,
    name: "CCR2004 Cloud Core Router",
    brand: "MikroTik",
    sku: "CCR2004-1G-12S+2XS",
    price: 595,
    image: "",
    inStock: false,
    categoryId: 1,
  },
  {
    id: 5,
    name: "Aruba 2930F 48G PoE+ Switch",
    brand: "HPE Aruba",
    sku: "JL262A",
    price: 3120,
    image: "",
    inStock: true,
    categoryId: 2,
  },
  {
    id: 6,
    name: "Omada EAP670 Ceiling Access Point",
    brand: "TP-Link",
    sku: "EAP670",
    price: 149.99,
    image: "",
    inStock: true,
    categoryId: 3,
  },
  {
    id: 7,
    name: "PA-440 Next-Gen Firewall",
    brand: "Palo Alto",
    sku: "PAN-PA-440",
    price: 1875,
    image: "",
    inStock: true,
    categoryId: 4,
  },
  {
    id: 8,
    name: "Cat6A Shielded Patch Cable 3m (10-Pack)",
    brand: "Tripp Lite",
    sku: "N262-003-10PK",
    price: 42,
    image: "",
    inStock: true,
    categoryId: 5,
  },
];