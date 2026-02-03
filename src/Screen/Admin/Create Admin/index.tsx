interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateAdmin = ({ open, onClose }: Props) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b">
          {/* LEFT SIDE CROSS */}
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-black"
          >
            ✕
          </button>

          <h3 className="text-lg font-semibold">Create Admin</h3>
        </div>

        {/* Form */}
        <form className="p-5 space-y-4 overflow-y-auto h-[calc(100%-70px)]">
          <input className="input" placeholder="First Name" />
          <input className="input" placeholder="Middle Name" />
          <input className="input" placeholder="Last Name" />
          <input className="input" placeholder="Phone Number" />
          <input className="input" placeholder="Email" />

          <select className="input">
            <option>Select Admin Type</option>
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Sub Admin</option>
          </select>

          <select className="input">
            <option>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Admin
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateAdmin;
