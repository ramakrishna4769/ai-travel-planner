import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../services/api";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("itinerary"); // itinerary, budget, packing
  const [activeDay, setActiveDay] = useState(1);
  
  // States for Adding manual activity
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActTime, setNewActTime] = useState("Morning");
  const [newActTitle, setNewActTitle] = useState("");
  const [newActDesc, setNewActDesc] = useState("");
  const [addModalDay, setAddModalDay] = useState(1);

  // States for AI day regeneration
  const [regenInstruction, setRegenInstruction] = useState("");
  const [regeneratingDayNum, setRegeneratingDayNum] = useState(null);
  const [regenError, setRegenError] = useState("");

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getTrip(id);
      setTrip(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch trip details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Packing Item Checkbox
  const handleTogglePacking = async (itemId) => {
    if (!trip) return;

    const updatedPackingList = trip.packingList.map((item) =>
      item._id === itemId ? { ...item, packed: !item.packed } : item
    );

    // Optimistic UI update
    setTrip({ ...trip, packingList: updatedPackingList });

    try {
      await api.updateTrip(id, { packingList: updatedPackingList });
    } catch (err) {
      console.error("Failed to update packing state on server", err);
      // Rollback
      fetchTripDetails();
    }
  };

  // Delete an Activity manually
  const handleDeleteActivity = async (dayNumber, activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;

    const updatedItinerary = trip.itinerary.map((day) => {
      if (Number(day.dayNumber) === Number(dayNumber)) {
        return {
          ...day,
          activities: day.activities.filter((act) => act._id !== activityId),
        };
      }
      return day;
    });

    setTrip({ ...trip, itinerary: updatedItinerary });

    try {
      await api.updateTrip(id, { itinerary: updatedItinerary });
    } catch (err) {
      console.error(err);
      alert("Failed to update itinerary on server");
      fetchTripDetails();
    }
  };

  // Add an Activity manually
  const handleAddActivitySubmit = async (e) => {
    e.preventDefault();
    if (!newActTitle) return;

    const newActivity = {
      time: newActTime,
      title: newActTitle,
      description: newActDesc,
    };

    const updatedItinerary = trip.itinerary.map((day) => {
      if (Number(day.dayNumber) === Number(addModalDay)) {
        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      }
      return day;
    });

    setTrip({ ...trip, itinerary: updatedItinerary });
    setShowAddModal(false);
    setNewActTitle("");
    setNewActDesc("");

    try {
      await api.updateTrip(id, { itinerary: updatedItinerary });
      // Fetch details to get new DB assigned _ids
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      alert("Failed to add activity");
      fetchTripDetails();
    }
  };

  // Call AI to Regenerate a Specific Day
  const handleRegenerateDay = async (dayNumber) => {
    if (!regenInstruction) return;
    setRegeneratingDayNum(dayNumber);
    setRegenError("");

    try {
      const updatedTrip = await api.regenerateDay(id, dayNumber, regenInstruction);
      setTrip(updatedTrip);
      setRegenInstruction("");
    } catch (err) {
      setRegenError(err.message || "Failed to regenerate day");
    } finally {
      setRegeneratingDayNum(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative pb-12">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header/Nav */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden md:block">
            {trip.destination}
          </h1>

          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
            {trip.days} Days / {trip.budgetType} Budget
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl mx-auto px-6 mt-8">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {trip.destination}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {(trip.interests || []).map((interest, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Custom Tabs */}
          <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex gap-1">
            <button
              onClick={() => setActiveTab("itinerary")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "itinerary"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📅 Itinerary
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "budget"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              💵 Budget & Hotels
            </button>
            <button
              onClick={() => setActiveTab("packing")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === "packing"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🎒 Packing List
              {trip.packingList && trip.packingList.length > 0 && (
                <span className="ml-1.5 bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-md text-slate-300">
                  {trip.packingList.filter(p => p.packed).length}/{trip.packingList.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Itinerary */}
        {activeTab === "itinerary" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Day Selector (3 Cols) */}
            <div className="md:col-span-3 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block px-2">
                Trip Timeline
              </span>
              <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {trip.itinerary.map((day) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDay(day.dayNumber)}
                    className={`p-3.5 rounded-2xl text-left text-sm font-bold border transition-all flex items-center gap-2 whitespace-nowrap min-w-[100px] md:min-w-0 ${
                      activeDay === day.dayNumber
                        ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-md shadow-blue-500/5"
                        : "bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white"
                    }`}
                  >
                    <span>Day {day.dayNumber}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Day Details & Editing (9 Cols) */}
            <div className="md:col-span-9 space-y-6">
              {trip.itinerary
                .filter((day) => day.dayNumber === activeDay)
                .map((day) => (
                  <div key={day.dayNumber} className="space-y-6">
                    {/* Day Header with Actions */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-extrabold text-white">
                        Day {day.dayNumber} Activities
                      </h3>
                      <button
                        onClick={() => {
                          setAddModalDay(day.dayNumber);
                          setShowAddModal(true);
                        }}
                        className="bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        + Add Activity
                      </button>
                    </div>

                    {/* Timeline List */}
                    {day.activities.length === 0 ? (
                      <div className="bg-slate-900/30 rounded-3xl border border-slate-900 p-8 text-center text-slate-400 text-sm">
                        No activities scheduled for this day yet. Click "+ Add Activity" above to add some manually.
                      </div>
                    ) : (
                      <div className="space-y-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-900">
                        {day.activities.map((activity, idx) => (
                          <div
                            key={activity._id || idx}
                            className="bg-slate-900/40 border border-slate-900 hover:border-slate-850 p-6 rounded-3xl flex gap-4 items-start relative hover:bg-slate-900/60 transition-all group"
                          >
                            {/* Dot icon */}
                            <div className="w-4 h-4 rounded-full bg-blue-500 border-[3px] border-slate-950 mt-1 relative z-10 flex-shrink-0"></div>

                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                                    {activity.time}
                                  </span>
                                  <h4 className="text-lg font-bold text-white leading-tight">
                                    {activity.title}
                                  </h4>
                                </div>
                                <button
                                  onClick={() => handleDeleteActivity(day.dayNumber, activity._id)}
                                  className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-850 transition-colors text-xs font-bold opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                  Delete
                                </button>
                              </div>
                              {activity.description && (
                                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                  {activity.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Day Regeneration Input */}
                    <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-6 space-y-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          ✨ AI Day Customizer
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Tell the AI how you want to modify Day {day.dayNumber}. (e.g. "make it relaxed", "more adventure", "add fine dining").
                        </p>
                      </div>

                      {regenError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">
                          {regenError}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder='e.g. Focus more on outdoor activities and local food'
                          value={regenInstruction}
                          onChange={(e) => setRegenInstruction(e.target.value)}
                          className="flex-grow p-3 rounded-xl bg-slate-800 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all text-xs"
                          disabled={regeneratingDayNum !== null}
                        />
                        <button
                          onClick={() => handleRegenerateDay(day.dayNumber)}
                          disabled={!regenInstruction || regeneratingDayNum !== null}
                          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                        >
                          {regeneratingDayNum === day.dayNumber ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                              Updating...
                            </>
                          ) : (
                            "Regenerate Day"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 2: Budget & Hotels */}
        {activeTab === "budget" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Budget Breakdown (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-6">
              <h3 className="text-xl font-bold border-b border-slate-800 pb-3">
                Estimated Expenses
              </h3>

              <div className="space-y-4">
                {Object.entries(trip.budgetBreakdown || {})
                  .filter(([key]) => key !== "total")
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 capitalize">{key}</span>
                      <span className="font-bold text-white">${value}</span>
                    </div>
                  ))}

                <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                  <span className="text-white font-semibold">Total Estimated Budget</span>
                  <span className="text-xl font-black text-blue-400">
                    ${trip.budgetBreakdown?.total || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Suggested Hotels (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-bold">Recommended Hotels</h3>
              
              <div className="space-y-4">
                {(trip.hotels || []).map((hotel, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/50 border border-slate-900 p-6 rounded-3xl flex flex-col justify-between hover:border-slate-800 transition-all relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white">{hotel.name}</h4>
                      <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold">
                        {hotel.priceRange}
                      </span>
                    </div>

                    <div className="text-amber-400 text-xs font-bold mb-3 flex items-center gap-1">
                      ⭐ {hotel.rating || "N/A Rating"}
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed">
                      {hotel.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Packing List */}
        {activeTab === "packing" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Custom Packing List</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  AI-recommended gear for {trip.destination} and your selected interests.
                </p>
              </div>

              {/* Progress counter */}
              <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
                Packed:{" "}
                <strong className="text-blue-400">
                  {trip.packingList?.filter((i) => i.packed).length || 0}
                </strong>{" "}
                / {trip.packingList?.length || 0}
              </div>
            </div>

            {/* List Grouped by Category */}
            {!trip.packingList || trip.packingList.length === 0 ? (
              <div className="bg-slate-900/30 rounded-3xl border border-slate-900 p-8 text-center text-slate-400 text-sm">
                No packing list available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from(new Set(trip.packingList.map((item) => item.category || "General"))).map(
                  (category) => (
                    <div
                      key={category}
                      className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6"
                    >
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2 mb-4">
                        {category}
                      </h4>

                      <div className="space-y-3">
                        {trip.packingList
                          .filter((item) => (item.category || "General") === category)
                          .map((item) => (
                            <label
                              key={item._id}
                              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                                item.packed
                                  ? "bg-green-500/5 border-green-500/10 text-slate-500 line-through"
                                  : "bg-slate-900/50 border-slate-900 text-slate-200 hover:border-slate-800 hover:bg-slate-900"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={!!item.packed}
                                onChange={() => handleTogglePacking(item._id)}
                                className="w-5 h-5 rounded-md bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors cursor-pointer"
                              />
                              <span className="text-sm font-semibold">{item.item}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Manual Activity Addition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Add Custom Activity</h3>
              <p className="text-slate-400 text-xs mt-1">
                Add an activity manually to Day {addModalDay}'s timeline
              </p>
            </div>

            <form onSubmit={handleAddActivitySubmit} className="space-y-4">
              <div>
                <label className="block text-slate-350 text-xs font-bold uppercase tracking-wider mb-2">
                  Time of Day
                </label>
                <select
                  value={newActTime}
                  onChange={(e) => setNewActTime(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-350 text-xs font-bold uppercase tracking-wider mb-2">
                  Activity Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Visit Fushimi Inari Shrine"
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-350 text-xs font-bold uppercase tracking-wider mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="e.g. Climb the mountain path through thousands of vermilion torii gates"
                  value={newActDesc}
                  onChange={(e) => setNewActDesc(e.target.value)}
                  rows="3"
                  className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}