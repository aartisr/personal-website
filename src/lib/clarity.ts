export const clarityProjectIdEnvVar = "NEXT_PUBLIC_MICROSOFT_CLARITY_ID";

export function getMicrosoftClarityProjectId() {
  const projectId = process.env[clarityProjectIdEnvVar]?.trim();

  return projectId || null;
}
