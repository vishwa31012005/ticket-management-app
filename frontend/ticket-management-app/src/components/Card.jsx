function Card({ title, children }) {
  return (
    <div className="bg-white/90 shadow-2xl rounded-2xl p-6 sm:p-8 mb-6 transition-transform duration-200 hover:scale-[1.02] hover:shadow-3xl">
      <h2 className="text-lg sm:text-xl font-extrabold mb-4 text-indigo-700 border-b-2 border-indigo-100 pb-2 flex items-center gap-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default Card;