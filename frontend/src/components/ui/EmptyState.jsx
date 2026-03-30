const EmptyState = ({ title, message }) => {
  return (
    <div className="card-surface rounded-2xl p-6 text-center">
      <h3 className="text-lg font-semibold text-cyan-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{message}</p>
    </div>
  );
};

export default EmptyState;
