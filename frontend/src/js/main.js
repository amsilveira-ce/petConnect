document.getElementById("ctaBtn").addEventListener("click", async () => {
  const res = await fetch("/api/hello");
  const data = await res.json();
  alert(data.message);
});