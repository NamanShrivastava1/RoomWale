import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Plus,
  Check,
  Users,
  Copy,
  ClipboardCheck,
  CalendarDays,
  House,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { roomsApi } from "../rooms.api.js";
import {
  fetchTasks,
  addTask,
  completeTask,
  clearTaskError,
} from "../../tasks/tasks.slice.js";
import {
  getPayload,
  getArray,
  formatDate,
  initials,
} from "../../../lib/normalize.js";
import { RoomModal } from "../components/RoomModals.jsx";
export default function RoomPage() {
  const { roomId } = useParams(),
    dispatch = useDispatch();
  const { items: rooms } = useSelector((s) => s.rooms);
  const { itemsByRoom, status, error, mutationStatus, notice } = useSelector(
    (s) => s.tasks,
  );
  const [room, setRoom] = useState(null),
    [roomError, setRoomError] = useState(""),
    [showTask, setShowTask] = useState(false),
    [taskTitle, setTaskTitle] = useState(""),
    [taskDescription, setTaskDescription] = useState(""),
    [taskPoints, setTaskPoints] = useState(1),
    [inviteModal, setInviteModal] = useState(false),
    [inviteCode, setInviteCode] = useState(""),
    [copied, setCopied] = useState(false);
  const tasks = itemsByRoom[roomId] || [];
  useEffect(() => {
    let live = true;
    roomsApi
      .get(roomId)
      .then((r) => {
        if (live) setRoom(getPayload(r)?.room || getPayload(r));
      })
      .catch((e) => {
        if (live) {
          const cached = rooms.find((x) => (x._id || x.id) === roomId);
          setRoom(cached || null);
          setRoomError(e.userMessage || "Could not load this room");
        }
      });
    dispatch(fetchTasks(roomId));
    return () => {
      live = false;
    };
  }, [roomId, dispatch]);
  const create = async (e) => {
    e.preventDefault();
    const r = await dispatch(
      addTask({
        roomId,
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        points: Number(taskPoints),
      }),
    );
    if (addTask.fulfilled.match(r)) {
      setTaskTitle("");
      setTaskDescription("");
      setTaskPoints(1);
      setShowTask(false);
      dispatch(fetchTasks(roomId));
    }
  };
  const mark = async (task) => {
    dispatch(clearTaskError());
    const r = await dispatch(
      completeTask({
        taskId: task._id || task.id,
        roomId,
        completionDate: new Date().toLocaleDateString("en-CA"),
        note: "",
      }),
    );
    if (completeTask.fulfilled.match(r)) dispatch(fetchTasks(roomId));
  };
  const getInvite = async () => {
    try {
      const result = getPayload(await roomsApi.get(roomId));
      setInviteCode(result?.inviteCode || result?.room?.inviteCode || "");
    } catch {}
    setInviteModal(true);
  };
  const copy = async () => {
    if (inviteCode) {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };
  return (
    <div className="room-page page-enter">
      <Link className="back-link" to="/">
        <ArrowLeft size={16} /> All rooms
      </Link>
      <section className="room-hero">
        <div className="room-hero-icon">
          <House size={25} />
        </div>
        <div className="room-hero-copy">
          <span className="eyebrow">YOUR SHARED SPACE</span>
          <h1>
            {room?.name || "Your room"}
            <span className="heading-comma">.</span>
          </h1>
          <p>A good home is a team effort. Here’s what needs doing.</p>
          <div className="room-meta">
            <span>
              <Users size={15} />
              {room?.members?.length || room?.memberCount || 1} members
            </span>
            <span>
              <CalendarDays size={15} />
              {formatDate(new Date())}
            </span>
          </div>
        </div>
        <button
          className="button button-secondary invite-button"
          onClick={getInvite}
        >
          <Users size={16} /> Invite roommates
        </button>
      </section>
      {roomError && (
        <div className="inline-error">
          {roomError}{" "}
          <button
            onClick={() =>
              roomsApi
                .get(roomId)
                .then((r) => setRoom(getPayload(r)))
                .catch(() => {})
            }
          >
            Retry
          </button>
        </div>
      )}
      <section className="tasks-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE LITTLE THINGS</span>
            <h2>
              Today’s shared list{" "}
              <span className="count-pill">{tasks.length}</span>
            </h2>
            <p>Every small job counts. Log it when you’ve done it.</p>
          </div>
          <button
            className="button button-primary"
            onClick={() => setShowTask(!showTask)}
          >
            <Plus size={17} /> Add a task
          </button>
        </div>
        {showTask && (
          <form className="add-task-form" onSubmit={create}>
            <div className="form-title">
              <b>What needs doing?</b>
              <button
                type="button"
                className="text-button"
                onClick={() => setShowTask(false)}
              >
                Cancel
              </button>
            </div>
            <div className="task-fields">
              <input
                className="text-input"
                placeholder="e.g. Wash the dishes"
                required
                maxLength={100}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <input
                className="text-input"
                placeholder="A little detail (optional)"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <select
                className="text-input"
                value={taskPoints}
                onChange={(e) => setTaskPoints(e.target.value)}
              >
                <option value={1}>1 point</option>
                <option value={2}>2 points</option>
                <option value={3}>3 points</option>
                <option value={5}>5 points</option>
              </select>
              <button
                className="button button-primary"
                disabled={mutationStatus === "loading"}
              >
                Save task
              </button>
            </div>
          </form>
        )}
        {error && <div className="inline-error">{error}</div>}
        {notice && (
          <div className="success-banner">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}
        {status === "loading" && tasks.length === 0 ? (
          <div className="task-skeletons">
            <div />
            <div />
            <div />
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state compact-empty">
            <div className="empty-illustration">
              <House size={34} />
            </div>
            <h3>Nothing on the list. Yet.</h3>
            <p>
              Add the first small task and make it easier for everyone to pitch
              in.
            </p>
            <button
              className="button button-primary"
              onClick={() => setShowTask(true)}
            >
              <Plus size={17} /> Add the first task
            </button>
          </div>
        ) : (
          <div className="task-list">
            {tasks
              .filter((t) => t.isActive !== false)
              .map((task, i) => (
                <article
                  className="task-row reveal-card"
                  key={task._id || task.id || i}
                >
                  <div className="task-check-icon">
                    <Check size={19} />
                  </div>
                  <div className="task-details">
                    <h3>{task.title || task.name || "Household task"}</h3>
                    <p>
                      {task.description || "A little help goes a long way."}
                    </p>
                  </div>
                  <span className="points-chip">
                    {task.points || 1} pt{(task.points || 1) > 1 ? "s" : ""}
                  </span>
                  <button
                    className="button button-complete"
                    onClick={() => mark(task)}
                    disabled={mutationStatus === "loading"}
                  >
                    <CheckCircle2 size={16} /> Done
                  </button>
                </article>
              ))}
          </div>
        )}
      </section>
      <section className="room-bottom-note">
        <span className="note-avatar">{initials("Room Wale")}</span>
        <p>
          <b>Teamwork, not a competition.</b>
          <br />
          Every completion gets its own record, so everyone’s contribution
          counts.
        </p>
      </section>
      {inviteModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setInviteModal(false);
          }}
        >
          <section className="modal-card">
            <button
              className="icon-button modal-close"
              onClick={() => setInviteModal(false)}
            >
              <span>×</span>
            </button>
            <span className="modal-icon">
              <Users size={22} />
            </span>
            <span className="eyebrow">BETTER TOGETHER</span>
            <h2>Bring your people in.</h2>
            <p>Share this invite code with the people you live with.</p>
            {inviteCode ? (
              <div className="invite-code-box">
                <code>{inviteCode}</code>
                <button className="button button-secondary" onClick={copy}>
                  {copied ? <ClipboardCheck size={16} /> : <Copy size={16} />}{" "}
                  {copied ? "Copied" : "Copy code"}
                </button>
              </div>
            ) : (
              <p className="form-hint">
                Your backend may not return the invite code in the room details
                response yet. Check the room API response or add an invite-code
                endpoint.
              </p>
            )}
            <button
              className="button button-primary button-wide"
              onClick={() => setInviteModal(false)}
            >
              Done
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
