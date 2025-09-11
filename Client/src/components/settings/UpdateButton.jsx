const UpdateButton = ({ label, isLoading, isDisabled }) => {
  return (
    <button
      type="submit"
      disabled={isLoading || isDisabled}
      className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
        isLoading || isDisabled
          ? "bg-[var(--btn)] opacity-50 cursor-not-allowed text-white"
          : "bg-[var(--btn)] hover:bg-[var(--btn-hover)] hover:shadow-xl transform hover:-translate-y-0.5 text-white"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 text-white"></div>
          Updating...
        </div>
      ) : (
        label
      )}
    </button>
  );
};

export default UpdateButton;
