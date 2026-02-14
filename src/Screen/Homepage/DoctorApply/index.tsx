import React, { useState } from "react";
import axios from "axios";

const ApplyDoctor = () => {

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
  });

  const [cv, setCv] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCv(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {

    if (!cv) {
      alert("Please upload CV");
      return;
    }

    const data = new FormData();

    data.append("name", form.name);
    data.append("specialization", form.specialization);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("cv", cv);

    try {
      await axios.post("http://localhost:5000/api/apply-doctor", data);

      alert("Application sent successfully!");

      setForm({
        name: "",
        specialization: "",
        email: "",
        phone: "",
      });

      setCv(null);

    } catch (error) {
      alert("Failed to send application");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Apply as Doctor
      </h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 mb-3"
      />

      <input
        name="specialization"
        placeholder="Specialization"
        value={form.specialization}
        onChange={handleChange}
        className="w-full border p-2 mb-3"
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 mb-3"
      />

      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border p-2 mb-3"
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="w-full mb-4"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Apply
      </button>

    </div>
  );
};

export default ApplyDoctor;
