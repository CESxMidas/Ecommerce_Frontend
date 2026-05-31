import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Drawer,
  Menu,
  MenuItem,
  Pagination,
  Typography,
} from "@mui/material";
import { IoFilter, IoClose } from "react-icons/io5";
import { BsSortDown, BsGrid3X3GapFill, BsGrid, BsLayoutTextWindowReverse } from "react-icons/bs";
import { HiOutlineKey } from "react-icons/hi2";
import Sidebar from "../../components/Sidebar";
import ProductItem from "../../components/ProductItem";
import { fetchCategories } from "../../services/categoryService";
import { fetchProducts } from "../../services/productService";
import { findCategoryBySlug, collectCategoryIds } from "../../utils/categoryUtils";
import {
  filterProducts,
  getProductPriceBounds,
  getUniqueBrands,
  paginateProducts,
  sortProducts,
} from "../../utils/productFilters";
import "./index.css";

const PER_PAGE = 12;

const SORT_LABELS = {
  latest: "Latest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  popular: "Popular",
};

function ProductListingSkeleton({ count = 8 }) {
  return (
    <div className="productGrid grid4 listingSkeletonGrid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="listingSkeletonCard" />
      ))}
    </div>
  );
}

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gridCols, setGridCols] = useState(4);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const query = searchParams.get("q") || "";
  const categorySlug = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "latest";
  const page = Number(searchParams.get("page") || "1");

  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();

        if (!cancelled) {
          setCategories(data);
        }
      } catch {
        if (!cancelled) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const params = {};

        if (categorySlug) {
          params.category = categorySlug;
        }

        if (query.trim()) {
          params.q = query.trim();
        }

        const data = await fetchProducts(params);

        if (!cancelled) {
          setProducts(data);
        }
      } catch (error) {
        if (!cancelled) {
          setProducts([]);
          setLoadError(error.message || "Failed to load products");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [categorySlug, query]);

  const priceBounds = useMemo(
    () => getProductPriceBounds(products),
    [products]
  );

  const activeCategory = useMemo(
    () => findCategoryBySlug(categories, categorySlug),
    [categories, categorySlug]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
    if (!categorySlug || categories.length === 0) {
      setSelectedCategoryIds([]);
      return;
    }

    const matched = findCategoryBySlug(categories, categorySlug);

    if (matched) {
      setSelectedCategoryIds(collectCategoryIds(matched));
    }
    }, 0);

    return () => clearTimeout(timer);
  }, [categorySlug, categories]);

  useEffect(() => {
    const timer = setTimeout(() => {
    if (products.length > 0) {
      setPriceRange(getProductPriceBounds(products));
    }
    }, 0);

    return () => clearTimeout(timer);
  }, [products]);

  const brands = useMemo(() => getUniqueBrands(products), [products]);

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        search: query,
        categoryIds: selectedCategoryIds,
        brands: selectedBrands,
        priceRange,
      }),
    [products, query, selectedCategoryIds, selectedBrands, priceRange]
  );

  const sorted = useMemo(
    () => sortProducts(filtered, sortBy),
    [filtered, sortBy]
  );

  const pagination = useMemo(
    () => paginateProducts(sorted, page, PER_PAGE),
    [sorted, page]
  );

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    priceRange[0] > priceBounds[0] ||
    priceRange[1] < priceBounds[1];

  const open = Boolean(anchorEl);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    setSearchParams(next);
  };

  const handleSort = (value) => {
    updateParams({ sort: value, page: 1 });
    setAnchorEl(null);
  };

  const handlePageChange = (_, value) => {
    updateParams({ page: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSelectedBrands([]);

    if (activeCategory) {
      setSelectedCategoryIds(collectCategoryIds(activeCategory));
    } else {
      setSelectedCategoryIds([]);
    }

    setPriceRange(priceBounds);
    updateParams({ page: 1 });
  };

  const pageTitle = query
    ? `Search: "${query}"`
    : activeCategory
      ? activeCategory.name
      : "All Products";

  const pageSubtitle = query
    ? `${pagination.totalItems} matching licenses & keys`
    : activeCategory?.description ||
    "Browse genuine software keys with instant digital delivery";

  const sidebarProps = {
    categories,
    brands,
    selectedCategoryIds,
    selectedBrands,
    priceRange,
    priceBounds,
    onCategoryChange: setSelectedCategoryIds,
    onBrandChange: setSelectedBrands,
    onPriceChange: setPriceRange,
  };

  const gridClass =
    gridCols === 1 ? "grid1" : gridCols === 2 ? "grid2" : "grid4";

  return (
    <section className="productListing">
      <div className="breadcrumbWrapper">
        <div className="container mx-auto px-4 lg:px-6">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link to="/" className="listingBreadcrumbLink">
              Home
            </Link>
            <Link to="/productListing" className="listingBreadcrumbLink">
              Products
            </Link>
            {activeCategory && (
              <Typography className="listingBreadcrumbCurrent">
                {activeCategory.name}
              </Typography>
            )}
            {query && !activeCategory && (
              <Typography className="listingBreadcrumbCurrent">
                Search
              </Typography>
            )}
          </Breadcrumbs>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 listingPageBody">
        <header className="listingPageHeader">
          <div className="listingPageHeaderMain">
            <span className="listingPageEyebrow">
              <HiOutlineKey />
              Digital licenses
            </span>
            <h1 className="listingTitle">{pageTitle}</h1>
            <p className="listingSubtitle">{pageSubtitle}</p>
          </div>

          {!loading && !loadError && (
            <div className="listingPageHeaderMeta">
              <strong>{pagination.totalItems}</strong>
              <span>products</span>
            </div>
          )}
        </header>

        <div className="listingLayout">
          <aside className="sidebarWrapper listingSidebarDesktop">
            <Sidebar {...sidebarProps} />
          </aside>

          <div className="productArea">
            <div className="productTopBar">
              <div className="productTopBarLeft">
                <div className="gridViewToggle" role="group" aria-label="Grid view">
                  <Button
                    type="button"
                    onClick={() => setGridCols(1)}
                    className={`gridBtn ${gridCols === 1 ? "active" : ""}`}
                    aria-label="List view"
                    aria-pressed={gridCols === 1}
                  >
                    <BsLayoutTextWindowReverse />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setGridCols(2)}
                    className={`gridBtn ${gridCols === 2 ? "active" : ""}`}
                    aria-label="Two columns"
                    aria-pressed={gridCols === 2}
                  >
                    <BsGrid />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setGridCols(4)}
                    className={`gridBtn ${gridCols === 4 ? "active" : ""}`}
                    aria-label="Grid view"
                    aria-pressed={gridCols === 4}
                  >
                    <BsGrid3X3GapFill />
                  </Button>
                </div>

                <span className="productCount">
                  Showing{" "}
                  <strong>
                    {pagination.items.length}
                  </strong>{" "}
                  of <strong>{pagination.totalItems}</strong>
                </span>
              </div>

              <div className="productTopBarRight">
                <Button
                  type="button"
                  className="filterBtn listingFilterMobileBtn"
                  onClick={() => setFilterOpen(true)}
                >
                  <IoFilter />
                  Filters
                </Button>

                <Button
                  type="button"
                  className="sortBtn"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  aria-haspopup="true"
                  aria-expanded={open}
                >
                  <BsSortDown />
                  {SORT_LABELS[sortBy] || "Sort By"}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <MenuItem
                      key={value}
                      selected={sortBy === value}
                      onClick={() => handleSort(value)}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>

            {(activeCategory || hasActiveFilters || query) && (
              <div className="listingActiveFilters">
                {activeCategory && (
                  <Link
                    to="/productListing"
                    className="listingFilterChip listingFilterChip--link"
                  >
                    {activeCategory.name}
                    <IoClose />
                  </Link>
                )}
                {selectedBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    className="listingFilterChip"
                    onClick={() =>
                      setSelectedBrands(
                        selectedBrands.filter((item) => item !== brand)
                      )
                    }
                  >
                    {brand}
                    <IoClose />
                  </button>
                ))}
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="listingClearFilters"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <ProductListingSkeleton count={PER_PAGE} />
            ) : loadError ? (
              <div className="listingState listingState--error">
                <p>{loadError}</p>
                <Button
                  type="button"
                  className="listingStateBtn"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </Button>
              </div>
            ) : pagination.items.length === 0 ? (
              <div className="listingState">
                <HiOutlineKey className="listingStateIcon" />
                <h3>No products found</h3>
                <p>Try another category or adjust your filters.</p>
                <Link to="/productListing" className="listingStateBtn">
                  View all products
                </Link>
              </div>
            ) : (
              <div className={`productGrid ${gridClass}`}>
                {pagination.items.map((item) => (
                  <ProductItem key={item.id} item={item} />
                ))}
              </div>
            )}

            {!loading && !loadError && pagination.totalPages > 1 && (
              <div className="customPagination">
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                  color="primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Drawer
        anchor="left"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        className="listingFilterDrawer"
        PaperProps={{ className: "listingFilterDrawerPaper" }}
      >
        <div className="listingFilterDrawerHead">
          <h3>Filters</h3>
          <button
            type="button"
            className="listingFilterDrawerClose"
            onClick={() => setFilterOpen(false)}
            aria-label="Close filters"
          >
            <IoClose />
          </button>
        </div>
        <div className="listingFilterDrawerBody">
          <Sidebar {...sidebarProps} />
        </div>
      </Drawer>
    </section>
  );
};

export default ProductListing;
