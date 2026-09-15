"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Application, ApplicationStatus, UserProfile } from "@/types";
import { sampleApplications, sampleProfile } from "@/lib/mockData";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  label: string;
  source: "gps" | "manual" | "profile" | null;
  permissionDenied: boolean;
}

interface AppDataContextValue {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  savedJobIds: string[];
  applications: Application[];
  location: LocationState;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleSaveJob: (jobId: string) => void;
  applyToJob: (jobId: string, method: "one-click" | "external") => void;
  requestGpsLocation: () => Promise<void>;
  setManualLocation: (label: string, lat: number, lng: number) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

const STORAGE_KEY = "jobnearme-state-v1";

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    label: "Set your location",
    source: null,
    permissionDenied: false,
  });

  // Hydrate from localStorage on mount (stand-in for a Supabase session fetch)
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setIsAuthenticated(parsed.isAuthenticated ?? false);
        setProfile(parsed.profile ?? null);
        setSavedJobIds(parsed.savedJobIds ?? []);
        setApplications(parsed.applications ?? []);
        if (parsed.location) setLocation(parsed.location);
      } catch {
        // ignore corrupted state
      }
    }
  }, []);

  const persist = useCallback(
    (next: Partial<{
      isAuthenticated: boolean;
      profile: UserProfile | null;
      savedJobIds: string[];
      applications: Application[];
      location: LocationState;
    }>) => {
      const current = {
        isAuthenticated,
        profile,
        savedJobIds,
        applications,
        location,
        ...next,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    },
    [isAuthenticated, profile, savedJobIds, applications, location]
  );

  const login = (email: string) => {
    // Demo auth: in production this calls supabase.auth.signInWithPassword / OAuth.
    const nextProfile = { ...sampleProfile, email };
    setIsAuthenticated(true);
    setProfile(nextProfile);
    setApplications(sampleApplications);
    persist({ isAuthenticated: true, profile: nextProfile, applications: sampleApplications });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    setApplications([]);
    setSavedJobIds([]);
    persist({ isAuthenticated: false, profile: null, applications: [], savedJobIds: [] });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = prev ? { ...prev, ...updates } : null;
      persist({ profile: next });
      return next;
    });
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const next = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      persist({ savedJobIds: next });
      return next;
    });
  };

  const applyToJob = (jobId: string, method: "one-click" | "external") => {
    setApplications((prev) => {
      if (prev.some((a) => a.jobId === jobId)) return prev;
      // Honesty rule: only mark "applied" for submissions we actually sent
      // (one-click). External portal hand-offs are recorded as "redirected"
      // since we can't confirm the user finished the application there.
      const status: ApplicationStatus = method === "one-click" ? "applied" : "redirected";
      const next: Application[] = [
        {
          id: `app-${Date.now()}`,
          jobId,
          appliedDate: new Date().toISOString(),
          status,
          method,
        },
        ...prev,
      ];
      persist({ applications: next });
      return next;
    });
  };

  const updateApplicationStatus = (applicationId: string, status: ApplicationStatus) => {
    setApplications((prev) => {
      const next = prev.map((a) => (a.id === applicationId ? { ...a, status } : a));
      persist({ applications: next });
      return next;
    });
  };

  const requestGpsLocation = async () => {
    if (!("geolocation" in navigator)) {
      setLocation((prev) => ({ ...prev, permissionDenied: true }));
      return;
    }
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const next: LocationState = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            label: "Current location",
            source: "gps",
            permissionDenied: false,
          };
          setLocation(next);
          persist({ location: next });
          resolve();
        },
        () => {
          setLocation((prev) => ({ ...prev, permissionDenied: true }));
          resolve();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  const setManualLocation = (label: string, lat: number, lng: number) => {
    const next: LocationState = {
      latitude: lat,
      longitude: lng,
      label,
      source: "manual",
      permissionDenied: false,
    };
    setLocation(next);
    persist({ location: next });
  };

  return (
    <AppDataContext.Provider
      value={{
        isAuthenticated,
        profile,
        savedJobIds,
        applications,
        location,
        login,
        logout,
        updateProfile,
        toggleSaveJob,
        applyToJob,
        requestGpsLocation,
        setManualLocation,
        updateApplicationStatus,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
