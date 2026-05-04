# Base Service

Shared service foundation used by all Robot services.

What it provides:

- `repoRootFolder` and `robotPackageFolder` constructor wiring
- common path helpers (`resolveRepoPath`, `resolveRobotPath`)

Usage intent:

- this base layer is internal to service implementations
- recipe authors should use service capabilities via recipe steps (`taskId` + `arguments`)
- direct subclassing in recipe files is out of scope
