import { useState } from "react";



const overallRatings = [
  { value: 1, label: "Poor", emoji: "😟" },
  { value: 2, label: "Fair", emoji: "🙁" },
  { value: 3, label: "Good", emoji: "😐" },
  { value: 4, label: "Very Good", emoji: "🙂" },
  { value: 5, label: "Excellent", emoji: "😄" },
];

const ratingColumns = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Fair" },
  { value: 3, label: "Good" },
  { value: 4, label: "Very Good" },
  { value: 5, label: "Excellent" },
];

const ratingAreas = [
  "Doctor Consultation",
  "SymptoBot Experience",
  "Symptom Checker",
  "Doctor Consultation Booking",
  "Website Speed",
  "Website Design",
  "Ease of Use",
  "Information Quality",
  "Overall SymptoNexus Service",
];

const Feedback: React.FC = () => {
  const [overallRating, setOverallRating] = useState<number>(0);
  const [areaRatings, setAreaRatings] = useState<Record<string, number>>({});
  const [recommend, setRecommend] = useState("yes");
  const [callback, setCallback] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    mobileNumber: "",
    patientId: "",
    visitDate: "",
    department: "",
    doctorName: "",
    visitType: "",
    websiteExperience: "",
    whatWentWell: "",
    improvements: "",
    feedbackType: "",
    preferredTime: "",
    alternateMobile: "",
  });

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAreaRating = (area: string, rating: number) => {
    setAreaRatings((prev) => ({
      ...prev,
      [area]: rating,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      overallRating,
      areaRatings,
      recommend,
      callback,
    };

    console.log("Feedback Payload:", payload);
    setSubmitted(true);
  };

  const handleClear = () => {
    setOverallRating(0);
    setAreaRatings({});
    setRecommend("yes");
    setCallback(false);
    setSubmitted(false);

    setFormData({
      patientName: "",
      mobileNumber: "",
      patientId: "",
      visitDate: "",
      department: "",
      doctorName: "",
      visitType: "",
      websiteExperience: "",
      whatWentWell: "",
      improvements: "",
      feedbackType: "",
      preferredTime: "",
      alternateMobile: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-7xl bg-white shadow-xl rounded-sm border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-cyan-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button className="text-2xl">←</button>
              <h1 className="text-2xl font-bold">Patient Feedback</h1>
            </div>
            <p className="text-sm mt-1 ml-10">
              Your feedback helps us improve our services and patient experience.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-4xl">
            📋 ❤️
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Patient Details */}
          <section className="border border-gray-200 rounded-lg p-4 bg-white">
            <h2 className="text-teal-700 font-bold mb-4">
              1. Patient Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Patient Name"
                required
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={(v) => handleInputChange("patientName", v)}
              />

              <Input
                label="Mobile Number"
                required
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={(v) => handleInputChange("mobileNumber", v)}
              />

              <Input
                label="Patient ID / UHID"
                placeholder="Enter patient ID"
                value={formData.patientId}
                onChange={(v) => handleInputChange("patientId", v)}
              />

              <Input
                label="Visit Date"
                required
                type="date"
                value={formData.visitDate}
                onChange={(v) => handleInputChange("visitDate", v)}
              />

              <Select
                label="Department"
                required
                value={formData.department}
                onChange={(v) => handleInputChange("department", v)}
                options={[
                  "General Medicine",
                  "Cardiology",
                  "Neurology",
                  "Orthopedics",
                  "Pediatrics",
                  "Dermatology",
                ]}
              />

              <Input
                label="Doctor Name"
                required
                placeholder="Select doctor"
                value={formData.doctorName}
                onChange={(v) => handleInputChange("doctorName", v)}
              />

              <Select
                label="Visit Type"
                required
                value={formData.visitType}
                onChange={(v) => handleInputChange("visitType", v)}
                options={[
                  "OPD",
                  "IPD",
                  "Emergency",
                  "Teleconsultation",
                  "Online Consultation",
                ]}
              />
            </div>
          </section>

          {/* Overall Experience */}
          <section className="border border-gray-200 rounded-lg p-4 bg-white">
            <h2 className="text-teal-700 font-bold mb-5">
              2. How was your overall experience?
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {overallRatings.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setOverallRating(item.value)}
                  className={`rounded-lg p-4 text-center transition border ${
                    overallRating === item.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="text-yellow-400 text-lg">
                    {"★".repeat(item.value)}
                  </div>
                  <div className="font-semibold">{item.value}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 space-y-4">
              {/* Rating Table */}
              <section className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="p-4">
                  <h2 className="text-teal-700 font-bold">
                    3. Please rate the following areas
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 border border-gray-200 min-w-[220px]">
                          Feedback Area
                        </th>
                        {ratingColumns.map((col) => (
                          <th
                            key={col.value}
                            className="p-3 border border-gray-200 text-center min-w-[110px]"
                          >
                            <div>{col.label}</div>
                            <div className="text-yellow-400">
                              {"★".repeat(col.value)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {col.value}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {ratingAreas.map((area) => (
                        <tr key={area}>
                          <td className="p-3 border border-gray-200 font-medium">
                            {area}
                          </td>

                          {ratingColumns.map((col) => (
                            <td
                              key={col.value}
                              className="p-3 border border-gray-200 text-center"
                            >
                              <input
                                type="radio"
                                name={area}
                                checked={areaRatings[area] === col.value}
                                onChange={() =>
                                  handleAreaRating(area, col.value)
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Additional Feedback + Comment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h2 className="text-teal-700 font-bold mb-4">
                    4. Additional Feedback
                  </h2>

                  <RadioQuestion
                    title="Was the doctor polite and clear in explanation?"
                    options={["Yes", "No", "Partially"]}
                  />

                  <RadioQuestion
                    title="Was your website experience smooth?"
                    options={["Yes", "No", "Partially"]}
                  />

                  <RadioQuestion
                    title="Was SymptoBot helpful?"
                    options={["Yes", "No", "Partially"]}
                  />

                  <RadioQuestion
                    title="Was the symptom checker easy to use?"
                    options={["Yes", "No", "Needs Improvement"]}
                  />
                </section>

                <section className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h2 className="text-teal-700 font-bold mb-4">
                    5. Tell us more about your experience
                  </h2>

                  <textarea
                    className="w-full h-24 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="Please share your suggestions, complaints, or appreciation here..."
                    value={formData.websiteExperience}
                    onChange={(e) =>
                      handleInputChange("websiteExperience", e.target.value)
                    }
                  />

                  <div className="mt-4">
                    <Select
                      label="Type of Feedback"
                      required
                      value={formData.feedbackType}
                      onChange={(v) => handleInputChange("feedbackType", v)}
                      options={[
                        "Appreciation",
                        "Complaint",
                        "Suggestion",
                        "Website Issue",
                        "Doctor Related",
                        "SymptoBot Related",
                        "Symptom Checker Issue",
                        "Other",
                      ]}
                    />
                  </div>
                </section>
              </div>

              {/* Upload + Consent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h2 className="text-teal-700 font-bold mb-4">
                    6. Upload Optional Document
                  </h2>

                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-blue-50/40">
                    <input
                      type="file"
                      className="hidden"
                      id="feedback-file"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <label
                      htmlFor="feedback-file"
                      className="cursor-pointer text-teal-700 font-medium"
                    >
                      ⬆ Click to upload
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, PDF Max: 5MB
                    </p>
                  </div>
                </section>

                <section className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h2 className="text-teal-700 font-bold mb-4">
                    7. Consent
                  </h2>

                  <label className="flex items-start gap-2 text-sm mb-3">
                    <input type="checkbox" className="mt-1" />
                    <span>
                      I agree that SymptoNexus may contact me regarding this
                      feedback.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 text-sm mb-4">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={callback}
                      onChange={(e) => setCallback(e.target.checked)}
                    />
                    <span>I want a callback from the team.</span>
                  </label>

                  {callback && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="Preferred Contact Time"
                        type="time"
                        value={formData.preferredTime}
                        onChange={(v) =>
                          handleInputChange("preferredTime", v)
                        }
                      />

                      <Input
                        label="Alternate Mobile Number"
                        placeholder="Enter alternate number"
                        value={formData.alternateMobile}
                        onChange={(v) =>
                          handleInputChange("alternateMobile", v)
                        }
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="font-medium mb-2">
                      Would you recommend SymptoNexus?
                    </p>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={recommend === "yes"}
                          onChange={() => setRecommend("yes")}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={recommend === "no"}
                          onChange={() => setRecommend("no")}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Right Side Cards */}
            <aside className="space-y-4">
              <div className="border border-green-100 bg-green-50 rounded-lg p-5 text-center">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-green-700 font-bold text-lg">
                  Thank You!
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Your feedback is very important to us. We use your feedback to
                  improve our services.
                </p>
                <div className="text-5xl mt-6">📋🙂</div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 bg-white">
                <h3 className="text-teal-700 font-bold mb-4">
                  Why Give Feedback?
                </h3>

                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span>🛡️</span>
                    <span>Help us improve our services</span>
                  </li>
                  <li className="flex gap-3">
                    <span>👥</span>
                    <span>Better patient experience</span>
                  </li>
                  <li className="flex gap-3">
                    <span>⚡</span>
                    <span>Quick resolution of issues</span>
                  </li>
                  <li className="flex gap-3">
                    <span>♡</span>
                    <span>We value your opinion</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-5 pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-md font-semibold transition"
            >
              Submit Feedback
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-10 py-3 rounded-md font-semibold transition"
            >
              Clear Form
            </button>
          </div>

          {/* Success Footer */}
          {submitted && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-2 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-green-700">
                    Thank you for your feedback!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your feedback has been recorded successfully. Our team will
                    review it and contact you if required.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Feedback Reference No.
                </p>
                <p className="font-semibold">SN-FBK-</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className="inline-block bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm font-semibold">
                  Submitted
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: InputProps) => {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
    </div>
  );
};

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
};

const Select = ({
  label,
  value,
  onChange,
  options,
  required = false,
}: SelectProps) => {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

type RadioQuestionProps = {
  title: string;
  options: string[];
};

const RadioQuestion = ({ title, options }: RadioQuestionProps) => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">{title}</p>

      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={selected === option}
              onChange={() => setSelected(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Feedback;