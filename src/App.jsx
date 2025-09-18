import { useCallback, useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { analyzeText } from "./lib/ai";
import Scene from "./components/Scene";
import SetupWizard from "./components/SetupWizard";
import AIAgent from "./components/AIAgent";
import "./App.css"; // Import the CSS file

function App() {
  const [note, setNote] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [newNoteTags, setNewNoteTags] = useState(""); // New state for tags
  const [fetchedNoteTags, setFetchedNoteTags] = useState([]); // New state for fetched tags
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [thoughtBubbles, setThoughtBubbles] = useState([]);
  const [setupComplete, setSetupComplete] = useState(() => {
    return localStorage.getItem('setupComplete') === 'true';
  });

  const fetchAllNotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("id, content, link, type, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllNotes(data || []);
    } catch (err) {
      console.error("Error fetching all notes:", err);
    }
  }, []);

  const fetchRandomNoteAndAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNote(null);
    setAnalysis(null);

    try {
      // 1. Get the total number of notes to pick a random one
      const { count, error: countError } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      if (count === 0) {
        // No notes to analyze
        return;
      }

      // 2. Fetch a random note
      const randomIndex = Math.floor(Math.random() * count);
      const { data, error: dbError } = await supabase
        .from("notes")
        .select("content, link, type") // Use existing columns
        .range(randomIndex, randomIndex)
        .limit(1);

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        const randomNote = data[0].content;
        const randomNoteType = data[0].type || 'note';
        setNote(randomNote);
        setFetchedNoteTags([randomNoteType]); // Use type as a pseudo-tag for now

        // 3. Send it to the AI for analysis
        const result = await analyzeText(randomNote);
        if (result.sentiment === "unknown") {
          throw new Error(result.summary);
        }
        setAnalysis(result);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // useCallback to memoize the function

  useEffect(() => {
    fetchRandomNoteAndAnalyze();
  }, [fetchRandomNoteAndAnalyze]);

  const handleAuthenticate = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123"; // Default password
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowAuth(false);
      setPassword("");
    } else {
      setError("Incorrect password");
    }
  };

  const createThoughtBubble = useCallback(() => {
    if (allNotes.length === 0) return;

    const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)];
    const bubble = {
      id: Date.now() + Math.random(),
      content: randomNote.content.substring(0, 50) + (randomNote.content.length > 50 ? '...' : ''),
      x: Math.random() * 200 - 100, // Random horizontal position
      y: -50, // Start above the head
      opacity: 1,
    };

    setThoughtBubbles(prev => [...prev, bubble]);

    // Remove bubble after animation
    setTimeout(() => {
      setThoughtBubbles(prev => prev.filter(b => b.id !== bubble.id));
    }, 4000);
  }, [allNotes]);

  const handleAddNewNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
        // For now, store tags in the content or use type field
        const noteData = { content: newNote };
        if (newNoteTags.trim()) {
          // Append tags to content for now, or you can add tags column later
          noteData.content += `\n\nTags: ${newNoteTags}`;
        }
        const { error } = await supabase.from('notes').insert([noteData]);
        if (error) throw error;
        setNewNote(""); // Clear the textarea
        setNewNoteTags(""); // Clear the tags input
        await fetchRandomNoteAndAnalyze(); // Re-fetch and analyze
        // Create a thought bubble when new note is added
        setTimeout(() => createThoughtBubble(), 1000);
    } catch (err) {
        console.error("Error adding note:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Scene keywords={analysis?.keywords} sentiment={analysis?.sentiment} />
      <div className="app-layout">
        <div className="left-panel">
          <div className="app-header">
            <h1>📝 My AI Notes</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="button-primary" onClick={fetchRandomNoteAndAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Random"}
              </button>
              <button className="button-primary" onClick={() => { setShowSidebar(!showSidebar); if (!showSidebar) fetchAllNotes(); }}>
                📋 CMS
              </button>
            </div>
          </div>

          {showSidebar && (
            <div className="cms-sidebar">
              <h3>All Notes</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className="input-field"
                style={{ marginBottom: '1rem' }}
              />
              <div className="notes-list">
                {allNotes
                  .filter(note =>
                    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (note.type && note.type.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(noteItem => (
                    <div key={noteItem.id} className="note-item" onClick={() => {
                      setNote(noteItem.content);
                      setFetchedNoteTags([noteItem.type || 'note']);
                      setAnalysis(null);
                      analyzeText(noteItem.content).then(result => {
                        if (result.sentiment !== "unknown") {
                          setAnalysis(result);
                        }
                      });
                    }}>
                      <p className="note-preview">{noteItem.content.substring(0, 100)}...</p>
                      <div className="tags-preview">
                        <span className="tag-mini">{noteItem.type || 'note'}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {loading && <p className="loading-message">Loading and analyzing note...</p>}
          {error && <p className="error-message">Error: {error}</p>}

          {!loading && !error && note && (
            <>
              <p className="note-content">
                <strong>Note:</strong> {note}
              </p>
              {fetchedNoteTags.length > 0 && (
                <p className="tags-list">
                  <strong>Tags:</strong>{" "}
                  {fetchedNoteTags.map((tag, index) => (
                    <span key={index}>{tag}</span>
                  ))}
                </p>
              )}
              {analysis && (
                <div className="info-box">
                  <h2>AI Analysis</h2>
                  <p>
                    <strong>Summary:</strong> {analysis.summary}
                  </p>
                  <p>
                    <strong>Keywords:</strong> {analysis.keywords.join(", ")}
                  </p>
                  <p>
                    <strong>Sentiment:</strong> {analysis.sentiment}
                  </p>
                </div>
              )}
            </>
          )}

          {!loading && !error && !note && (
            <p>No notes found. Add one to get started!</p>
          )}
        </div>

        <div className="center-panel">
          <div className="hoodie-figure">
            <div className="hoodie-head">
              <div className="hoodie-face"></div>
            </div>
            <div className="hoodie-body">
              <div className="hoodie-hood"></div>
            </div>
            <div className="thought-bubbles">
              {thoughtBubbles.map(bubble => (
                <div
                  key={bubble.id}
                  className="thought-bubble"
                  style={{
                    left: `${bubble.x}px`,
                    top: `${bubble.y}px`,
                    opacity: bubble.opacity,
                  }}
                >
                  {bubble.content}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-panel">
          {!isAuthenticated ? (
            <div className="info-box">
              <h2>🔒 Authentication Required</h2>
              <p>Enter password to add new notes</p>
              <form onSubmit={handleAuthenticate}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="input-field"
                />
                <button type="submit" className="button-primary">
                  Authenticate
                </button>
              </form>
            </div>
          ) : (
            <div className="info-box">
              <h2>Add a New Note</h2>
              <form onSubmit={handleAddNewNote}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write your note here..."
                  rows={4}
                  className="input-field"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={newNoteTags}
                  onChange={(e) => setNewNoteTags(e.target.value)}
                  placeholder="Add tags (comma-separated)..."
                  className="input-field"
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !newNote.trim()} className="button-primary">
                  {loading ? "Saving..." : "Save Note"}
                </button>
              </form>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="button-secondary"
                style={{ marginTop: '1rem', backgroundColor: '#666' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {!setupComplete && (
        <SetupWizard onComplete={() => setSetupComplete(true)} />
      )}

      {setupComplete && (
        <AIAgent onTaskComplete={(task) => {
          console.log('AI Agent completed task:', task);
          // Could trigger notifications or updates here
        }} />
      )}
    </>
  );
}

export default App;
