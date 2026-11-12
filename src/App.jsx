import { useState } from "react";
import "./App.css";

const starterClubs = [
  { id: 1, name: "Coding Club", category: "Technology", icon: "💻", description: "Learn coding, build projects and explore technology.", members: 240 },
  { id: 2, name: "Dramatics Club", category: "Cultural", icon: "🎭", description: "Explore acting, theatre and storytelling.", members: 180 },
  { id: 3, name: "Photography Club", category: "Creative", icon: "📸", description: "Capture campus life through your lens.", members: 120 },
  { id: 4, name: "Literary Society", category: "Literary", icon: "📚", description: "Explore poetry, writing and debates.", members: 95 },
  { id: 5, name: "Sports Club", category: "Sports", icon: "🏆", description: "Meet teammates and enjoy sports.", members: 300 },
  { id: 6, name: "Music Society", category: "Cultural", icon: "🎵", description: "Discover musicians and performances.", members: 150 }
];

const starterEvents = [
  { id: 101, name: "CodeVerse Hackathon", category: "Technology", date: "2026-11-08", location: "University Campus", club: "Coding Club", description: "Build innovative projects with other students." },
  { id: 102, name: "Cultural Night", category: "Cultural", date: "2026-11-12", location: "Main Auditorium", club: "Dramatics Club", description: "An evening of music, dance and performances." },
  { id: 103, name: "Photography Walk", category: "Creative", date: "2026-11-16", location: "University Campus", club: "Photography Club", description: "Explore campus and take amazing photos." }
];

