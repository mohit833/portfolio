// The assistant's face: a small robot that blinks while idle and scans its
// eyes while it is working.
export default function BotMark({ busy = false, className = '' }) {
  return (
    <svg
      className={`botmark${busy ? ' is-busy' : ''}${className ? ` ${className}` : ''}`}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <line className="botmark-stalk" x1="20" y1="4.5" x2="20" y2="10" />
      <circle className="botmark-bulb" cx="20" cy="3.2" r="2.2" />
      <rect className="botmark-head" x="7.5" y="10" width="25" height="21" rx="7.5" />
      <rect className="botmark-ear" x="4" y="17" width="3" height="7" rx="1.5" />
      <rect className="botmark-ear" x="33" y="17" width="3" height="7" rx="1.5" />
      <g className="botmark-eyes">
        <circle cx="15.2" cy="19.5" r="2.5" />
        <circle cx="24.8" cy="19.5" r="2.5" />
      </g>
      <path className="botmark-mouth" d="M15.5 25.5h9" />
    </svg>
  )
}
