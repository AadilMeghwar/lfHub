import { useEffect, useState } from "react";
import { api } from "../api";
import Sidebar from "./Sidebar";
import {
  RiSmartphoneLine,
  RiHandbagLine,
  RiKey2Line,
  RiEyeLine,
  RiSearchLine,
  RiLayoutGridLine,
  RiListUnordered,
} from "react-icons/ri";
import "../App.css";

// No photos in this dataset on purpose — each category maps to an icon
// that stands in for the item's picture in both list and grid view.
const CATEGORY_ICONS = {
  Electronics: RiSmartphoneLine,
  Bags: RiHandbagLine,
  Keys: RiKey2Line,
  Accessories: RiEyeLine,
Documents: RiEyeLine,
Clothing: RiEyeLine,
Other: RiEyeLine,
};

export default function BrowseItems({ user, onNavigate }) {
  const [view, setView] = useState("list"); // "list" | "grid"
  const [statusFilter, setStatusFilter] = useState("LOST"); // "ALL" | "LOST" | "FOUND"
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); api.reports(`type=${statusFilter}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&q=${encodeURIComponent(search)}`).then(r=>setItems(r.reports)).catch(console.error).finally(()=>setLoading(false)); }, [statusFilter, category, location, search]);
  

  const categories = ["All","Electronics","Bags","Documents","Accessories","Clothing","Keys","Other"];
  const locations = ["All Locations", ...new Set(items.map(item => item.location))];
  const filteredItems = items;

  return (
    <div className="dashboard-layout">
      <Sidebar active="Browse Items" onNavigate={onNavigate} user={user} />

      <main className="dashboard-main">
        <div className="browse-header">
          <div>
            <div className="dashboard-date">BROWSE</div>
            <h1 className="dashboard-greeting">All Reports</h1>
            <p className="dashboard-subtitle browse-count">
              {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="view-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${view === "grid" ? "active" : ""}`}
              onClick={() => setView("grid")}
            >
              <RiLayoutGridLine size={16} />
              grid
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
            >
              <RiListUnordered size={16} />
              list
            </button>
          </div>
        </div>

        <div className="browse-toolbar">
          <div className="browse-search">
            <RiSearchLine size={16} />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            {["ALL", "LOST", "FOUND"].map((s) => (
              <button
                key={s}
                type="button"
                className={`filter-pill ${s.toLowerCase()} ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <select
            className="browse-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="browse-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {loading ? <div className="empty-state">Loading reports...</div> : filteredItems.length === 0 ? (
          <div className="empty-state">No items match your filters.</div>
        ) : view === "list" ? (
          <div className="items-list">
            {filteredItems.map((item) => {
              const Icon = CATEGORY_ICONS[item.category];
              return (
                <div className="item-row" key={item.id}>
                  <div className={`item-icon ${item.type === "LOST" ? "lost" : "found"}`}>
                    <Icon size={22} />
                  </div>

                  <div className="item-row-info">
                    <div className="item-row-title-line">
                      <span className="item-title">{item.item_name}</span>
                      <span className={`tag ${item.type === "LOST" ? "lost" : "found"}`}>
                        {item.type}
                      </span>
                      {item.urgent && <span className="tag urgent">URGENT</span>}
                    </div>
                    <div className="item-desc">{item.description}</div>
                  </div>

                  <div className="item-row-meta">
                    <div className="item-location">{item.location}</div>
                    <div className="item-date">{new Date(item.report_date).toLocaleDateString()}</div>
                  </div>

                  <span className="tag category">{item.category}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map((item) => {
              const Icon = CATEGORY_ICONS[item.category];
              return (
                <div className="item-card" key={item.id}>
                  <div className={`item-card-visual ${item.type === "LOST" ? "lost" : "found"}`}>
                    <Icon size={40} />
                    <div className="item-card-tags">
                      <span className={`tag ${item.type === "LOST" ? "lost" : "found"}`}>
                        {item.type}
                      </span>
                      {item.urgent && <span className="tag urgent">URGENT</span>}
                    </div>
                  </div>

                  <div className="item-card-body">
                    <div className="item-title">{item.item_name}</div>
                    <div className="item-desc">{item.description}</div>
                    <div className="item-card-footer">
                      <div>
                        <div className="item-location">{item.location}</div>
                        <div className="item-date">{new Date(item.report_date).toLocaleDateString()}</div>
                      </div>
                      <span className="tag category">{item.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}