function readData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [clubs, setClubs] = useState(() => readData("campus_clubs", starterClubs));
  const [events, setEvents] = useState(() => readData("campus_events", starterEvents));
  const [users, setUsers] = useState(() => readData("campus_users", []));
  const [user, setUser] = useState(() => readData("campus_user", null));
  const [memberships, setMemberships] = useState(() => readData("campus_memberships", []));
  const [registrations, setRegistrations] = useState(() => readData("campus_registrations", []));
  const [page, setPage] = useState("home");
  const [mode, setMode] = useState("login");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [auth, setAuth] = useState({
    name: "", email: "", password: "", role: "Student"
  });

  const [clubForm, setClubForm] = useState({
    name: "", category: "Technology", icon: "🚀", description: ""
  });

  const [eventForm, setEventForm] = useState({
    name: "", category: "Technology", date: "", location: "", club: "", description: ""
  });

  const categories = ["All", "Technology", "Cultural", "Creative", "Literary", "Sports"];

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setNotice("Could not save data in this browser.");
    }
  }

  function navigate(next) {
    setPage(next);
    setNotice("");
    setSearch("");
    setCategory("All");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openAuth(nextMode) {
    setMode(nextMode);
    setAuth({ name: "", email: "", password: "", role: "Student" });
    navigate("auth");
  }

  function handleAuth(e) {
    e.preventDefault();
    const email = auth.email.trim().toLowerCase();

    if (auth.password.length < 6) {
      setNotice("Password must contain at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      if (!auth.name.trim()) {
        setNotice("Please enter your name.");
        return;
      }

      if (users.some((item) => item.email === email)) {
        setNotice("This email already exists. Please log in.");
        return;
      }

      const newUser = {
        id: Date.now(),
        name: auth.name.trim(),
        email,
        password: auth.password,
        role: auth.role
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      save("campus_users", updatedUsers);

      const session = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };

      setUser(session);
      save("campus_user", session);
      navigate("dashboard");
      setNotice("Account created successfully!");
      return;
    }

    const found = users.find(
      (item) => item.email === email && item.password === auth.password
    );

    if (!found) {
      setNotice("Account not found or password incorrect. Please sign up first.");
      return;
    }

    const session = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role
    };

    setUser(session);
    save("campus_user", session);
    navigate("dashboard");
    setNotice("Welcome back, " + found.name + "!");
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("campus_user");
    navigate("home");
    setNotice("You have logged out.");
  }

  function joinClub(club) {
    if (!user) {
      openAuth("login");
      setNotice("Please log in to join a club.");
      return;
    }

    if (memberships.some((item) => item.userId === user.id && item.clubId === club.id)) {
      setNotice("You have already joined this club.");
      return;
    }

    const updated = [...memberships, { userId: user.id, clubId: club.id }];
    setMemberships(updated);
    save("campus_memberships", updated);
    setNotice("You joined " + club.name + "!");
  }

  function registerEvent(event) {
    if (!user) {
      openAuth("login");
      setNotice("Please log in to register for events.");
      return;
    }

    if (registrations.some((item) => item.userId === user.id && item.eventId === event.id)) {
      setNotice("You are already registered for this event.");
      return;
    }

    const updated = [...registrations, { userId: user.id, eventId: event.id }];
    setRegistrations(updated);
    save("campus_registrations", updated);
    setNotice("Registration successful for " + event.name + "!");
  }

  function createClub(e) {
    e.preventDefault();

    const updated = [
      ...clubs,
      { ...clubForm, id: Date.now(), members: 0, ownerId: user.id }
    ];

    setClubs(updated);
    save("campus_clubs", updated);
    setClubForm({ name: "", category: "Technology", icon: "🚀", description: "" });
    setNotice("Club created successfully!");
  }

  function createEvent(e) {
    e.preventDefault();

    const updated = [
      ...events,
      { ...eventForm, id: Date.now(), ownerId: user.id }
    ];

    setEvents(updated);
    save("campus_events", updated);
    setEventForm({ name: "", category: "Technology", date: "", location: "", club: "", description: "" });
    setNotice("Event created successfully!");
  }

  function deleteClub(id) {
    const updated = clubs.filter((club) => club.id !== id);
    setClubs(updated);
    save("campus_clubs", updated);
    setNotice("Club deleted.");
  }

  function deleteEvent(id) {
    const updated = events.filter((event) => event.id !== id);
    setEvents(updated);
    save("campus_events", updated);
    setNotice("Event deleted.");
  }

  const filteredClubs = clubs.filter((club) =>
    (category === "All" || club.category === category) &&
    (club.name + " " + club.description + " " + club.category)
      .toLowerCase().includes(search.toLowerCase())
  );

  const filteredEvents = events.filter((event) =>
    (category === "All" || event.category === category) &&
    (event.name + " " + event.description + " " + event.club)
      .toLowerCase().includes(search.toLowerCase())
  );

  const myClubs = clubs.filter((club) =>
    memberships.some((item) => item.userId === user?.id && item.clubId === club.id)
  );

  const myEvents = events.filter((event) =>
    registrations.some((item) => item.userId === user?.id && item.eventId === event.id)
  );

  function ClubCards({ items }) {
    return (
      <div className="grid">
        {items.map((club) => (
          <article className="card" key={club.id}>
            <span className="card-icon">{club.icon}</span>
            <small>{club.category}</small>
            <h3>{club.name}</h3>
            <p>{club.description}</p>
            <p>👥 {club.members} members</p>
            <button className="primary full" onClick={() => joinClub(club)}>Join club ↗</button>
          </article>
        ))}
        {items.length === 0 && <p>No clubs found.</p>}
      </div>
    );
  }

  function EventCards({ items }) {
    return (
      <div className="grid">
        {items.map((event) => (
          <article className="card" key={event.id}>
            <span className="card-icon">📅</span>
            <small>{event.category}</small>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>🗓️ {event.date}</p>
            <p>📍 {event.location}</p>
            <p>🏢 {event.club}</p>
            <button className="primary full" onClick={() => registerEvent(event)}>Register ↗</button>
          </article>
        ))}
        {items.length === 0 && <p>No events found.</p>}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <button className="brand" onClick={() => navigate("home")}>✦ Campus<span>Club</span></button>

        <nav>
          <button onClick={() => navigate("clubs")}>Clubs</button>
          <button onClick={() => navigate("events")}>Events</button>
          {user && <button onClick={() => navigate("dashboard")}>Dashboard</button>}
          {user?.role === "Admin" && <button onClick={() => navigate("admin")}>Admin</button>}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span>{user.name.split(" ")[0]}</span>
              <button className="outline" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <button className="outline" onClick={() => openAuth("login")}>Log in</button>
              <button className="primary" onClick={() => openAuth("signup")}>Get Started ↗</button>
            </>
          )}
        </div>
      </header>

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

      <main>
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">YOUR CAMPUS. YOUR COMMUNITY.</span>
                <h1>Find your people.<br /><em>Build your world.</em></h1>
                <p>Discover student clubs, meet people who share your passion, and make campus life unforgettable.</p>
                <button className="primary big" onClick={() => navigate("clubs")}>Explore communities ↗</button>{" "}
                <button className="outline big" onClick={() => navigate("events")}>Discover events ↓</button>
                <div className="stats">
                  <div><strong>{clubs.length}</strong><span>Student Clubs</span></div>
                  <div><strong>{clubs.reduce((sum, club) => sum + club.members, 0).toLocaleString()}</strong><span>Club Members</span></div>
                  <div><strong>{events.length}</strong><span>Events</span></div>
                </div>
              </div>
              <div className="hero-art">
                <div className="orbit"></div>
                <div className="hero-logo">C</div>
                <p>MAKE IT HAPPEN.</p>
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div><span className="eyebrow">FIND YOUR COMMUNITY</span><h2>Spaces to <em>belong.</em></h2></div>
                <button className="text-button" onClick={() => navigate("clubs")}>Explore all clubs ↗</button>
              </div>
              <ClubCards items={clubs.slice(0, 3)} />
            </section>

            <section className="section tinted">
              <div className="section-heading">
                <div><span className="eyebrow">WHAT'S HAPPENING</span><h2>Make some <em>memories.</em></h2></div>
                <button className="text-button" onClick={() => navigate("events")}>All events ↗</button>
              </div>
              <EventCards items={events.slice(0, 3)} />
            </section>

            <section className="cta">
              <h2>Don't just attend college.<br /><em>Be part of it.</em></h2>
              <button className="primary big" onClick={() => openAuth("signup")}>Join CampusClub ↗</button>
            </section>
          </>
        )}

        {page === "auth" && (
          <section className="auth-wrap">
            <div className="auth-info">
              <span className="eyebrow">YOUR CAMPUS. YOUR COMMUNITY.</span>
              <h1>Find your people.<br /><em>Build your world.</em></h1>
              <p>Join clubs, meet new people and discover campus events.</p>
            </div>

            <form className="auth-card" onSubmit={handleAuth}>
              <h2>{mode === "login" ? "Welcome back." : "Create your account"}</h2>
              <p>{mode === "login" ? "Log in to continue." : "Join your campus community today."}</p>

              <div className="tabs">
                <button type="button" className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setNotice(""); }}>Log in</button>
                <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => { setMode("signup"); setNotice(""); }}>Sign up</button>
              </div>

              {mode === "signup" && (
                <>
                  <label>Full name
                    <input required value={auth.name} onChange={(e) => setAuth({ ...auth, name: e.target.value })} placeholder="Your name" />
                  </label>
                  <label>Account type
                    <select value={auth.role} onChange={(e) => setAuth({ ...auth, role: e.target.value })}>
                      <option>Student</option>
                      <option>Club Owner</option>
                      <option>Admin</option>
                    </select>
                  </label>
                </>
              )}

              <label>Email address
                <input required type="email" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} placeholder="you@example.com" />
              </label>
              <label>Password
                <input required minLength={6} type="password" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} placeholder="At least 6 characters" />
              </label>

              <button className="primary full" type="submit">{mode === "login" ? "Log in →" : "Create account →"}</button>
              <p className="muted">Prototype only: account data is saved in this browser.</p>
            </form>
          </section>
        )}

        {(page === "clubs" || page === "events") && (
          <section className="section page-section">
            <span className="eyebrow">EXPLORE CAMPUS LIFE</span>
            <h1>{page === "clubs" ? <>Explore <em>clubs.</em></> : <>Discover <em>events.</em></>}</h1>
            <p>Find your community and discover what's happening.</p>
            <div className="filters">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            {page === "clubs" ? <ClubCards items={filteredClubs} /> : <EventCards items={filteredEvents} />}
          </section>
        )}

        {page === "dashboard" && user && (
          <section className="section page-section">
            <span className="eyebrow">YOUR CAMPUS SPACE</span>
            <h1>Welcome, <em>{user.name.split(" ")[0]}.</em></h1>
            <p>Account type: {user.role}</p>
            <div className="stats dashboard-stats">
              <div><strong>{myClubs.length}</strong><span>Clubs joined</span></div>
              <div><strong>{myEvents.length}</strong><span>Events registered</span></div>
            </div>

            {(user.role === "Club Owner" || user.role === "Admin") && (
              <div className="management">
                <h2>Create a <em>club.</em></h2>
                <form className="form-grid" onSubmit={createClub}>
                  <label>Club name<input required value={clubForm.name} onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })} /></label>
                  <label>Icon<input required value={clubForm.icon} onChange={(e) => setClubForm({ ...clubForm, icon: e.target.value })} /></label>
                  <label>Category<select value={clubForm.category} onChange={(e) => setClubForm({ ...clubForm, category: e.target.value })}>{categories.filter((item) => item !== "All").map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label>Description<input required value={clubForm.description} onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })} /></label>
                  <button className="primary" type="submit">Create club</button>
                </form>

                <h2>Create an <em>event.</em></h2>
                <form className="form-grid" onSubmit={createEvent}>
                  <label>Event name<input required value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} /></label>
                  <label>Category<select value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}>{categories.filter((item) => item !== "All").map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label>Date<input required type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} /></label>
                  <label>Location<input required value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} /></label>
                  <label>Club name<input required value={eventForm.club} onChange={(e) => setEventForm({ ...eventForm, club: e.target.value })} /></label>
                  <label>Description<input required value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} /></label>
                  <button className="primary" type="submit">Create event</button>
                </form>
              </div>
            )}

            <h2>My <em>clubs.</em></h2>
            <ClubCards items={myClubs} />
            <h2>My <em>events.</em></h2>
            <EventCards items={myEvents} />
          </section>
        )}

        {page === "admin" && user?.role === "Admin" && (
          <section className="section page-section">
            <h1>Admin <em>panel.</em></h1>
            <p>{users.length} accounts · {clubs.length} clubs · {events.length} events</p>
            <h2>Manage clubs</h2>
            {clubs.map((club) => (
              <div className="manage-row" key={club.id}>
                <span>{club.icon} {club.name}</span>
                <button className="danger" onClick={() => deleteClub(club.id)}>Delete</button>
              </div>
            ))}
            <h2>Manage events</h2>
            {events.map((event) => (
              <div className="manage-row" key={event.id}>
                <span>📅 {event.name}</span>
                <button className="danger" onClick={() => deleteEvent(event.id)}>Delete</button>
              </div>
            ))}
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2026 CampusClub. All rights reserved.</p>
      </footer>
    </div>
  );
}
export default App;