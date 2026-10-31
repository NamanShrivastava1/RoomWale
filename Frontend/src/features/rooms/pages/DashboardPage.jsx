import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  ArrowUpRight,
  Users,
  Leaf,
  CalendarDays,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import {
  fetchRooms,
  createRoom,
  joinRoom,
  clearRoomError,
} from "../rooms.slice.js";
import RoomCard from "../components/RoomCard.jsx";
import { RoomModal } from "../components/RoomModals.jsx";
import { formatDate } from "../../../lib/normalize.js";
export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const {
    items: rooms,
    status,
    error,
    mutationStatus,
  } = useSelector((s) => s.rooms);
  const [modal, setModal] = useState(null);
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);
  const submit = async (value) => {
    const action =
      modal === "join" ? joinRoom(value) : createRoom({ name: value });
    const result = await dispatch(action);
    if (
      (modal === "join" && joinRoom.fulfilled.match(result)) ||
      (modal === "create" && createRoom.fulfilled.match(result))
    ) {
      setModal(null);
      dispatch(fetchRooms());
    }
  };
  const first = user?.name?.split(" ")[0] || "there";
  return (
    <div className="dashboard page-enter">
      <section className="welcome-section">
        <div className="welcome-copy">
          <span className="eyebrow">
            <span className="live-dot" /> YOUR LITTLE CORNER OF THE WORLD
          </span>
          <h1>
            Hey, {first}
            <span className="heading-comma">.</span>
            <br />
            <span className="serif-heading">Good to have you home.</span>
          </h1>
          <p>
            Shared spaces work better when everyone’s in the loop. Here’s your
            household, all in one place.
          </p>
          <div className="welcome-meta">
            <span>
              <CalendarDays size={15} />
              {formatDate(new Date())}
            </span>
            <span className="meta-divider" />
            <span>
              <Leaf size={15} />
              Small things, shared fairly.
            </span>
          </div>
        </div>
        <div className="welcome-illustration" aria-hidden="true">
          <div className="sun-disc" />
          <div className="illustration-house">
            <div className="house-roof" />
            <div className="house-body">
              <span className="house-window window-one" />
              <span className="house-window window-two" />
              <span className="house-door" />
            </div>
          </div>
          <div className="plant plant-left">
            <i />
            <i />
            <i />
            <b />
          </div>
          <div className="plant plant-right">
            <i />
            <i />
            <i />
            <b />
          </div>
          <span className="illustration-spark spark-one">✳</span>
          <span className="illustration-spark spark-two">✦</span>
          <div className="ground-line" />
        </div>
      </section>
      <section className="rooms-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR HOUSEHOLDS</span>
            <h2>
              Places you call home{" "}
              <span className="count-pill">{rooms.length}</span>
            </h2>
            <p>Jump back into a room, or start a new one.</p>
          </div>
          <div className="section-actions">
            <button
              className="button button-secondary"
              onClick={() => {
                dispatch(clearRoomError());
                setModal("join");
              }}
            >
              <KeyRound size={16} /> Join a room
            </button>
            <button
              className="button button-primary"
              onClick={() => {
                dispatch(clearRoomError());
                setModal("create");
              }}
            >
              <Plus size={17} /> New room
            </button>
          </div>
        </div>
        {error && (
          <div className="inline-error">
            {error}{" "}
            <button onClick={() => dispatch(fetchRooms())}>Try again</button>
          </div>
        )}
        {status === "loading" && rooms.length === 0 ? (
          <div className="room-grid">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </div>
        ) : rooms.length > 0 ? (
          <div className="room-grid">
            {rooms.map((room, i) => (
              <RoomCard key={room._id || room.id || i} room={room} index={i} />
            ))}
            <button
              className="add-room-card reveal-card"
              onClick={() => setModal("create")}
            >
              <span className="add-circle">
                <Plus size={21} />
              </span>
              <b>A new chapter?</b>
              <span>Create another room</span>
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration">
              <HouseIcon />
            </div>
            <h3>Your home base starts here.</h3>
            <p>
              Create a room for your flat, house, or shared space. Invite your
              people and keep the everyday jobs fair.
            </p>
            <div className="empty-actions">
              <button
                className="button button-primary"
                onClick={() => setModal("create")}
              >
                <Plus size={17} /> Create your first room
              </button>
              <button
                className="button button-secondary"
                onClick={() => setModal("join")}
              >
                <KeyRound size={16} /> I have an invite code
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="gentle-reminder">
        <span className="reminder-icon">
          <Leaf size={20} />
        </span>
        <div>
          <b>A little reminder</b>
          <p>
            It’s not about doing everything. It’s about everyone doing a little.
          </p>
        </div>
        <span className="reminder-flower">✳</span>
      </section>
      {modal && (
        <RoomModal
          mode={modal}
          onClose={() => setModal(null)}
          onSubmit={submit}
          loading={mutationStatus === "loading"}
          error={error}
        />
      )}
    </div>
  );
}
function HouseIcon() {
  return (
    <svg viewBox="0 0 100 90" aria-hidden="true">
      <path
        d="M13 43 50 13l37 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 40v38h52V40"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M43 78V55h14v23"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
    </svg>
  );
}
