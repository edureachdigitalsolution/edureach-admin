import { useState, useMemo } from "react";
import { Pencil, Trash2, Filter } from "lucide-react";
import {
  useGetLeadsQuery,
  useUpdateLeadStatusMutation,
  useDeleteLeadMutation,
  useUpdateLeadMutation,
} from "../features/leads/leadsApi";
import { useSelector } from "react-redux";

const LEADS_PER_PAGE = 15;

const Leads = () => {
  const { user } = useSelector((state) => state.auth);

  /* ---------------- API ---------------- */
  const { data: leads = [], isLoading } = useGetLeadsQuery();
  const [updateStatus] = useUpdateLeadStatusMutation();
  const [deleteLead] = useDeleteLeadMutation();
  const [updateLead] = useUpdateLeadMutation();

  /* ---------------- STATE ---------------- */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [noteInputs, setNoteInputs] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  /* ---------------- FILTER ---------------- */
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) =>
        lead.name?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((lead) =>
        statusFilter ? lead.status === statusFilter : true
      );
  }, [leads, search, statusFilter]);

  const totalPages = Math.ceil(filteredLeads.length / LEADS_PER_PAGE);

  const paginatedLeads = useMemo(() => {
    return filteredLeads.slice(
      (page - 1) * LEADS_PER_PAGE,
      page * LEADS_PER_PAGE
    );
  }, [filteredLeads, page]);

  /* ---------------- HANDLERS ---------------- */

  const handleStatusChange = async (id, newStatus) => {
    await updateStatus({ id, status: newStatus });
  };

  const handleDeleteLead = async (id) => {
    if (confirm("Delete this lead?")) {
      await deleteLead(id);
    }
  };

  const handleEditClick = (lead) => {
    setEditingId(lead.$id);
    setEditData({
      name: lead.name,
      email: lead.email,
      number: lead.number,
      service: lead.service,
    });
  };

  const handleSave = async (id) => {
    await updateLead({ id, updates: editData }).unwrap();
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleAddNote = async () => {
    if (!selectedLead) return;

    const text = noteInputs[selectedLead.$id];
    if (!text?.trim()) return;

    const existingNotes = selectedLead.notes
      ? JSON.parse(selectedLead.notes)
      : [];

    await updateLead({
      id: selectedLead.$id,
      updates: {
        notes: JSON.stringify([
          ...existingNotes,
          {
            text,
            addedBy: user.name,
            role: user.role,
            date: new Date().toISOString(),
          },
        ]),
      },
    });

    setNoteInputs({
      ...noteInputs,
      [selectedLead.$id]: "",
    });

    setIsNotesModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }



  return (
    <div className="p-4 md:p-8 h-screen flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
          <p className="text-sm text-gray-500">Track and manage  leads</p>
        </div>

        <div className="flex items-center flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            placeholder="Search..."
            className="border px-4 py-2 rounded-lg w-full sm:w-64 focus:ring-1 focus:ring-slate-950 outline-none    border-[#e6e6e6]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Filter
            size={16}
            className="text-slate-500 pointer-events-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#e6e6e6] px-4 py-2 rounded-lg focus:ring-1 focus:ring-slate-950 text-slate-600 outline-none"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-[#e6e6e6] flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1 overflow-y-auto">
          <table className="min-w-full text-sm">

            {/* TABLE HEAD */}
            <thead className="bg-gray-100 text-blue-950 uppercase text-xs sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Number</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Notes</th>
                {user?.role === "admin" && (
                  <th className="px-6 py-3 text-left">Actions</th>
                )}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y">
              {paginatedLeads.map((lead) => (
                <tr key={lead.$id} className="hover:bg-gray-50 transition border-none">

                  {/* NAME */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {lead.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {lead.email}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {lead.number}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {lead.service}
                  </td>

                  {/* STATUS BADGE */}
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead.$id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-full text-center text-xs font-semibold border transition outline-none
                        ${lead.status === "new" && "bg-gray-100 text-gray-700 border-gray-300"}
                          ${lead.status === "interested" && "bg-blue-50 text-blue-600 border-blue-200"}
                         ${lead.status === "not_interested" && "bg-red-50 text-red-600 border-red-200"}
                           ${lead.status === "not_contacted" && "bg-orange-50 text-orange-600 border-orange-200"}
                         ${lead.status === "followed_up" && "bg-yellow-50 text-yellow-700 border-yellow-200"}
                        ${lead.status === "converted" && "bg-green-50 text-green-600 border-green-200"}
                       ${lead.status === "lost" && "bg-pink-50 text-pink-600 border-pink-200"}
                      `}
                    >
                      <option value="new">New</option>
                      <option value="interested">Interested</option>
                      <option value="not_interested">Not Interested</option>
                      <option value="not_contacted">Not Contacted</option>
                      <option value="followed_up">Followed Up</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>

                  {/* NOTES BUTTON */}
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsNotesModalOpen(true);
                      }}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      View
                    </button>

                    {/* <button
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsNotesModalOpen(true);
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button> */}
                  </td>

                  {/* ADMIN ACTIONS */}
                  {user?.role === "admin" && (
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEditClick(lead)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteLead(lead.$id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* NOTES MODAL */}
      {isNotesModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative">

            {/* Close Button */}
            <button
              onClick={() => {
                setIsNotesModalOpen(false);
                setSelectedLead(null);
              }}
              className="absolute top-2 right-2"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-3">
              Notes - {selectedLead.name}
            </h2>

            {/* Parse Notes Safely */}
            {(() => {
              const parsedNotes = selectedLead.notes
                ? JSON.parse(selectedLead.notes)
                : [];

              return (
                <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                  {parsedNotes.length > 0 ? (
                    parsedNotes.map((note, i) => (
                      <div key={i} className="bg-gray-100 p-2 rounded text-xs">
                        <p>{note.text}</p>
                        <p className="text-gray-500">
                          {note.addedBy} ({note.role})
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">
                      No notes yet
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Add Note */}
            <textarea
              value={noteInputs[selectedLead.$id] || ""}
              onChange={(e) =>
                setNoteInputs({
                  ...noteInputs,
                  [selectedLead.$id]: e.target.value,
                })
              }
              className="border w-full text-xs p-2 mb-2"
              placeholder="Write note..."
            />

            <button
              onClick={async () => {
                const text = noteInputs[selectedLead.$id];
                if (!text?.trim()) return;

                const existingNotes = selectedLead.notes
                  ? JSON.parse(selectedLead.notes)
                  : [];

                await updateLead({
                  id: selectedLead.$id,
                  updates: {
                    notes: JSON.stringify([
                      ...existingNotes,
                      {
                        text,
                        addedBy: user.name,
                        role: user.role,
                        date: new Date().toISOString(),
                      },
                    ]),
                  },
                }).unwrap();

                setNoteInputs({
                  ...noteInputs,
                  [selectedLead.$id]: "",
                });

                setIsNotesModalOpen(false);
                setSelectedLead(null);
              }}
              className="w-full bg-green-600 text-white py-2 rounded text-sm"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;