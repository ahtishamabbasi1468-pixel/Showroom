import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CarCard from "../components/common/CarCard";
import { CardSkeleton } from "../components/common/Loader";
import {
  setSearch, setCategory, setBrand, setPriceRange, setSort, resetFilters, selectFilteredCars,
} from "../features/cars/carsSlice";

const PAGE_SIZE = 6;

export default function Cars() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const filters = useSelector((s) => s.cars.filters);
  const cars = useSelector(selectFilteredCars);
  const adminCategories = useSelector((s) => s.admin.categories);
  const adminBrands = useSelector((s) => s.admin.brands);
  // Admin-managed lists (Catalog -> Brands / Categories) drive the filter
  // options; falls back to whatever's on the cars themselves if admin hasn't
  // added dedicated brand/category entries yet.
  const CATEGORIES = ["All", ...(adminCategories.length ? adminCategories.map((c) => c.name) : [...new Set(cars.map((c) => c.category))])];
  const BRANDS = ["All", ...(adminBrands.length ? adminBrands.map((b) => b.name) : [...new Set(cars.map((c) => c.brand))])];
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) dispatch(setCategory(category));
  }, [searchParams, dispatch]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => setPage(1), [filters]);

  const totalPages = Math.max(1, Math.ceil(cars.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => cars.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [cars, page]
  );

  return (
    <section className="section cars-page">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Inventory</span>
            <h1 className="fs-h1">Browse the full lot</h1>
          </div>
          <span className="text-muted mono">{cars.length} cars matched</span>
        </div>

        <div className="cars-layout">
          {/* ---- Filters ---- */}
          <aside className="filters-panel card">
            <div className="field">
              <label htmlFor="search">Search</label>
              <input
                id="search"
                placeholder="Brand or model…"
                value={filters.search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
            </div>

            <div className="field">
              <label htmlFor="category">Category</label>
              <select id="category" value={filters.category} onChange={(e) => dispatch(setCategory(e.target.value))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="brand">Brand</label>
              <select id="brand" value={filters.brand} onChange={(e) => dispatch(setBrand(e.target.value))}>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Max Price · <span className="mono">${filters.maxPrice.toLocaleString()}</span></label>
              <input
                type="range"
                min="20000"
                max="100000"
                step="1000"
                value={filters.maxPrice}
                onChange={(e) => dispatch(setPriceRange({ min: filters.minPrice, max: Number(e.target.value) }))}
              />
            </div>

            <div className="field">
              <label htmlFor="sort">Sort by</label>
              <select id="sort" value={filters.sort} onChange={(e) => dispatch(setSort(e.target.value))}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="year">Newest Year</option>
              </select>
            </div>

            <button className="btn btn-ghost btn-block btn-sm" onClick={() => dispatch(resetFilters())}>
              Reset Filters
            </button>
          </aside>

          {/* ---- Results ---- */}
          <div className="cars-results">
            {loading ? (
              <CardSkeleton count={6} />
            ) : cars.length === 0 ? (
              <div className="empty-state card">
                <h3>No cars match those filters</h3>
                <p className="text-muted">Try widening the price range or clearing a filter.</p>
                <button className="btn btn-primary btn-sm" onClick={() => dispatch(resetFilters())}>Reset Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-3">
                  {pageItems.map((car, i) => (
                    <CarCard car={car} key={car.id} index={i} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`page-num ${page === i + 1 ? "is-active" : ""}`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
