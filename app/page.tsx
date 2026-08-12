"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

type TabId = "overview" | "cctv" | "risk" | "rescue";
type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
type SourceStatus = "Online" | "Partial" | "Degraded" | "Offline";

const tabs: { id: TabId; label: string; stage: string }[] = [
  { id: "overview", label: "Overview", stage: "Overview" },
  { id: "cctv", label: "Real-Time CCTV", stage: "Monitor" },
  { id: "risk", label: "Flood Risk Management", stage: "Predict" },
  { id: "rescue", label: "Rescue Priority Management", stage: "Prioritize" },
];

const areas = [
  "Aceh Utara - Krueng Keureuto Basin",
  "Lhoksukon - Krueng Keureuto",
  "Matangkuli - Krueng Keureuto",
  "Tanah Luas",
  "Samudera - Krueng Pase",
  "Baktiya",
  "Tanah Jambo Aye",
  "Seunuddon",
];

const zones = [
  {
    id: "A",
    name: "Lhoksukon Riverside",
    risk: 89,
    trend: "Rising",
    sensorId: "AKU-R12",
    cameraId: "CCTV-AU-023",
    incidentId: "AU-023",
    people: 320,
    onset: "45-60 min",
    confidence: 91,
    impacts: ["3 roads", "1 school", "2 residential blocks", "1 bridge"],
    drivers: "Rapidly increasing Krueng Keureuto level and high rainfall intensity.",
    x: 52,
    y: 42,
  },
  {
    id: "B",
    name: "Matangkuli Floodplain",
    risk: 74,
    trend: "Rising",
    sensorId: "AKU-R10",
    cameraId: "CCTV-AU-002",
    incidentId: "AU-017",
    people: 260,
    onset: "75-90 min",
    confidence: 86,
    impacts: ["2 roads", "1 market area", "1 bridge"],
    drivers: "Upstream rainfall and rising Krueng Keureuto flow speed.",
    x: 36,
    y: 48,
  },
  {
    id: "C",
    name: "Tanah Luas",
    risk: 48,
    trend: "Steady",
    sensorId: "AKU-R08",
    cameraId: "CCTV-AU-007",
    incidentId: "AU-031",
    people: 140,
    onset: "2-3 hr",
    confidence: 79,
    impacts: ["1 local road", "drainage channels"],
    drivers: "Moderate rainfall with constrained drainage in low-lying areas.",
    x: 49,
    y: 58,
  },
  {
    id: "D",
    name: "Samudera",
    risk: 23,
    trend: "Steady",
    sensorId: "AKU-R06",
    cameraId: "CCTV-AU-012",
    incidentId: "AU-044",
    people: 90,
    onset: "No near-term onset",
    confidence: 73,
    impacts: ["minor riverbank exposure"],
    drivers: "Krueng Pase levels remain within monitored limits.",
    x: 62,
    y: 64,
  },
  {
    id: "E",
    name: "Baktiya",
    risk: 18,
    trend: "Falling",
    sensorId: "AKU-R04",
    cameraId: "CCTV-AU-003",
    incidentId: "AU-052",
    people: 70,
    onset: "No near-term onset",
    confidence: 71,
    impacts: ["rural access lanes"],
    drivers: "Rainfall has eased and river readings are stable.",
    x: 75,
    y: 34,
  },
  {
    id: "F",
    name: "Tanah Jambo Aye",
    risk: 41,
    trend: "Rising",
    sensorId: "AKU-R14",
    cameraId: "CCTV-AU-001",
    incidentId: "AU-061",
    people: 155,
    onset: "2-4 hr",
    confidence: 77,
    impacts: ["2 village roads", "1 health post"],
    drivers: "Localized heavy rainfall over northern catchments.",
    x: 82,
    y: 48,
  },
  {
    id: "G",
    name: "Seunuddon",
    risk: 67,
    trend: "Steady",
    sensorId: "AKU-R16",
    cameraId: "CCTV-AU-015",
    incidentId: "AU-072",
    people: 205,
    onset: "90-120 min",
    confidence: 82,
    impacts: ["coastal access road", "1 bridge", "residential clusters"],
    drivers: "Restricted drainage with persistent rainfall near coastal settlements.",
    x: 88,
    y: 28,
  },
];

