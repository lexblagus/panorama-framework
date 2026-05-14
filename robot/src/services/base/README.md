# Base Service

Shared service foundation used by all Robot services.

What it provides:

- `repoRootFolder` and `robotPackageFolder` constructor wiring
- common path helpers (`resolveRepoPath`, `resolveRobotPath`)
- `resolveRepoPath` enforces that resolved paths stay within `repoRootFolder` — paths escaping the repo root throw at runtime.

Usage intent:

- this base layer is internal to service implementations
- recipe authors should use service capabilities via recipe steps (`taskId` + `arguments`)
- direct subclassing in recipe files is out of scope
