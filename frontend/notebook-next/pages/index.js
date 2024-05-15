import { useState } from "react";
import NoteForm from "@/app/note/note.form";
import NoteList from "@/app/note/note.list";
import TagDelete from "@/app/tag/tag.delete";

const Home = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [showTagDelete, setShowTagDelete] = useState(false);
  const [reload, setReload] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ display: 'block', margin: '10px auto' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ display: 'block', margin: '10px auto' }}
          />
          <button type="submit" style={{ display: 'block', margin: '10px auto' }}>Login</button>
        </form>
      </div>
    );
  }

  const handleSave = () => {
    setReload(!reload);
  };

  return (
    <div style={{ margin: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setShowArchived(!showArchived)}
          style={{ marginRight: "10px" }}
        >
          {showArchived ? "Show Active Notes" : "Show Archived Notes"}
        </button>
        <button onClick={() => setShowTagDelete(true)}>
          Click Here To Delete Tags
        </button>
        <TagDelete
          open={showTagDelete}
          onClose={() => setShowTagDelete(false)}
        />
      </div>
      <h1>{showArchived ? "Archived Notes" : "Active Notes"}</h1>
      {!showArchived && (
        <NoteForm onSave={handleSave} style={{ margin: "20px 0" }} />
      )}
      <NoteList
        type={showArchived ? "archived" : "active"}
        key={reload}
        style={{ margin: "20px 0" }}
      />
    </div>
  );
};

export default Home;
