import fs from "fs"
import path from "path"
import { formatDirectory, formatDirectoryHybrid } from "./formatter.js"

export function writeOrganized(organized, outputBase, projectName, summaryContent, mode = "basic", semantic = false) {
  const mainDir = path.join(outputBase, projectName)
  
  if (!fs.existsSync(mainDir)) {
    fs.mkdirSync(mainDir, { recursive: true })
  }

  fs.writeFileSync(
    path.join(mainDir, "_summary.txt"),
    summaryContent,
    "utf-8"
  )

  let filesWritten = 1

  for (const [dirName, files] of organized) {
    const content = (mode === "hybrid" || semantic)
      ? formatDirectoryHybrid(files, dirName, semantic)
      : formatDirectory(files, dirName)

    const filename = `${dirName.replace(/[/\\]/g, "_")}.txt`
    fs.writeFileSync(path.join(mainDir, filename), content, "utf-8")
    filesWritten++
  }

  return {
    mainDir,
    filesWritten
  }
}