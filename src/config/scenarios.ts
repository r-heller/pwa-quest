// Scenario dropdown options. Edit this list to match your study.
// Keep IDs short, machine-friendly, and stable across deployments — they end
// up in exported filenames and data files.

export interface ScenarioOption {
  id: string;
  label: string;
}

export const SCENARIOS: ScenarioOption[] = [
  { id: 'scenario-A', label: 'Scenario A — Baseline task' },
  { id: 'scenario-B', label: 'Scenario B — Guided task' },
  { id: 'scenario-C', label: 'Scenario C — High-load task' },
  { id: 'scenario-D', label: 'Scenario D — Recovery task' },
  { id: 'pilot', label: 'Pilot / dry run' },
];

export function isValidScenario(id: string): boolean {
  return SCENARIOS.some((s) => s.id === id);
}
