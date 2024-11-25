const UserName = ({
  name,
  size = "medium",
}: {
  name: string;
  size?: "small" | "medium" | "large";
}) => {
  const letter = name.charAt(0).toUpperCase();
  const sizeClasses = {
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-md",
    large: "w-12 h-12 text-lg",
  };

  const colors = [
    "bg-blue-400",
    "bg-blue-500",
    "bg-blue-600",
    "bg-sky-500",
    "bg-cyan-500",
    "bg-green-400",
    "bg-green-500",
    "bg-green-600",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-red-500",
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-purple-400",
    "bg-purple-500",
    "bg-violet-500",
    "bg-indigo-500",
    "bg-fuchsia-500",
    "bg-pink-400",
    "bg-pink-500",
    "bg-pink-600",
    "bg-slate-500",
    "bg-zinc-500",
    "bg-stone-500",
  ];

  const colorIndex =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  const backgroundColor = colors[colorIndex];

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-medium text-white ${backgroundColor}`}
    >
      {letter}
    </div>
  );
};

export default UserName;
