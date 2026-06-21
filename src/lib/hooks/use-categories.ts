"use client";

import { useEffect, useState } from "react";

import type { Category } from "@/types/api";

let cachedCategories: Category[] | null = null;
let inflight: Promise<Category[]> | null = null;

function normalizeCategories(data: unknown): Category[] {
  if (Array.isArray(data)) {
    return data as Category[];
  }

  if (data && typeof data === "object" && Array.isArray((data as { categories?: unknown }).categories)) {
    return (data as { categories: Category[] }).categories;
  }

  return [];
}

async function loadCategories(): Promise<Category[]> {
  if (cachedCategories) {
    return cachedCategories;
  }

  if (!inflight) {
    inflight = fetch("/api/categories", { cache: "force-cache" })
      .then((response) => (response.ok ? response.json() : []))
      .then(normalizeCategories)
      .then((categories) => {
        cachedCategories = categories;
        return categories;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}

/** Lazy-load categories — tránh block root layout mỗi navigation */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(cachedCategories ?? []);

  useEffect(() => {
    if (cachedCategories) {
      return;
    }

    let cancelled = false;

    loadCategories().then((data) => {
      if (!cancelled) {
        setCategories(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
