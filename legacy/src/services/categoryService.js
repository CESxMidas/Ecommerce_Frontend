import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

function normalizeCategoryTree(nodes = []) {
  return nodes.map((node) => ({
    ...node,
    id: node.id != null ? String(node.id) : node.id,
    parentId:
      node.parentId != null && node.parentId !== ""
        ? String(node.parentId)
        : null,
    children: normalizeCategoryTree(node.children || []),
  }));
}

export async function fetchCategories() {
  const { data } = await apiClient.get(API_ENDPOINTS.categories.list);

  return normalizeCategoryTree(data);
}
