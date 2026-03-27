import React, { useEffect, useMemo, useState } from "react";
import type { AppDispatch } from "../../../../store/store";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { fetchDoctorListThunk } from "../../../../store/slices/doctorSlice";
import { saveDoctorProfileApi } from "../../../services/doctorProfileApi";
import type {
  DoctorProfilePayload,
  AddressPayload,
  ExperiencePayload,
} from "../../../services/doctorProfileApi";
import type { RootState } from "../../../../store/store";

const DoctorEditProfile: React.FC = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const doctorFromState = location.state;
  const doctorFromStore = useSelector((state: RootState) => state.doctor?.doctors || []);

  const [step, setStep] = useState(1);
  const [sameAddress, setSameAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDoctorListThunk());
  }, [dispatch]);

  const doctor = useMemo(() => {
    return (
      doctorFromStore.find((d) => d.doctor_id === Number(doctorId)) ||
      doctorFromState ||
      null
    );
  }, [doctorFromStore, doctorFromState, doctorId]);

  const [profile, setProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    doctor_no: "",
    licence_number: "",
    registration_number: "",
    experience: "",
    specialization: "",
    bio: "",
    status: "",
  });

  const [permanentAddress, setPermanentAddress] = useState<AddressPayload>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin: "",
  });

  const [currentAddress, setCurrentAddress] = useState<AddressPayload>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin: "",
  });

  const [experiences, setExperiences] = useState<ExperiencePayload[]>([
    {
      organization: "",
      start_date: "",
      end_date: "",
      designation: "",
      responsibilities: "",
    },
  ]);

  useEffect(() => {
    if (!doctor) return;

    const permanent =
      doctor?.permanent_address ||
      doctor?.doctor_address?.permanent_address ||
      {};

    const current =
      doctor?.current_address ||
      doctor?.doctor_address?.current_address ||
      {};

    setProfile({
      first_name: doctor?.first_name ?? "",
      middle_name: doctor?.middle_name ?? "",
      last_name: doctor?.last_name ?? "",
      dob: doctor?.dob ?? "",
      gender: doctor?.gender ?? "",
      email: doctor?.email ?? "",
      phone: doctor?.phone_no ?? doctor?.phone ?? "",
      doctor_no: doctor?.doctor_no ?? "",
      licence_number: doctor?.licence_number ?? "",
      registration_number: doctor?.registration_number ?? "",
      experience: doctor?.experience ?? "",
      specialization: doctor?.specialization ?? "",
      bio: doctor?.bio ?? "",
      status: doctor?.status ?? "",
    });

    setPermanentAddress({
      address_line_1: permanent?.address_line_1 ?? "",
      address_line_2: permanent?.address_line_2 ?? "",
      city: permanent?.city ?? "",
      district: permanent?.district ?? "",
      state: permanent?.state ?? "",
      country: permanent?.country ?? "",
      pin: permanent?.pin ?? "",
    });

    setCurrentAddress({
      address_line_1: current?.address_line_1 ?? "",
      address_line_2: current?.address_line_2 ?? "",
      city: current?.city ?? "",
      district: current?.district ?? "",
      state: current?.state ?? "",
      country: current?.country ?? "",
      pin: current?.pin ?? "",
    });

    if (doctor?.doctor_experiences?.length) {
      setExperiences(
        doctor.doctor_experiences.map((exp: ExperiencePayload) => ({
          organization: exp?.organization ?? exp?.organization ?? "",
          start_date: exp?.start_date ?? "",
          end_date: exp?.end_date ?? "",
          designation: exp?.designation ?? "",
          responsibilities: exp?.responsibilities ?? "",
        }))
      );
    }
  }, [doctor]);

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handlePermanentChange = (key: keyof AddressPayload, value: string) => {
    const updated = { ...permanentAddress, [key]: value };
    setPermanentAddress(updated);

    if (sameAddress) {
      setCurrentAddress(updated);
    }
  };

  const handleCurrentChange = (key: keyof AddressPayload, value: string) => {
    setCurrentAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleSameAddress = () => {
    setSameAddress((prev) => {
      const next = !prev;
      if (next) {
        setCurrentAddress({ ...permanentAddress });
      }
      return next;
    });
  };

  const handleExpChange = (
    index: number,
    key: keyof ExperiencePayload,
    value: string
  ) => {
    const updated = [...experiences];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        organization: "",
        start_date: "",
        end_date: "",
        designation: "",
        responsibilities: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length === 1) return;
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      if (!doctor?.doctor_id) {
        toast.error("Doctor ID missing");
        return;
      }

      setLoading(true);

      let payload: DoctorProfilePayload = {
        dob: profile.dob,
        licence_number: profile.licence_number,
        registration_number: profile.registration_number,
        experience: profile.experience,
        bio: profile.bio,
        current_address: {
          address_line_1: currentAddress.address_line_1 || "",
          address_line_2: currentAddress.address_line_2 || "",
          city: currentAddress.city || "",
          district: currentAddress.district || "",
          state: currentAddress.state || "",
          country: currentAddress.country || "",
          pin: currentAddress.pin || "",
        },
        permanent_address: {
          address_line_1: permanentAddress.address_line_1 || "",
          address_line_2: permanentAddress.address_line_2 || "",
          city: permanentAddress.city || "",
          district: permanentAddress.district || "",
          state: permanentAddress.state || "",
          country: permanentAddress.country || "",
          pin: permanentAddress.pin || "",
        },
      };

      if (step === 2) {
        payload = {
          ...payload,
          experiences: experiences.map((exp) => ({
            organization: exp.organization || "",
            start_date: exp.start_date || "",
            end_date: exp.end_date || "",
            designation: exp.designation || "",
            responsibilities: exp.responsibilities || "",
          })),
        };
      }

      const res = await saveDoctorProfileApi(doctor.doctor_id, payload);

      if (res?.data?.success) {
        toast.success(res.data.message || "Profile saved");
      } else {
        toast.error(res?.data?.message || "Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return <div className="p-10">No doctor data found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-blue-100 p-8 rounded-3xl pl-1 pr-1">
        <ProfileAvatar
          firstName={doctor.first_name || ""}
          lastName={doctor.last_name || ""}
        />

        <div className="bg-gray-50 p-6 rounded-3xl space-y-6">
          <StepIndicator step={step} onStepClick={setStep} />

          {step === 1 && (
            <>
              <fieldset className="border p-5 bg-blue-50 rounded-sm">
                <legend className="text-sm font-semibold px-2">
                  Personal Details
                </legend>

                <div className="grid md:grid-cols-3 gap-4">
                  <Field
                    label="First Name"
                    value={profile.first_name}
                    onChange={(v) => handleChange("first_name", v)}
                    disabled
                  />
                  <Field
                    label="Middle Name"
                    value={profile.middle_name}
                    onChange={(v) => handleChange("middle_name", v)}
                    disabled
                  />
                  <Field
                    label="Last Name"
                    value={profile.last_name}
                    onChange={(v) => handleChange("last_name", v)}
                    disabled
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-3 items-end">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of Birth"
                      value={profile.dob ? dayjs(profile.dob) : null}
                      onChange={(value: Dayjs | null) =>
                        handleChange(
                          "dob",
                          value ? value.format("YYYY-MM-DD") : ""
                        )
                      }
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <Field
                    label="Gender"
                    value={profile.gender}
                    onChange={(v) => handleChange("gender", v)}
                    disabled
                  />

                  <Field
                    label="Doctor Number"
                    value={profile.doctor_no}
                    onChange={(v) => handleChange("doctor_no", v)}
                    disabled
                  />

                  <Field
                    label="Licence Number"
                    value={profile.licence_number}
                    onChange={(v) => handleChange("licence_number", v)}
                  />

                  <Field
                    label="Registration Number"
                    value={profile.registration_number}
                    onChange={(v) => handleChange("registration_number", v)}
                  />

                  <Field
                    label="Experience"
                    value={profile.experience}
                    onChange={(v) => handleChange("experience", v)}
                  />

                  <Field
                    label="Specialization"
                    value={profile.specialization}
                    onChange={(v) => handleChange("specialization", v)}
                    disabled
                  />
                </div>

                <div className="pt-3">
                  <label className="text-sm pl-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={4}
                    className="w-full border p-2 rounded-sm"
                  />
                </div>
              </fieldset>

              <fieldset className="border p-5 bg-blue-50 rounded-sm">
                <legend className="text-sm font-semibold px-2">
                  Address Details
                </legend>

                <div className="grid md:grid-cols-2 gap-6">
                  <fieldset className="border p-4 bg-blue-50 rounded-sm">
                    <legend className="text-sm p-2 font-semibold">
                      Permanent Address
                    </legend>
                    <AddressFields
                      state={permanentAddress}
                      handler={handlePermanentChange}
                    />
                  </fieldset>

                  <fieldset className="border p-4 bg-blue-50 rounded-sm">
                    <legend className="text-sm p-2 font-semibold">
                      Current Address
                    </legend>

                    <label className="text-xs flex items-center justify-end mb-2 gap-2">
                      <input
                        type="checkbox"
                        checked={sameAddress}
                        onChange={handleSameAddress}
                      />
                      Same as Permanent
                    </label>

                    <AddressFields
                      state={currentAddress}
                      handler={handleCurrentChange}
                      disabled={sameAddress}
                    />
                  </fieldset>
                </div>
              </fieldset>
            </>
          )}

          {step === 2 && (
            <fieldset className="border p-5 bg-blue-50 rounded-sm">
              <legend className="text-sm font-semibold px-2">
                Experience Details
              </legend>

              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={index} className="border rounded-sm p-4 bg-white">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field
                        label="Organization Name"
                        value={exp.organization ?? ""}
                        onChange={(v) =>
                          handleExpChange(index, "organization", v)
                        }
                      />

                      <Field
                        label="Designation"
                        value={exp.designation ?? ""}
                        onChange={(v) =>
                          handleExpChange(index, "designation", v)
                        }
                      />

                      <Field
                        label="Start Date"
                        value={exp.start_date ?? ""}
                        onChange={(v) =>
                          handleExpChange(index, "start_date", v)
                        }
                        type="date"
                      />

                      <Field
                        label="End Date"
                        value={exp.end_date ?? ""}
                        onChange={(v) =>
                          handleExpChange(index, "end_date", v)
                        }
                        type="date"
                      />
                    </div>

                    <div className="pt-3">
                      <label className="text-sm pl-1">Responsibilities</label>
                      <textarea
                        value={exp.responsibilities ?? ""}
                        onChange={(e) =>
                          handleExpChange(
                            index,
                            "responsibilities",
                            e.target.value
                          )
                        }
                        rows={4}
                        className="w-full border p-2 rounded-sm"
                      />
                    </div>

                    {experiences.length > 1 && (
                      <div className="pt-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="px-4 py-2 rounded-sm bg-red-500 text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-4 py-2 rounded-sm bg-green-600 text-white hover:bg-green-700"
                  >
                    Add More Experience
                  </button>
                </div>
              </div>
            </fieldset>
          )}

          <div className="flex justify-between mt-10">
            <div className="flex gap-4">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1 || loading}
                className="px-6 py-2 rounded-sm bg-gray-500 text-white disabled:bg-gray-300"
              >
                ← Back
              </button>
            </div>

            <div className="flex gap-4">
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="px-6 py-2 rounded-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Next →
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 rounded-sm bg-cyan-600 text-white hover:bg-cyan-800 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorEditProfile;

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) => (
  <div>
    <label className="text-sm pl-1">{label}</label>
    <input
      type={type}
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border p-2 ${
        disabled ? "bg-gray-100 cursor-not-allowed rounded-sm" : "rounded-sm"
      }`}
    />
  </div>
);

const AddressFields = ({
  state,
  handler,
  disabled = false,
}: {
  state: AddressPayload;
  handler: (key: keyof AddressPayload, value: string) => void;
  disabled?: boolean;
}) => (
  <div className="space-y-3">
    <input
      placeholder="Address Line 1"
      value={state.address_line_1 ?? ""}
      onChange={(e) => handler("address_line_1", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded"
    />
    <input
      placeholder="Address Line 2"
      value={state.address_line_2 ?? ""}
      onChange={(e) => handler("address_line_2", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded"
    />
    <input
      placeholder="City"
      value={state.city ?? ""}
      onChange={(e) => handler("city", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded"
    />
    <input
      placeholder="District"
      value={state.district ?? ""}
      onChange={(e) => handler("district", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded"
    />
    <input
      placeholder="State"
      value={state.state ?? ""}
      onChange={(e) => handler("state", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded"
    />
    <input
      placeholder="Country"
      value={state.country ?? ""}
      onChange={(e) => handler("country", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded"
    />
    <input
      placeholder="Pincode"
      value={state.pin ?? ""}
      onChange={(e) => handler("pin", e.target.value)}
      disabled={disabled}
      className="w-full border p-2 rounded"
    />
  </div>
);

const ProfileAvatar = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  return (
    <div className="text-center mb-6">
      <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl">
        {initials}
      </div>
      <button className="mt-2 border px-4 py-1 rounded">Edit Profile</button>
    </div>
  );
};

const StepIndicator = ({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (n: number) => void;
}) => {
  const steps = [
    { id: 1, label: "Basic Information" },
    { id: 2, label: "Experience Details" },
  ];

  return (
    <div className="mb-10 w-full px-10">
      <div className="flex items-center w-full">
        {steps.map((s, index) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center">
              <div
                onClick={() => onStepClick(s.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                  step >= s.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {s.id}
              </div>

              <span
                className={`mt-2 text-xs text-center ${
                  step >= s.id
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-[3px] mx-6 ${
                  step > s.id ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};