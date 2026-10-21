
const STORAGE_KEY = "heightx_safety_alerts";

const listeners = new Set();

function generateUniqueAlertId(existingIds = new Set()) {
  let id;

  do {
    id = `alert-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  } while (existingIds.has(id));

  return id;
}

// Load saved alerts and repair duplicate or missing IDs.
function loadSafetyAlerts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    const usedIds = new Set();

    return parsed.map((alert) => {
      const originalId = alert?.id;
      const normalizedId =
        originalId == null ? "" : String(originalId).trim();

      if (normalizedId && !usedIds.has(normalizedId)) {
        usedIds.add(normalizedId);

        return {
          ...alert,
          id: originalId,
        };
      }

      const newId = generateUniqueAlertId(usedIds);
      usedIds.add(newId);

      return {
        ...alert,
        id: newId,
      };
    });
  } catch (error) {
    console.error("Failed to load safety alerts:", error);
    return [];
  }
}

let safetyAlerts = loadSafetyAlerts();

function saveSafetyAlerts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safetyAlerts));
  } catch (error) {
    console.error("Failed to save safety alerts:", error);
  }
}

// Persist repaired IDs immediately after loading.
saveSafetyAlerts();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(getSafetyAlerts());
    } catch (error) {
      console.error("Safety alert listener failed:", error);
    }
  });
}

function addHistoryEntry(alert, action, details = "") {
  return [
    ...(alert.history || []),
    {
      action,
      details,
      timestamp: new Date().toISOString(),
    },
  ];
}

export function getSafetyAlerts() {
  return safetyAlerts;
}

export function getActiveSafetyAlerts() {
  return safetyAlerts.filter((alert) => !alert.closed);
}

export function getActiveSafetyAlertCount() {
  return getActiveSafetyAlerts().length;
}

export function getUnacknowledgedSafetyAlertCount() {
  return getActiveSafetyAlerts().filter(
    (alert) => !alert.acknowledged
  ).length;
}

export function subscribeToSafetyAlerts(callback) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

export function addSafetyAlert({
  id,
  cameraId,
  cameraLabel,
  location,
  area,
  zone,
  title,
  severity = "medium",
  details = "",
  confidence = null,
  source = "demo",
  evidenceUrl = null,
  detectedAt = null,
}) {
  const now = new Date().toISOString();

  // Prevent the same active incident from being added repeatedly.
  const duplicate = safetyAlerts.find(
    (alert) =>
      !alert.closed &&
      String(alert.cameraId ?? "") === String(cameraId ?? "") &&
      alert.title === (title || "Safety Incident") &&
      (alert.source || "demo") === source
  );

  if (duplicate) {
    return duplicate;
  }

  // Never reuse an existing alert ID.
  const existingIds = new Set(
    safetyAlerts.map((alert) => String(alert.id))
  );

  const requestedId = id == null ? "" : String(id).trim();

  const alertId =
    requestedId && !existingIds.has(requestedId)
      ? id
      : generateUniqueAlertId(existingIds);

  const newAlert = {
    id: alertId,
    cameraId: cameraId ?? null,
    cameraLabel:
      cameraLabel ||
      (cameraId ? `Camera ${cameraId}` : "Unknown Camera"),
    location: location || "Unknown Location",
    area: area || "",
    zone: zone || "",
    title: title || "Safety Incident",
    severity,
    details,
    confidence,
    source,
    demo: source === "demo",
    evidenceUrl,
    detectedAt: detectedAt || now,
    createdAt: now,
    updatedAt: now,
    acknowledged: false,
    acknowledgedAt: null,
    acknowledgedBy: null,
    closed: false,
    closedAt: null,
    closedBy: null,
    resolutionNotes: "",
    history: [
      {
        action: "created",
        details: "Safety alert created",
        timestamp: now,
      },
    ],
  };

  safetyAlerts = [newAlert, ...safetyAlerts];

  saveSafetyAlerts();
  notifyListeners();

  return newAlert;
}

export function updateSafetyAlert(alertId, updates = {}) {
  let updatedAlert = null;
  const now = new Date().toISOString();

  safetyAlerts = safetyAlerts.map((alert) => {
    if (String(alert.id) !== String(alertId)) {
      return alert;
    }

    const next = {
      ...alert,
      ...updates,
      id: alert.id,
      updatedAt: now,
    };

    if (updates.acknowledged === true && !alert.acknowledged) {
      next.acknowledgedAt = now;
      next.acknowledgedBy =
        updates.acknowledgedBy ?? alert.acknowledgedBy ?? null;

      next.history = addHistoryEntry(
        next,
        "acknowledged",
        updates.acknowledgedBy
          ? `Acknowledged by ${updates.acknowledgedBy}`
          : "Alert acknowledged"
      );
    }

    if (updates.closed === true && !alert.closed) {
      next.closedAt = now;
      next.closedBy = updates.closedBy ?? alert.closedBy ?? null;
      next.acknowledged = true;
      next.acknowledgedAt = next.acknowledgedAt || now;
      next.resolutionNotes =
        updates.resolutionNotes ?? alert.resolutionNotes ?? "";

      next.history = addHistoryEntry(
        next,
        "closed",
        next.resolutionNotes || "Alert closed"
      );
    }

    updatedAlert = next;
    return next;
  });

  if (updatedAlert) {
    saveSafetyAlerts();
    notifyListeners();
  }

  return updatedAlert;
}

export function acknowledgeSafetyAlert(
  alertId,
  acknowledgedBy = null
) {
  return updateSafetyAlert(alertId, {
    acknowledged: true,
    acknowledgedBy,
  });
}

export function acknowledgeAllSafetyAlerts(
  predicate = () => true,
  acknowledgedBy = null
) {
  const ids = safetyAlerts
    .filter(
      (alert) =>
        !alert.closed &&
        !alert.acknowledged &&
        predicate(alert)
    )
    .map((alert) => alert.id);

  ids.forEach((id) => {
    acknowledgeSafetyAlert(id, acknowledgedBy);
  });

  return ids.length;
}

export function closeSafetyAlert(
  alertId,
  { closedBy = null, resolutionNotes = "" } = {}
) {
  return updateSafetyAlert(alertId, {
    closed: true,
    acknowledged: true,
    closedBy,
    resolutionNotes,
  });
}

// Close active demo alerts when a camera returns to normal.
// Keep closed alerts in history.
export function resetDemoAlertsForCamera(cameraId) {
  const ids = safetyAlerts
    .filter(
      (alert) =>
        String(alert.cameraId) === String(cameraId) &&
        (alert.source || "demo") === "demo" &&
        !alert.closed
    )
    .map((alert) => alert.id);

  ids.forEach((id) => {
    closeSafetyAlert(id, {
      closedBy: "System",
      resolutionNotes: "Demo scenario returned to normal",
    });
  });

  return ids.length;
}

// Permanently clear all saved alerts. Use only when explicitly needed.
export function clearAllSafetyAlerts() {
  safetyAlerts = [];
  saveSafetyAlerts();
  notifyListeners();
}
