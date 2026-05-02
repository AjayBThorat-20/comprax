export function scoreStructure(structure) {
  if (!structure) return 0;

  let score = 0;

  score += structure.exports.length * 5;
  score += structure.functions.length * 2;
  score += structure.classes.length * 3;
  score += Math.min(structure.imports.length, 10);

  return score;
}

export function shouldIncludeFile(structure, options = {}) {
  if (!options.smart) return true;
  
  const threshold = options.threshold || 5;
  const score = scoreStructure(structure);
  
  return score >= threshold;
}