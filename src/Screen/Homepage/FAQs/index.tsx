import { useState } from "react";
import { faqData } from "../../../Environment";
import { useNavigate } from "react-router-dom";

const FAQ: React.FC = () => {
    const navigate = useNavigate();


    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const handleClick = () => {
        navigate("/contact")
    }
    const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 max-w-3xl mx-auto p-6">
      <h2 className=" text-blue-500 dark:text-white text-3xl font-bold mb-6">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg bg-[#fffaf1] cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            {/* Question */}
            <div className="flex justify-between items-center px-4 py-3">
              <p className="text-lg font-medium">{item.question}</p>
              <span className="text-2xl font-bold">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-700">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-900 py-20 flex justify-center">
      <div className="text-center max-w-2xl px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Need more help?
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
          Send us a message with more details about your specific needs.
        </p>

        {/* Button */}
        <button 
            onClick={() => handleClick()}
            className="bg-blue-600 dark:bg-gray-600 hover:bg-blue-700 dark:hover:bg-gray-700 text-white dark:text-gray-200 px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition">
          SUBMIT A REQUEST
        </button>
      </div>
    </div>
    </div>
  );
};

export default FAQ;