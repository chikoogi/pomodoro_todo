export async function loadComponent(path, targetElementId) {
  try {
    const response = await fetch(path);
    const t = await response.text();
    document.getElementById(targetElementId).innerHTML = t;
  } catch (error) {
    console.error(`Failed to load component from ${path}:`, error);
  }
}