const sensors = [
  { id: "AKU-R12", place: "Lhoksukon - Krueng Keureuto", level: 3.2, cctvLevel: 2.8, change: "+0.28 m/hr", risk: "HIGH", x: 54, y: 45 },
  { id: "AKU-R10", place: "Matangkuli", level: 2.6, cctvLevel: 2.4, change: "+0.20 m/hr", risk: "HIGH", x: 36, y: 50 },
  { id: "AKU-R08", place: "Tanah Luas", level: 1.9, cctvLevel: 1.7, change: "+0.12 m/hr", risk: "MODERATE", x: 50, y: 59 },
  { id: "AKU-R06", place: "Samudera - Krueng Pase", level: 1.3, cctvLevel: 1.2, change: "+0.05 m/hr", risk: "LOW", x: 63, y: 66 },
  { id: "AKU-R04", place: "Baktiya", level: 0.8, cctvLevel: 0.8, change: "0.00 m/hr", risk: "NORMAL", x: 74, y: 36 },
];

const cameras = [
  { id: "CCTV-AU-023", place: "Lhoksukon - Krueng Keureuto Riverside", status: "Live", sensorId: "AKU-R12", x: 56, y: 41 },
  { id: "CCTV-AU-002", place: "Matangkuli bridge approach", status: "Live", sensorId: "AKU-R10", x: 34, y: 46 },
  { id: "CCTV-AU-007", place: "Tanah Luas rural road", status: "Live", sensorId: "AKU-R08", x: 47, y: 57 },
  { id: "CCTV-AU-012", place: "Samudera - Krueng Pase crossing", status: "Live", sensorId: "AKU-R06", x: 65, y: 62 },
  { id: "CCTV-AU-003", place: "Baktiya roadside station", status: "Live", sensorId: "AKU-R04", x: 72, y: 32 },
  { id: "CCTV-AU-015", place: "Seunuddon access road", status: "Degraded", sensorId: "AKU-R16", x: 86, y: 25 },
];

const incidents = [
  {
    id: "AU-023",
    location: "Lhoksukon Riverside",
    detail: "Near Krueng Keureuto riverside",
    people: 8,
    vulnerable: 3,
    wait: "18 min",
    water: "1.8 m rising",
    road: "Blocked",
    priority: "P1",
    status: "Reported",
    team: "Rescue Team 2",
    recommendation: "Deploy Rescue Team 2 via accessible northern approach.",
    reasons: ["High flood severity", "Vulnerable individuals reported", "Access road blocked", "Water level rising", "Incident waiting 18 minutes"],
    x: 57,
    y: 43,
  },
  {
    id: "AU-017",
    location: "Matangkuli",
    detail: "Floodplain settlement west of Lhoksukon",
    people: 6,
    vulnerable: 1,
    wait: "24 min",
    water: "1.5 m rising",
    road: "Restricted",
    priority: "P2",
    status: "Acknowledged",
    team: "Rescue Team 4",
    recommendation: "Use high-clearance rescue vehicle from Matangkuli north road.",
    reasons: ["Restricted access", "Rising water", "One vulnerable person reported"],
    x: 36,
    y: 49,
  },
  {
    id: "AU-031",
    location: "Tanah Luas",
    detail: "Local road near drainage channel",
    people: 3,
    vulnerable: 0,
    wait: "32 min",
    water: "1.1 m rising",
    road: "Passable",
    priority: "P3",
    status: "Reported",
    team: "Rescue Team 5",
    recommendation: "Assign field verification and keep route open.",
    reasons: ["Road remains passable", "Lower reported water level", "No vulnerable people reported"],
    x: 48,
    y: 59,
  },
];

const events = [
  ["14:05", "Heavy rainfall detected", "High rainfall intensity recorded across the upper Krueng Keureuto monitoring area."],
  ["14:20", "Krueng Keureuto level rising", "Significant increase observed at monitoring stations near Lhoksukon and Matangkuli."],
  ["14:35", "CCTV shows water approaching riverside road", "Visual monitoring conditions changed near Lhoksukon riverside."],
  ["14:40", "Lhoksukon Riverside risk increased to 89%", "AI flood-risk classification updated based on simulated sensor inputs."],
];

const sources: { label: string; value: string; percent: number; status: SourceStatus }[] = [
  { label: "CCTV", value: "14 / 15", percent: 93, status: "Online" },
  { label: "Water Sensors", value: "12 / 12", percent: 100, status: "Online" },
  { label: "Rainfall Stations", value: "6 / 8", percent: 75, status: "Partial" },
  { label: "River Flow Gauges", value: "5 / 5", percent: 100, status: "Online" },
];

