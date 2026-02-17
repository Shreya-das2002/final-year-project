import React from "react";
import { DOCTOR_SPECIALIZATIONS } from "../../../Environment";

import general from "../../../assets/general.png";
 import cardiology from "../../../assets/cardiology.png";
 import dermatology from "../../../assets/dermatology.png";
 import pediatrics from "../../../assets/pediatrics.png";
 import surgeon from "../../../assets/surgeon.png";
 import dentist from "../../../assets/dentist.png";
 import eye from "../../../assets/eye.png";
 import ent from "../../../assets/ent.png";
 import psychiatry from "../../../assets/psychiatry.png";
 import neurology from "../../../assets/neurology.png";
 import orthopedic from "../../../assets/orthopedic.png";
 import gynecology from "../../../assets/gynecology.png";


const IMAGES: Record<number, string> = {

  1: general,
  2: cardiology,
  3: dermatology,
  4: pediatrics,
  5: surgeon,
  6: dentist,
  7: eye,
  8: ent,
  9: psychiatry,
  10: neurology,
  11: orthopedic,
  12: gynecology

};


const Appointments: React.FC = () => {

  return (

    <div className="p-6">

      {/* Title */}
      <h2 className="text-xl font-semibold mb-5">
        Browse by Specialties
      </h2>


      {/* Grid */}
      <div className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-3
        lg:grid-cols-3
        gap-12
      ">

        {DOCTOR_SPECIALIZATIONS.map((item) => {

          const image = IMAGES[item.value];

          return (

            <div
              key={item.value}
              className="
                flex items-center gap-3
                bg-white
                border
                rounded-xl
                p-4
                hover:shadow-md
                hover:border-blue-400
                transition
                cursor-pointer
              "
            >

              {/* Image */}
              <div className="
                bg-gray-100
                p-3
                rounded-lg
                w-22 h-22
                flex items-center justify-center
              ">

                <img
                  src={image}
                  alt={item.label}
                  className="w-20 h-20 object-contain"
                />

              </div>


              {/* Label */}
              <span className="text-sm font-medium text-gray-800">
                {item.label}
              </span>

            </div>

          );

        })}

      </div>

    </div>

  );

};

export default Appointments;
