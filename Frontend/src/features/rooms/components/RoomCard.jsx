import { Link } from "react-router-dom";
import { ArrowUpRight, Users, CheckCircle2 } from "lucide-react";
const colors = ["sage", "peach", "lavender", "butter"];
export default function RoomCard({ room, index = 0 }) {
  const id = room?._id || room?.id;
  const members = room?.members || [];
  return (
    <Link
      to={`/rooms/${id}`}
      className={`room-card reveal-card ${colors[index % colors.length]}`}
    >
      <div className="room-card-top">
        <span className="room-symbol">⌂</span>
        <span className="card-arrow">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="room-card-body">
        <h3>{room?.name || "Our home"}</h3>
        <p>
          <Users size={15} />
          {members.length || room?.memberCount || 1}{" "}
          {members.length === 1 ? "roommate" : "roommates"}
        </p>
      </div>
      <div className="room-card-bottom">
        <span>
          <CheckCircle2 size={15} /> Keep the good flow
        </span>
        <span className="room-card-index">0{index + 1}</span>
      </div>
    </Link>
  );
}
