// data.js
export async function fetchData() {
  const response = await fetch("http://localhost:8080/data");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}
