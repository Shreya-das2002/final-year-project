import { FaClipboardCheck, FaUserMd, FaHeartbeat, FaCommentMedical, FaLightbulb, FaHandsHelping, FaUser, FaStethoscope, FaFileMedical } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";

import { getHomepageDoctorsApi } from "../../services/doctorApi";

import type { HomepageDoctor } from "../../services/doctorApi";

const Cards = () => {

    const hasFetched = useRef(false);

    const [doctors, setDoctors] =
        useState<HomepageDoctor[]>([]);

    const [loading, setLoading] =
        useState(true);


    const fetchDoctors = async () => {

        try {

            const data =
                await getHomepageDoctorsApi();

            setDoctors(data);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    };


   useEffect(() => {

    if (hasFetched.current) return;

    hasFetched.current = true;

    fetchDoctors();

    const interval =
        setInterval(fetchDoctors, 600000);

    return () => clearInterval(interval);

}, []);

    const gradients = [
        "from-green-200 to-emerald-400",
        "from-violet-200 to-indigo-400",
        "from-slate-200 to-zinc-400"
    ];

    const gloweffects = [
        "from-green-500 to-emerald-500",
        "from-violet-500 to-indigo-500",
        "from-slate-500 to-zinc-500"
    ];

    const textColours = [
        "text-green-900",
        "text-indigo-900",
        "text-slate-900"
    ];

    return (
        <div className="bg-gradient-to-r from-sky-200 via-sky-50 to-sky-200">
    <div className="grid gap-6 md:grid-cols-3 p-8 bg-gradient-to-r from-sky-200 via-sky-50 to-sky-200 dark:bg-gray-800">
        
        <div className="relative group rounded-xl cursor-pointer">

  {/* Glow Layer */}
  <div className="
    absolute -inset-[2px]
    bg-gradient-to-r from-zinc-500 to-stone-500
    rounded-xl
    blur-md
    opacity-0
    group-hover:opacity-100
    transition duration-500
  "></div>

  {/* Card */}
  <div className="
    relative
    bg-gradient-to-r from-zinc-200 to-stone-400
    shadow-lg
    rounded-xl
    p-6
    text-center
    transition-transform duration-300
    group-hover:-translate-y-1
    group-hover:shadow-xl
  ">

    <FaClipboardCheck className="text-gray-800 dark:text-blue-950 text-4xl mx-auto mb-4" />

    <h3 className="text-gray-700 font-bold text-lg mb-3">
      Symptom Checker
    </h3>

    <p className="text-gray-600 ">
      Understand possible conditions based on your symptoms and get next-step guidance.
    </p>

  </div>

</div>
    <div className="relative group rounded-xl cursor-pointer">

  {/* Glow Layer */}
  <div className="
    absolute -inset-[2px]
    bg-gradient-to-r from-indigo-500 to-sky-500
    rounded-xl
    blur-md
    opacity-0
    group-hover:opacity-100
    transition duration-500
  "></div>
        <div className="bg-gradient-to-r from-indigo-200 to-sky-400  shadow-lg rounded-xl p-6 text-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <FaHeartbeat className="text-blue-800 dark:text-green-950 text-4xl mx-auto mb-4" />
        <h3 className="text-blue-700 dark:text-green-900 font-bold text-lg mb-3">
            Wellness Tips
        </h3>
        <p className="text-blue-600 dark:text-green-800">
            Learn lifestyle habits and prevention techniques for better well-being.
        </p>
        </div>
        </div>

<div className="relative group rounded-xl cursor-pointer">

  {/* Glow Layer */}
  <div className="
    absolute -inset-[2px]
    bg-gradient-to-r from-purple-500 to-violet-500
    rounded-xl
    blur-md
    opacity-0
    group-hover:opacity-100
    transition duration-500
  "></div>
        <div className="bg-gradient-to-r from-purple-200 to-violet-400 dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <FaUserMd className="text-purple-800 dark:text-purple-950 text-4xl mx-auto mb-4" />
        <h3 className="text-purple-700 dark:text-purple-900 font-bold text-lg mb-3">
            Doctor Consultation
        </h3>
        <p className="text-purple-600 dark:text-purple-800">
            Connect with healthcare professionals for personalized medical support.
        </p>
        </div>
        </div>

    </div>

    <div className="py-14 px-6 bg-gradient-to-r from-sky-200 via-sky-50 to-sky-200 dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-gray-300 mb-10">
        How SymptoNexus Works
        </h2>

        <div className="grid gap-8 md:grid-cols-3 text-center dark:bg-gray-800 bg-gradient-to-r from-sky-200 via-sky-50 to-sky-200">

                  <div className="relative group rounded-xl cursor-pointer">

  {/* Glow Layer */}
  <div className="
    absolute -inset-[2px]
    bg-gradient-to-r from-purple-500 to-indigo-500
    rounded-xl
    blur-md
    opacity-0
    group-hover:opacity-100
    transition duration-500
  "></div>

        <div className="bg-gradient-to-r from-purple-200 to-indigo-300 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 group-hover:-translate-y-1
    group-hover:shadow-xl">
            <FaCommentMedical className="text-indigo-900 dark:text-blue-9500 text-4xl mx-auto mb-4" />
            <h3 className="text-indigo-800 dark:text-blue-900 text-lg font-bold mb-2">1. Describe Your Symptoms</h3>
            <p className="text-indigo-700 dark:text-blue-800">
            Tell us how you're feeling to get personalized insights.
            </p>
        </div>
        </div>

              <div className="relative group rounded-xl cursor-pointer">

  {/* Glow Layer */}
  <div className="
    absolute -inset-[2px]
    bg-gradient-to-r from-green-500 to-teal-600
    rounded-xl
    blur-md
    opacity-0
    group-hover:opacity-100
    transition duration-500
  "></div>
        <div className="bg-gradient-to-r from-lime-100 to-teal-300 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 group-hover:-translate-y-1
    group-hover:shadow-xl">
            <FaLightbulb className="text-green-600 dark:text-green-950 text-4xl mx-auto mb-4" />
            <h3 className="text-teal-800 dark:text-green-900-lg font-bold mb-2">2. Get Advice & Insights</h3>
            <p className="text-teal-700 dark:text-green-800">
            Understand possible causes and recommended next steps.
            </p>
        </div>
        </div>

              <div className="relative group rounded-xl cursor-pointer">

  {/* Glow Layer */}
  <div className="
    absolute -inset-[2px]
    bg-gradient-to-r from-purple-500 to-cyan-500
    rounded-xl
    blur-md
    opacity-0
    group-hover:opacity-100
    transition duration-500
  "></div>
        <div className="bg-gradient-to-r from-purple-200 to-cyan-400 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform duration-300 group-hover:-translate-y-1
    group-hover:shadow-xl">
            <FaHandsHelping className="text-purple-600 dark:text-purple-950 text-4xl mx-auto mb-4" />
            <h3 className="text-blue-900 dark:text-purple-900-lg font-bold mb-2">3. Connect With Doctors</h3>
            <p className="text-blue-800 dark:text-purple-800">
            If needed, talk to a medical expert directly.
            </p>
        </div>
        </div>

        </div>
    </div>
    {/* ================= DOCTOR CARDS ================= */}

<div className="py-14 px-6 bg-gradient-to-r from-sky-200 via-sky-50 to-sky-200 dark:bg-gray-800">

    <h2 className="text-2xl  text-center text-blue-600 dark:text-gray-300 mb-10 font-bold">
        Connect With Our Doctors
    </h2>


    {loading ? (

        <div className="text-center">
            Loading doctors...
        </div>

    ) : (

        <div className="grid gap-8 md:grid-cols-3 text-center">

            {doctors.map((doc, index) => {
                
                const gradient = gradients[index % gradients.length];
                const textColour = textColours[index % textColours.length];
                const gloweffect = gloweffects[index % gloweffects.length];
            
            return(

                      <div className="relative group rounded-xl cursor-pointer">

  {/* Glow Layer */}
  <div className={`
    absolute -inset-[2px]
    bg-gradient-to-r ${gloweffect}
    rounded-xl
    blur-md
    opacity-0
    group-hover:opacity-100
    transition duration-500
            `}></div>

                <div
                    key={doc.doctor_id}
                    className= {`bg-gradient-to-r ${gradient} p-6 rounded-xl shadow-md transition-transform duration-300 group-hover:-translate-y-1
    group-hover:shadow-xl`}
                >
                    <div className="flex items-center gap-6">

                        {/* Avatar */}
                        <div className={`
                            w-28 h-28
                            bg-white
                            rounded-full
                            flex
                            items-center
                            justify-center
                            ${textColour}
                            font-bold
                            text-2xl
                            shrink-0
                        `}>
                            {doc.name.charAt(0)}
                        </div>

                        <div className="flex flex-col gap-2 text-left">
                            {/* Name */}
                            <h2 className={` ${textColour} font-bold text-lg mb-2 flex items-center text-center gap-2`}>
                                <FaUser /> {doc.name}
                            </h2>

                            {/* Specialization */}
                            <p className={` ${textColour} font-bold flex items-center text-center gap-2`}>
                                <FaStethoscope /> {doc.specialization}
                            </p>

                        </div>
                    </div>

                    <div>
                        {/* Bio */}
                        <p className={` ${textColour} text-justify flex shrink-0 items-baseline text-center pt-4 gap-2`}>
                            <FaFileMedical className="shrink-0 " /> {doc.bio}
                        </p>
                            
                    </div>

                </div>
                </div>

            )})}

        </div>
        

    )}

</div>
    </div>
    );
};

export default Cards;
