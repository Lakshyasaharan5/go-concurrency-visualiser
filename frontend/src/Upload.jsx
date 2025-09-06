import { useState } from "react";

export function Upload({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("trace", file);

      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      onUploadSuccess(); // reload chart after success
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload trace file");
    } finally {
      setLoading(false);
      event.target.value = ""; // reset file input
    }
  };

  return (
    <div style={{ marginBottom: "1em" }}>
      <input
        type="file"
        accept=".out"
        onChange={handleUpload}
        disabled={loading}
      />
      {loading && <span style={{ marginLeft: "10px" }}>Uploading...</span>}
    </div>
  );
}
