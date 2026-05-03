

export default function TeacherDashboard() {
  return (
    <div className="bg-[#050014] min-h-screen text-white">


      <div className="p-8 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard 🧑‍🏫</h1>
          <p className="text-gray-400 mt-2">
            Manage courses, students and assignments 🚀
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Courses Created</h2>
            <p className="text-2xl font-bold mt-2">4</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Total Students</h2>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-gray-400 text-sm">Assignments Given</h2>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>

        </div>

        {/* ACTIONS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl cursor-pointer">
              ➕ Create Course
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-xl cursor-pointer">
              📝 Create Assignment
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl cursor-pointer">
              👨‍🎓 Manage Students
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}