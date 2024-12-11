export class MissingPermissionError extends Error {
  constructor(public missingPermission: string) {
    super('missing_permission');
  }
}
