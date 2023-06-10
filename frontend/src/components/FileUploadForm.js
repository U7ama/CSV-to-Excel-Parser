import React, { useState } from "react";
import axios from "axios";
import styles from "../Form.module.css";

const FileUploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const onFileSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        window.location.href = "http://localhost:3000/download";
        setFile(null);
      } else {
        setLoading(false);
        alert("Failed to upload file");
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to upload file", error);
      alert("Failed to upload file");
    }
  };

  return (
    <form className={styles.formWrapper} onSubmit={onFileSubmit}>
      <h2 className={styles.loginTitle}>Upload CSV and Generate XLSX</h2>
      <div className={styles.inputWrapper}>
        <label className={styles.labelWrapper} htmlFor="">
          File
        </label>
        <input
          className={styles.inputField}
          type="file"
          onChange={onFileChange}
          accept=".csv"
          required
        />
      </div>
      <button className={styles.submitButton} type="submit">
        {loading ? "Generating..." : "Generate"}
      </button>
    </form>
  );
};

export default FileUploadForm;
