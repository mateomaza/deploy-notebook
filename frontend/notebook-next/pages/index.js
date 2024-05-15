import NoteForm from "@/app/note/note.form";
import NoteList from "@/app/note/note.list";
import { useState } from "react";

const Home = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [reload, setReload] = useState(false);

  const handleSave = () => {
    setReload(!reload);
  };

  return (
    <div>
      <button onClick={() => setShowArchived(!showArchived)}>
        {showArchived ? "Show Active Notes" : "Show Archived Notes"}
      </button>

      <h1>{showArchived ? "Archived Notes" : "Active Notes"}</h1>

      {!showArchived && <NoteForm onSave={handleSave} />}
      <NoteList type={showArchived ? 'archived' : 'active'} key={reload} />
    </div>
  );
};

export default Home;
