import React, { useState } from "react";
import { applyDoctorApi } from "../../../services/applyDoctorApi";
import type { ApplyDoctorForm } from "../../../services/applyDoctorApi";
import { toast } from "react-hot-toast";
import axios from "axios";

const ApplyDoctor: React.FC = () => {

  /* ================= STATE ================= */

  const [form, setForm] = useState<ApplyDoctorForm>({
    name: "",
    specialization: "",
    email: "",
    phone: "",
  });

  const [cv, setCv] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

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
      setCv(e.target.files[0]);
    }

  };

  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = async () => {

    if (!form.name || !form.specialization || !form.email || !form.phone) {

      toast.error("Please fill all fields");
      return;

    }

    if (!cv) {

      toast.error("Please upload CV");
      return;

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

        // Reset form
        setForm({
          name: "",
          specialization: "",
          email: "",
          phone: "",
        });

        setCv(null);

      } else {

        toast.error(
          response.data?.message || "Failed to send application"
        );

      }

    }

    catch (error: unknown) {

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

    }

    finally {

      setLoading(false);

    }

  };

  /* ================= UI ================= */

  return (

    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Apply as Doctor
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="text"
        name="specialization"
        placeholder="Specialization"
        value={form.specialization}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="w-full border p-2 mb-4 rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full text-white p-2 rounded transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Sending..." : "Apply"}
      </button>

    </div>

  );

};

export default ApplyDoctor;
