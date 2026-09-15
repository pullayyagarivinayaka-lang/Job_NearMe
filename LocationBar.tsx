"use client";

import { useState } from "react";
import { MapPin, Navigation, ChevronDown } from "lucide-react";
import { useAppData } from "./AppDataProvider";

const CITIES = [
  { label: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { label: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { label: "Mumbai", lat: 19.076, lng: 72.8777 },
  { label: "Delhi NCR", lat: 28.6139, lng: 77.209 },
  { label: "Chennai", lat: 13.0827, lng: 80.2707 },
  { label: "Pune", lat: 18.5204, lng: 73.8567 },
];

export function LocationBar() {
  const { location, requestGpsLocation, setManualLocation } = useAppData();
  const [open, setOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const handleGps = async () => {
    setRequesting(true);
    await requestGpsLocation();
    setRequesting(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:border-brand-300 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
      >
        <MapPin className="h-4 w-4 text-brand-500" aria-hidden />
        <span className="max-w-[160px] truncate">{location.label}</span>
        <ChevronDown className="h-4 w-4 text-ink-400" aria-hidden />
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-2 w-64 rounded-xl border border-ink-100 bg-white p-3 shadow-lg dark:border-ink-800 dark:bg-ink-900">
          <button
            onClick={handleGps}
            disabled={requesting}
            className="mb-3 flex w-full items-center gap-2 rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300 dark:hover:bg-brand-900"
          >
            <Navigation className="h-4 w-4" aria-hidden />
            {requesting ? "Getting your location..." : "Use my current location"}
          </button>

          {location.permissionDenied && (
            <p className="mb-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              Location access was denied. Enable it in your browser settings, or pick a city below.
            </p>
          )}

          <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
            Or choose a city
          </p>
          <div className="flex flex-col">
            {CITIES.map((c) => (
              <button
                key={c.label}
                onClick={() => {
                  setManualLocation(c.label, c.lat, c.lng);
                  setOpen(false);
                }}
                className="rounded-lg px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-800"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
