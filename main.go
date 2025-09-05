package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

const traceFilePath = "trace.out"

func main() {
	// ---- File Upload ----
	http.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
			return
		}

		file, _, err := r.FormFile("trace")
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to read uploaded file: %v", err), http.StatusBadRequest)
			return
		}
		defer file.Close()

		out, err := os.Create(traceFilePath)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to save file: %v", err), http.StatusInternalServerError)
			return
		}
		defer out.Close()

		if _, err = io.Copy(out, file); err != nil {
			http.Error(w, fmt.Sprintf("Failed to write file: %v", err), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "Trace uploaded successfully")
	})

	// ---- Serve Parsed JSON ----
	http.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			return
		}

		root, err := ParseTrace()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(root)
	})

	// ---- Serve Frontend Build ----
	fs := http.FileServer(http.Dir("./frontend/dist"))
	http.Handle("/", fs) // root → index.html

	log.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
