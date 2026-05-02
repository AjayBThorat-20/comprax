import crypto from "crypto";
import fs from "fs";
import path from "path";

export function hashContent(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

export function loadCache(cacheDir) {
  const cacheFile = path.join(cacheDir, "file-cache.json");
  
  if (!fs.existsSync(cacheFile)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
  } catch {
    return {};
  }
}

export function saveCache(cacheDir, cache) {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const cacheFile = path.join(cacheDir, "file-cache.json");
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
}

export function getCachedData(filepath, cache) {
  return cache[filepath] || null;
}

export function setCachedData(filepath, content, processedData, cache) {
  cache[filepath] = {
    hash: hashContent(content),
    data: processedData
  };
}

export function hasFileChanged(filepath, content, cache) {
  const cached = cache[filepath];
  if (!cached) return true;
  
  const currentHash = hashContent(content);
  return cached.hash !== currentHash;
}
