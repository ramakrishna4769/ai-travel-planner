import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";

const INTEREST_OPTIONS = [
  "Food",
  "Culture",
  "Adventure",
  "Shopping",
  "Nightlife",
  "Nature",
  "Relaxation",
  "History",
];

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Form States
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budgetType, setBudgetType] = useState("Medium");
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const [generating, setGenerating] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      setLoadingTrips(true);
      const data = await api.getTrips();
      setTrips(data);
    } catch (err) {
      console.error("Failed to load trips", err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleInterestChange = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!destination) {
      return setFormError("Destination is required");
    }
    if (days < 1 || days > 14) {
      return setFormError("Duration must be between 1 and 14 days");
    }

    setFormError("");
    setGenerating(true);

    try {
      const newTrip = await api.createTrip({
        destination,
        days,
        budgetType,
        interests: selectedInterests,
      });
      // Redirect to the newly generated trip
      navigate(`/trip/${newTrip._id}`);
    } catch (err) {
      setFormError(err.message || "Failed to generate travel plan");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden pb-12">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              T
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TravelAI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden md:inline">
              Welcome, <strong className="text-white">{user?.name}</strong>
            </span>
            <button
              onClick={() => {
                logoutUser();
                navigate("/login");
              }}
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Saved Trips List (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              My Travel Plans
            </h1>

            {loadingTrips ? (
              <div className="h-64 bg-slate-900/40 rounded-3xl border border-slate-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : trips.length === 0 ? (
              <div className="bg-slate-900/40 rounded-3xl border border-slate-900 p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                  ✈️
                </div>
                <h3 className="text-xl font-bold">No trips generated yet</h3>
                <p className="text-slate-400 max-w-sm mx-auto text-sm">
                  Provide your destination and preferences on the right side to generate a personalized day-by-day travel plan.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    onClick={() => navigate(`/trip/${trip._id}`)}
                    className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        {trip.days} Day Trip
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        trip.budgetType === "High"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : trip.budgetType === "Medium"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}>
                        {trip.budgetType} Budget
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {trip.destination}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {(trip.interests || []).slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                      {(trip.interests || []).length > 3 && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 font-medium">
                          +{trip.interests.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Plan Form (Right 5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Create Travel Plan
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Let the AI plan your next adventure in seconds
                </p>
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs">
                  ⚠️ {formError}
                </div>
              )}

              {generating ? (
                <div className="py-12 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-white">Generating Itinerary...</h3>
                    <p className="text-slate-400 text-xs max-w-[250px]">
                      Our AI travel agent is curating activities, budgeting expenses, and suggesting hotels.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateTrip} className="space-y-5">
                  <div>
                    <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kyoto, Japan"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Duration (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                        Budget Level
                      </label>
                      <select
                        value={budgetType}
                        onChange={(e) => setBudgetType(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                      >
                        <option value="Low">Low (Budget)</option>
                        <option value="Medium">Medium (Mid-range)</option>
                        <option value="High">High (Luxury)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                      Interests
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
                      {INTEREST_OPTIONS.map((interest) => {
                        const isChecked = selectedInterests.includes(interest);
                        return (
                          <button
                            type="button"
                            key={interest}
                            onClick={() => handleInterestChange(interest)}
                            className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                              isChecked
                                ? "bg-blue-600/10 border-blue-500 text-blue-400"
                                : "bg-slate-800/50 border-slate-700/30 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            {isChecked ? "✓ " : "+ "} {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 text-sm"
                  >
                    Generate AI Itinerary 🚀
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}