import { useGetLeadsQuery } from "../features/leads/leadsApi";

const Dashboard = () => {
  const { data: leads = [], isLoading } = useGetLeadsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
    );
  }

  // 📊 Stats Calculation
  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "new"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "converted"
  ).length;

  return (
    <div className="px-12 pt-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Leads */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 text-sm uppercase">
            Total Leads
          </h2>
          <p className="text-3xl font-bold mt-2">
            {totalLeads}
          </p>
        </div>

        {/* New Leads */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 text-sm uppercase">
            New Leads
          </h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {newLeads}
          </p>
        </div>

        {/* Converted Leads */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 text-sm uppercase">
            Converted
          </h2>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {convertedLeads}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;