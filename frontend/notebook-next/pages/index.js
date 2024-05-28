import { useState, useRef } from "react";
import NoteForm from "@/app/note/note.form";
import NoteList from "@/app/note/note.list";
import TagDelete from "@/app/tag/tag.delete";
import TagManagerWrapper from "@/app/tag/tag.manager.wrapper";

const Home = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [showTagDelete, setShowTagDelete] = useState(false);
  const [reload, setReload] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const refetchTags = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", false);
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

  const handleTagChange = () => {
    if (refetchTags.current) {
      refetchTags.current();
    }
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
          onTagChange={handleTagChange}
        />
        <TagManagerWrapper onTagChange={handleTagChange} />
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </div>
      <h1>{showArchived ? "Archived Notes" : "Active Notes"}</h1>
      {!showArchived && (
        <NoteForm onSave={handleSave} style={{ margin: "20px 0" }} />
      )}
      <NoteList
        type={showArchived ? "archived" : "active"}
        key={reload}
        refetchTags={refetchTags}
        style={{ margin: "20px 0" }}
      />
    </div>
  );
};

export default Home;
