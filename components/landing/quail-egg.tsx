'use client'

export function QuailEgg() {
  return (
    <div className="relative h-[108px] w-[92px] select-none">
      <div className="egg absolute inset-0 origin-bottom animate-[wiggleEgg_3.8s_ease-in-out_infinite]">
        <svg
          viewBox="0 0 92 108"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* shadow */}
          <ellipse cx="46" cy="95" rx="21" ry="6" fill="rgba(60,65,102,0.08)" />

          {/* egg body */}
          <path
            d="M46 14
               C34 14 24 22 20 35
               C17 44 17 54 20 64
               C24 78 34 88 46 88
               C58 88 68 78 72 64
               C75 54 75 44 72 35
               C68 22 58 14 46 14Z"
            fill="#FFFDFB"
            stroke="#363B4A"
            strokeWidth="2.8"
          />

          {/* crack only */}
          <path
            className="egg-crack"
            d="M28 49
               L35 55
               L46 49
               L57 56
               L64 50"
            stroke="#363B4A"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* highlight */}
          <path
            d="M31 28C35 22 40 19 45 18"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <style jsx>{`
        .egg-crack {
          transform-origin: 46px 52px;
          transition: transform 0.22s ease;
        }

        @keyframes wiggleEgg {
          0%, 100% {
            transform: rotate(0deg) translateY(0px);
          }
          20% {
            transform: rotate(-5deg) translateY(-1px);
          }
          40% {
            transform: rotate(4deg) translateY(0px);
          }
          60% {
            transform: rotate(-3deg) translateY(-1px);
          }
          80% {
            transform: rotate(2deg) translateY(0px);
          }
        }

        /* tiny crack bounce on egg hover */
        .egg:hover .egg-crack {
          animation: crackBounce 0.35s ease;
        }

        @keyframes crackBounce {
          0% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-2px) scale(1.03); }
          100% { transform: translateY(0) scale(1); }
        }

        /* subtle "opening" illusion on egg hover */
        .egg:hover .egg-crack {
          transform: translateY(-2px);
        }

        /* stronger opening illusion when CTA is hovered */
        :global(.cta-hover:hover) .egg-crack {
          transform: translateY(-4px) scale(1.04);
        }

        :global(.cta-hover:hover) .egg {
          animation: none;
        }
      `}</style>
    </div>
  )
}