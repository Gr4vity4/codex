import { execSync } from "node:child_process";

/** Retrieve the owner/repo slug from git remote URL. */
function getRepoSlug(): string | null {
  try {
    const remote = execSync("git config --get remote.origin.url", {
      encoding: "utf8",
    }).trim();

  const match = remote.match(/github\.com[:/](.+)\.git$/);
  if (match && match[1]) {
    return match[1];
  }
  } catch {
    // ignore
  }
  return null;
}

/** Fetch diff text for a given PR number from GitHub. */
export async function fetchPrDiff(pr: number): Promise<string> {
  const slug = getRepoSlug();
  if (!slug) {
    throw new Error("Not a GitHub repository");
  }

  const url = `https://patch-diff.githubusercontent.com/raw/${slug}/pull/${pr}.diff`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch diff: ${res.status}`);
  }
  return res.text();
}
