import React, { useState, useRef, useEffect } from "react";
import { applyDoctorApi } from "../../../services/applyDoctorApi";
import type { ApplyDoctorForm } from "../../../services/applyDoctorApi";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dark_background from "../../../assets/doctor_light.webp";
import background from "../../../assets/login_bg.png"


const ApplyDoctor: React.FC = () => {
    const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  ); 

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  /* ================= STATE ================= */

  const [form, setForm] = useState<ApplyDoctorForm>({
    name: "",
    specialization: "",
    email: "",
    phone: "",
  });

  const [cv, setCv] = useState<File | null>(null);

  const [fileName, setFileName] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  /* ================= HANDLE FILE ================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files.length > 0) {

      const file = e.target.files[0];

      setCv(file);
      setFileName(file.name);

    }

  };

  /* ================= REMOVE FILE ================= */

  const handleRemoveFile = () => {

    setCv(null);
    setFileName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };

  /* ================= HANDLE SUBMIT ================= */

 const handleSubmit = async (): Promise<boolean> => {

  if (!form.name || !form.specialization || !form.email || !form.phone) {
    toast.error("Please fill all fields");
    return false;
  }

  if (!cv) {
    toast.error("Please upload CV");
    return false;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("specialization", form.specialization);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("cv", cv);

    const response = await applyDoctorApi(formData);

    if (response.status === 200) {

      toast.success("Application sent successfully!");

      setForm({
        name: "",
        specialization: "",
        email: "",
        phone: "",
      });

      handleRemoveFile();

      return true;

    } else {
      toast.error(response.data?.message || "Failed to send application");
      return false; 
    }

  } catch (error: unknown) {

    console.error("Apply Doctor Error:", error);

    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to send application"
      );
    } else {
      toast.error("Unexpected error occurred");
    }

    return false; 

  } finally {
    setLoading(false);
  }
};
  /* ================= UI ================= */

  return (

<div className="max-h-screen bg-cover bg-center items-center flex-col justify-center px-10 pt-28.5 py-10.5"
  style={{ backgroundImage: `url(${isDark ? dark_background : background})`, }}>


    <div className="relative backdrop-blur-md p-8 rounded-3xl max-w-lg mx-auto"


    >

      <h2 className="text-2xl font-bold text-cyan-800 dark:text-gray-600 mb-6 text-center">
        Apply as Doctor
      </h2>

      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-2 pr-12 dark:text-gray-800 rounded-full border focus:ring-2 mb-3"
      />

      {/* Specialization */}
      <input
        type="text"
        name="specialization"
        placeholder="Specialization"
        value={form.specialization}
        onChange={handleChange}
        className="w-full px-4 py-2 pr-12 dark:text-gray-800 rounded-full border focus:ring-2 mb-3"
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 pr-12  dark:text-gray-800 rounded-full border focus:ring-2 mb-3"
      />

      {/* Phone */}
      <input
        type="text"
        name="phone"
        placeholder="Enter your phone number"
        value={form.phone}
        onChange={handleChange}
        className="w-full px-4 py-2 pr-12  dark:text-gray-800 rounded-full border focus:ring-2 mb-3"
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="cvUpload"
      />

      {/* File Display */}
      <div className="w-full px-4 py-2 pr-12  dark:text-gray-800 rounded-full border focus:ring-2 mb-3 flex items-center">

        <label
          htmlFor="cvUpload"
          className="cursor-pointer flex-1 text-gray-500 dark:text-gray-600"
        >
          {fileName ? ` ${fileName}` : " Choose a File"}
        </label>

        {fileName && (
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-500 font-bold ml-2"
          >
            ✕
          </button>
        )}

      </div>

      {/* Submit */}
      <button
        onClick= { async () => {
          const success = await handleSubmit();
          if (success) {
            navigate("/apply_doctor/response");
          }

        } }
        disabled={loading}
        className={`w-full text-white p-2 px-4 py-2 pr-12 rounded-full transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-cyan-500  to-cyan-700 hover:from-cyan-900 hover:to-cyan-700 dark:from-cyan-950 dark:to-cyan-700 dark:hover:from-sky-400 dark:hover:to-cyan-600"
        }`}
      >
        {loading ? "Sending..." : "Apply"}
      </button>

    </div>
    </div>
    


  );

};

export default ApplyDoctor;