function getRiskLevel(value: number): RiskLevel {
  if (value >= 81) return "CRITICAL";
  if (value >= 61) return "HIGH";
  if (value >= 31) return "MODERATE";
  return "LOW";
}

function riskClass(value: number) {
  return getRiskLevel(value).toLowerCase();
}

function statusClass(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [area, setArea] = useState(areas[0]);
  const [selectedZoneId, setSelectedZoneId] = useState("A");
  const [selectedCameraId, setSelectedCameraId] = useState("CCTV-AU-023");
  const [selectedIncidentId, setSelectedIncidentId] = useState("AU-023");
  const [routeVisible, setRouteVisible] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const update = () =>
      setLastUpdated(
        new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date()),
      );
    update();
    const interval = window.setInterval(update, 60000);
    return () => window.clearInterval(interval);
  }, []);

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === selectedZoneId) ?? zones[0],
    [selectedZoneId],
  );
  const selectedCamera = useMemo(
    () => cameras.find((camera) => camera.id === selectedCameraId) ?? cameras[0],
    [selectedCameraId],
  );
  const selectedSensor = useMemo(
    () => sensors.find((sensor) => sensor.id === selectedCamera.sensorId) ??
      sensors.find((sensor) => sensor.id === selectedZone.sensorId) ??
      sensors[0],
    [selectedCamera.sensorId, selectedZone.sensorId],
  );
  const selectedIncident = useMemo(
    () => incidents.find((incident) => incident.id === selectedIncidentId) ?? incidents[0],
    [selectedIncidentId],
  );

  function selectZone(zoneId: string, nextTab?: TabId) {
    const zone = zones.find((item) => item.id === zoneId) ?? zones[0];
    setSelectedZoneId(zone.id);
    setSelectedCameraId(zone.cameraId);
    setSelectedIncidentId(zone.incidentId);
    if (nextTab) setActiveTab(nextTab);
  }

  function selectCamera(cameraId: string, nextTab?: TabId) {
    const camera = cameras.find((item) => item.id === cameraId) ?? cameras[0];
    const zone = zones.find((item) => item.cameraId === camera.id);
    setSelectedCameraId(camera.id);
    if (zone) {
      setSelectedZoneId(zone.id);
      setSelectedIncidentId(zone.incidentId);
    }
    if (nextTab) setActiveTab(nextTab);
  }

  function selectIncident(incidentId: string, nextTab?: TabId) {
    const incident = incidents.find((item) => item.id === incidentId) ?? incidents[0];
    const zone = zones.find((item) => item.incidentId === incident.id);
    setSelectedIncidentId(incident.id);
    if (zone) {
      setSelectedZoneId(zone.id);
      setSelectedCameraId(zone.cameraId);
    }
    if (nextTab) setActiveTab(nextTab);
  }

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="Global controls">
        <div className="brand-block">
          <div className="brand-mark">K</div>
          <div>
            <p className="eyebrow">Korea-ASEAN Flood Assistance System</p>
            <h1>K.A.F.A.</h1>
          </div>
        </div>
        <div className="geo-controls">
          <label>
            Country
            <select value="Indonesia" aria-label="Country">
              <option>Indonesia</option>
            </select>
          </label>
          <label>
            Province
            <select value="Aceh" aria-label="Province">
              <option>Aceh</option>
            </select>
          </label>
          <label>
            Area
            <select value={area} onChange={(event) => setArea(event.target.value)} aria-label="Operational area">
              {areas.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <nav className="tabs" aria-label="K.A.F.A. modules">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            <span>{tab.stage}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="context-strip">
        <strong>Prototype - simulated data for demonstration purposes.</strong>
        <span>Indonesia / Aceh / Aceh Utara / {area}</span>
        <span>Selected zone: Zone {selectedZone.id} - {selectedZone.name}</span>
      </section>

      {activeTab === "overview" && (
        <OverviewTab
          selectedZone={selectedZone}
          selectedSensor={selectedSensor}
          selectZone={selectZone}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "cctv" && (
        <CctvTab
          selectedCamera={selectedCamera}
          selectedSensor={selectedSensor}
          selectCamera={selectCamera}
          selectZone={selectZone}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "risk" && (
        <RiskTab
          selectedZone={selectedZone}
          selectedSensor={selectedSensor}
          selectZone={selectZone}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "rescue" && (
        <RescueTab
          selectedIncident={selectedIncident}
          selectedZone={selectedZone}
          routeVisible={routeVisible}
          selectIncident={selectIncident}
          setActiveTab={setActiveTab}
          setRouteVisible={setRouteVisible}
        />
      )}

      <footer className="footer">
        <span><strong>Last Updated:</strong> {lastUpdated || "Simulating current time"}</span>
        <a href="#policy">Data Policy</a>
        <a href="#guide">System Guide</a>
        <a href="#support">Support</a>
        <a href="#contact">Emergency Contact</a>
        <span className="footer-note">Prototype - simulated data for demonstration purposes.</span>
      </footer>
    </main>
  );
}

function OverviewTab({
  selectedZone,
  selectedSensor,
  selectZone,
  setActiveTab,
}: {
  selectedZone: (typeof zones)[number];
  selectedSensor: (typeof sensors)[number];
  selectZone: (zoneId: string, nextTab?: TabId) => void;
  setActiveTab: (tab: TabId) => void;
}) {
  return (
    <section className="tab-panel">
      <HeaderBlock title="Overview" subtitle="Real-time flood situation summary" />
      <KpiGrid>
        <KpiCard label="Highest Water Level" value="3.2 m" detail="Station AKU-R12 - Lhoksukon" tone="blue">
          <div className="sparkline" aria-label="Water-level sparkline"><span /></div>
          <strong className="trend rising">RISING</strong>
        </KpiCard>
        <KpiCard label="High-Risk Areas" value="4" detail="Zones" tone="red" />
        <KpiCard label="People Detected / Reported" value="327" detail="41 vulnerable" tone="neutral" />
        <KpiCard label="Active Data Sources" value="32 / 35" detail="91% online" tone="green">
          <div className="availability-ring" style={{ "--value": "91%" } as CSSProperties}>91%</div>
        </KpiCard>
      </KpiGrid>

      <div className="overview-grid">
        <div className="panel stack-panel">
          <PanelTitle title="Flood Risk List" meta="AI-generated simulated risk" />
          <div className="compact-table">
            {zones.slice(0, 4).map((zone) => (
              <button
                key={zone.id}
                className={`table-row ${selectedZone.id === zone.id ? "selected" : ""}`}
                onClick={() => selectZone(zone.id)}
                type="button"
              >
                <span>Zone {zone.id}</span>
                <strong>{zone.name}</strong>
                <span className={`risk-badge ${riskClass(zone.risk)}`}>{zone.risk}% {getRiskLevel(zone.risk)}</span>
              </button>
            ))}
          </div>
          <button className="primary-action" onClick={() => setActiveTab("risk")} type="button">
            View Flood Risk
          </button>

          <PanelTitle title="River Level List" meta="IoT sensor measurement" />
          <div className="river-list">
            {sensors.map((sensor) => (
              <button
                key={sensor.id}
                className={`sensor-row ${selectedSensor.id === sensor.id ? "selected" : ""}`}
                onClick={() => {
                  const zone = zones.find((item) => item.sensorId === sensor.id);
                  if (zone) selectZone(zone.id);
                }}
                type="button"
              >
                <span>{sensor.id}</span>
                <strong>{sensor.place}</strong>
                <b>{sensor.level.toFixed(1)} m</b>
                <em>{sensor.change}</em>
                <small>{sensor.risk}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="panel stack-panel">
          <PanelTitle title="Recent Events" meta="Aceh Utara operational timeline" />
          <div className="event-list">
            {events.map(([time, title, detail]) => (
              <article key={time}>
                <time>{time}</time>
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
              </article>
            ))}
          </div>

          <PanelTitle title="Data Source Status" meta="Monitoring availability" />
          <div className="source-grid">
            {sources.map((source) => (
              <article key={source.label} className="source-card">
                <span>{source.label}</span>
                <strong>{source.value}</strong>
                <div className="meter"><i style={{ width: `${source.percent}%` }} /></div>
                <small className={`status-dot ${statusClass(source.status)}`}>{source.percent}% {source.status}</small>
              </article>
            ))}
          </div>
        </div>

        <MapPanel
          title="Aceh Utara Flood Overview Map"
          mode="overview"
          selectedZone={selectedZone}
          onZoneSelect={(zoneId) => selectZone(zoneId)}
        />
      </div>
    </section>
  );
}

function CctvTab({
  selectedCamera,
  selectedSensor,
  selectCamera,
  selectZone,
  setActiveTab,
}: {
  selectedCamera: (typeof cameras)[number];
  selectedSensor: (typeof sensors)[number];
  selectCamera: (cameraId: string, nextTab?: TabId) => void;
  selectZone: (zoneId: string, nextTab?: TabId) => void;
  setActiveTab: (tab: TabId) => void;
}) {
  return (
    <section className="tab-panel">
      <HeaderBlock title="Real-Time CCTV" subtitle="CCTV, water-level sensor, and environmental monitoring" />
      <KpiGrid>
        <KpiCard label="Active Cameras" value="14 / 15" detail="93% online" tone="green" />
        <KpiCard label="Current Water Level" value={`${selectedSensor.cctvLevel.toFixed(1)} m`} detail={`${selectedSensor.id} IoT sensor reading`} tone="blue" />
        <KpiCard label="Rainfall" value="82 mm/hr" detail="Heavy rain - increasing" tone="amber" />
        <KpiCard label="Flow Speed" value="2.4 m/s" detail={`${selectedSensor.id} river flow`} tone="blue" />
      </KpiGrid>

      <div className="cctv-grid">
        <MapPanel
          title="Aceh Utara CCTV Monitoring Map"
          mode="cctv"
          selectedCamera={selectedCamera}
          onCameraSelect={(cameraId) => selectCamera(cameraId)}
          onZoneSelect={(zoneId) => selectZone(zoneId)}
        />
        <div className="panel cctv-feed-panel">
          <PanelTitle title={selectedCamera.id} meta={selectedCamera.place} />
          <div className="camera-scene" aria-label="Simulated municipal CCTV view of Krueng Keureuto">
            <div className="rain-layer" />
            <div className="clouds" />
            <div className="river" />
            <div className="embankment" />
            <div className="road" />
            <div className="bridge" />
            <div className="gauge"><span /></div>
            <div className="buildings"><i /><i /><i /></div>
            <div className="camera-osd">LIVE 14:42:08  Lhoksukon - Krueng Keureuto</div>
          </div>
          <div className="feed-caption">
            <strong>Observed information</strong>
            <span>Visual monitoring only. No AI detection boxes or automated people/vehicle detection are shown.</span>
          </div>
        </div>
        <div className="panel stack-panel">
          <PanelTitle title="Water-Level Sensor" meta="IoT sensor measurement" />
          <dl className="detail-list">
            <div><dt>Current Water Level</dt><dd>{selectedSensor.cctvLevel.toFixed(1)} m</dd></div>
            <div><dt>Trend</dt><dd>Rising</dd></div>
            <div><dt>Change</dt><dd>+0.18 m/hr</dd></div>
            <div><dt>Sensor</dt><dd>{selectedSensor.id}</dd></div>
            <div><dt>Location</dt><dd>{selectedSensor.place}</dd></div>
            <div><dt>Status</dt><dd><span className="status-dot online">Online</span></dd></div>
          </dl>

          <PanelTitle title="Environmental Information" meta="Simulated readings" />
          <div className="info-grid">
            <Info label="Rainfall" value="82 mm/hr" />
            <Info label="Temperature" value="27 C" />
            <Info label="Humidity" value="91%" />
            <Info label="Wind" value="18 km/h" />
            <Info label="Rainfall Trend" value="Increasing" />
            <Info label="Nearest Sensor" value={`${selectedSensor.id} / 120 m`} />
          </div>
          <button className="primary-action" onClick={() => setActiveTab("risk")} type="button">
            View Flood Risk
          </button>
        </div>
      </div>
    </section>
  );
}

function RiskTab({
  selectedZone,
  selectedSensor,
  selectZone,
  setActiveTab,
}: {
  selectedZone: (typeof zones)[number];
  selectedSensor: (typeof sensors)[number];
  selectZone: (zoneId: string, nextTab?: TabId) => void;
  setActiveTab: (tab: TabId) => void;
}) {
  const criticalZones = zones.filter((zone) => zone.risk >= 81).length;
  const averageRisk = Math.round(zones.reduce((total, zone) => total + zone.risk, 0) / zones.length);

  return (
    <section className="tab-panel">
      <HeaderBlock title="Flood Risk Management" subtitle="Prediction and impact visualization" />
      <KpiGrid>
        <KpiCard label="Critical Zones" value={String(criticalZones)} detail="zones" tone="red" />
        <KpiCard label="Average Risk" value={`${averageRisk}%`} detail="across all zones" tone="amber" />
        <KpiCard label="Predicted Exposed Population" value="1,240" detail="simulated estimated exposure" tone="neutral" />
      </KpiGrid>

      <div className="risk-workspace">
        <div className="panel stack-panel">
          <PanelTitle title="Flood Risk Zones" meta="AI-generated simulated predictions" />
          <div className="zone-list">
            {zones.map((zone) => (
              <button
                key={zone.id}
                className={`zone-item ${selectedZone.id === zone.id ? "selected" : ""}`}
                onClick={() => selectZone(zone.id)}
                type="button"
              >
                <span>Zone {zone.id}</span>
                <strong>{zone.name}</strong>
                <em>{zone.trend}</em>
                <b className={`risk-badge ${riskClass(zone.risk)}`}>{zone.risk}% {getRiskLevel(zone.risk)}</b>
              </button>
            ))}
          </div>
        </div>

        <MapPanel
          title="Flood Risk Map - Aceh Utara"
          mode="risk"
          selectedZone={selectedZone}
          onZoneSelect={(zoneId) => selectZone(zoneId)}
        />

        <div className="panel stack-panel">
          <PanelTitle title={`Zone ${selectedZone.id}`} meta={selectedZone.name} />
          <div className="risk-score-card">
            <span className={`risk-badge ${riskClass(selectedZone.risk)}`}>{getRiskLevel(selectedZone.risk)}</span>
            <strong>{selectedZone.risk}%</strong>
            <div className="meter"><i className={riskClass(selectedZone.risk)} style={{ width: `${selectedZone.risk}%` }} /></div>
            <small>AI-generated simulated prediction</small>
          </div>

          <dl className="detail-list">
            <div><dt>AI Confidence</dt><dd>{selectedZone.confidence}% High</dd></div>
            <div><dt>Predicted Flood Onset</dt><dd>{selectedZone.onset}</dd></div>
            <div><dt>River Level</dt><dd>{selectedSensor.place} / {selectedSensor.level.toFixed(1)} m rising</dd></div>
            <div><dt>Rainfall</dt><dd>82 mm/hr rising</dd></div>
            <div><dt>Flow Speed</dt><dd>2.4 m/s rising</dd></div>
            <div><dt>CCTV Observation</dt><dd>Visual conditions available from {selectedZone.cameraId}</dd></div>
          </dl>

          <PanelTitle title="AI Explainability" meta="Primary drivers" />
          <p className="plain-text">{selectedZone.drivers}</p>
          <div className="influence-list">
            {["River Level - Very High", "Rainfall - High", "Flow Speed - Moderate", "Local Terrain - Moderate"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <PanelTitle title="Potential Impact" meta="Simulated estimate within modeled flood-impact area" />
          <div className="impact-list">
            {selectedZone.impacts.map((impact) => <span key={impact}>{impact}</span>)}
          </div>
          <div className="population-box">
            <span>Estimated affected population</span>
            <strong>~{selectedZone.people} people</strong>
          </div>
          <div className="button-row">
            <button className="secondary-action" onClick={() => setActiveTab("cctv")} type="button">View CCTV</button>
            <button className="primary-action" onClick={() => setActiveTab("rescue")} type="button">View Rescue Priority</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RescueTab({
  selectedIncident,
  selectedZone,
  routeVisible,
  selectIncident,
  setActiveTab,
  setRouteVisible,
}: {
  selectedIncident: (typeof incidents)[number];
  selectedZone: (typeof zones)[number];
  routeVisible: boolean;
  selectIncident: (incidentId: string, nextTab?: TabId) => void;
  setActiveTab: (tab: TabId) => void;
  setRouteVisible: (visible: boolean) => void;
}) {
  return (
    <section className="tab-panel">
      <HeaderBlock title="Rescue Priority Management" subtitle="Operational rescue incident prioritization" />
      <KpiGrid>
        <KpiCard label="Priority 1 Incidents" value="3" detail="Requires immediate response" tone="red" />
        <KpiCard label="Total People Awaiting Rescue" value="27" detail="Across active incidents" tone="neutral" />
        <KpiCard label="Vulnerable Individuals" value="9" detail="Children, elderly, medical, mobility assistance" tone="amber" />
        <KpiCard label="Available Rescue Teams" value="5" detail="Ready for deployment" tone="green" />
      </KpiGrid>

      <div className="rescue-grid">
        <MapPanel
          title="Aceh Utara Rescue Incident Map"
          mode="rescue"
          selectedZone={selectedZone}
          selectedIncident={selectedIncident}
          routeVisible={routeVisible}
          onIncidentSelect={(incidentId) => selectIncident(incidentId)}
        />
        <div className="panel stack-panel">
          <PanelTitle title={`Incident #${selectedIncident.id}`} meta={selectedIncident.location} />
          <dl className="detail-list">
            <div><dt>Location</dt><dd>{selectedIncident.detail}</dd></div>
            <div><dt>People</dt><dd>{selectedIncident.people} people</dd></div>
            <div><dt>Vulnerable People</dt><dd>{selectedIncident.vulnerable}</dd></div>
            <div><dt>Road Status</dt><dd>{selectedIncident.road}</dd></div>
            <div><dt>Time Reported</dt><dd>{selectedIncident.wait} ago</dd></div>
            <div><dt>Flood Conditions</dt><dd>{selectedIncident.water}</dd></div>
            <div><dt>Source</dt><dd>Community Report</dd></div>
          </dl>

          <div className="recommendation">
            <span>AI rescue recommendation</span>
            <strong>{selectedIncident.priority} - Immediate response recommended</strong>
            <p>{selectedIncident.recommendation}</p>
            <ul>
              {selectedIncident.reasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
            <small>Advisory decision support only. No automatic dispatch.</small>
          </div>

          <div className="button-row">
            <button className="primary-action" onClick={() => setRouteVisible(!routeVisible)} type="button">
              {routeVisible ? "Hide Route" : "View Route"}
            </button>
            <button className="secondary-action" onClick={() => setActiveTab("cctv")} type="button">View CCTV</button>
            <button className="secondary-action" onClick={() => setActiveTab("risk")} type="button">View Flood Risk</button>
          </div>
        </div>
      </div>

      <div className="panel table-panel">
        <PanelTitle title="Active Incidents Ranked Table" meta="Ranking represents operational urgency of incidents, not the worth of people" />
        <div className="wide-table" role="table" aria-label="Active rescue incidents">
          <div className="wide-row head" role="row">
            <span>Rank</span><span>Incident</span><span>Location</span><span>People</span><span>Vulnerable</span><span>Wait</span><span>Water</span><span>Road</span><span>Priority</span><span>Status</span>
          </div>
          {incidents.map((incident, index) => (
            <button
              key={incident.id}
              className={`wide-row ${selectedIncident.id === incident.id ? "selected" : ""}`}
              onClick={() => selectIncident(incident.id)}
              type="button"
              role="row"
            >
              <span>{index + 1}</span><span>{incident.id}</span><strong>{incident.location}</strong><span>{incident.people}</span><span>{incident.vulnerable}</span><span>{incident.wait}</span><span>{incident.water}</span><span>{incident.road}</span><span>{incident.priority}</span><span>{incident.status}</span>
            </button>
          ))}
        </div>
        <div className="team-strip">
          {["Rescue Team 1 - En Route", "Rescue Team 2 - Available", "Rescue Team 3 - On Scene", "Rescue Team 4 - Available", "Rescue Team 5 - Available"].map((team) => (
            <span key={team}>{team}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapPanel({
  title,
  mode,
  selectedZone,
  selectedCamera,
  selectedIncident,
  routeVisible = false,
  onZoneSelect,
  onCameraSelect,
  onIncidentSelect,
}: {
  title: string;
  mode: "overview" | "cctv" | "risk" | "rescue";
  selectedZone?: (typeof zones)[number];
  selectedCamera?: (typeof cameras)[number];
  selectedIncident?: (typeof incidents)[number];
  routeVisible?: boolean;
  onZoneSelect?: (zoneId: string) => void;
  onCameraSelect?: (cameraId: string) => void;
  onIncidentSelect?: (incidentId: string) => void;
}) {
  const showRisk = mode === "overview" || mode === "risk" || mode === "rescue";
  const showCctv = mode === "overview" || mode === "cctv" || mode === "risk";
  const showSensors = mode === "overview" || mode === "cctv" || mode === "risk";
  const showIncidents = mode === "rescue";

  return (
    <div className={`panel map-panel ${mode}`}>
      <PanelTitle title={title} meta="Shared Aceh Utara GIS foundation" />
      <div className="map-canvas" aria-label={title}>
        <div className="terrain sea" />
        <div className="terrain basin" />
        <div className="river-line keureuto" />
        <div className="river-line pirak" />
        <div className="river-line pase" />
        <div className="road-line corridor" />
        <div className="road-line north" />
        <div className="road-line local" />
        <span className="place lhoksukon">Lhoksukon</span>
        <span className="place matang">Matangkuli</span>
        <span className="place tanah">Tanah Luas</span>
        <span className="place samudera">Samudera</span>
        <span className="place baktiya">Baktiya</span>
        <span className="place seunuddon">Seunuddon</span>
        <span className="river-label k">Krueng Keureuto</span>
        <span className="river-label p">Krueng Pirak</span>
        <span className="river-label s">Krueng Pase</span>
        <span className="road-label">Banda Aceh-Medan corridor</span>
        {showRisk && zones.map((zone) => (
          <button
            key={zone.id}
            className={`risk-poly ${riskClass(zone.risk)} ${selectedZone?.id === zone.id ? "selected" : ""}`}
            style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            onClick={() => onZoneSelect?.(zone.id)}
            type="button"
            aria-label={`Zone ${zone.id} ${zone.name} risk ${zone.risk}%`}
          >
            {zone.id}
          </button>
        ))}
        {showSensors && sensors.map((sensor) => (
          <button
            key={sensor.id}
            className="map-marker sensor"
            style={{ left: `${sensor.x}%`, top: `${sensor.y}%` }}
            onClick={() => {
              const zone = zones.find((item) => item.sensorId === sensor.id);
              if (zone) onZoneSelect?.(zone.id);
            }}
            type="button"
            aria-label={`${sensor.id} ${sensor.place}`}
          >
            S
          </button>
        ))}
        {showCctv && cameras.map((camera) => (
          <button
            key={camera.id}
            className={`map-marker camera ${selectedCamera?.id === camera.id ? "selected" : ""}`}
            style={{ left: `${camera.x}%`, top: `${camera.y}%` }}
            onClick={() => onCameraSelect?.(camera.id)}
            type="button"
            aria-label={`${camera.id} ${camera.place}`}
          >
            C
          </button>
        ))}
        {showIncidents && incidents.map((incident) => (
          <button
            key={incident.id}
            className={`map-marker incident ${incident.priority.toLowerCase()} ${selectedIncident?.id === incident.id ? "selected" : ""}`}
            style={{ left: `${incident.x}%`, top: `${incident.y}%` }}
            onClick={() => onIncidentSelect?.(incident.id)}
            type="button"
            aria-label={`Incident ${incident.id} ${incident.priority}`}
          >
            {incident.priority.replace("P", "")}
          </button>
        ))}
        {mode === "rescue" && (
          <>
            <span className="base-marker">Base</span>
            {routeVisible && <div className="route-line" />}
            {routeVisible && <span className="route-label">Simulated route - 12 min</span>}
          </>
        )}
        <div className="map-legend">
          <span><i className="legend-low" />Low 0-30%</span>
          <span><i className="legend-moderate" />Moderate 31-60%</span>
          <span><i className="legend-high" />High 61-80%</span>
          <span><i className="legend-critical" />Critical 81-100%</span>
        </div>
      </div>
    </div>
  );
}

function HeaderBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="module-header">
      <div>
        <p className="eyebrow">Indonesia / Aceh / Aceh Utara</p>
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>
      <div className="workflow">Overview / Monitor / Predict / Prioritize</div>
    </div>
  );
}

function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="kpi-grid">{children}</div>;
}

function KpiCard({
  label,
  value,
  detail,
  tone,
  children,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "red" | "green" | "amber" | "neutral";
  children?: ReactNode;
}) {
  return (
    <article className={`kpi-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
      {children}
    </article>
  );
}

function PanelTitle({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="panel-title">
      <h3>{title}</h3>
      {meta && <span>{meta}</span>}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
