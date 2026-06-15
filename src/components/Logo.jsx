export default function Logo({ className = '', width = 60, height = 90 }) {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <svg
                width={width}
                height={height}
                viewBox="0 0 60 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-1"
                style={{ overflow: 'visible' }}
            >
                {/* Vertical Rectangle Outline */}
                <rect
                    x="18"
                    y="10"
                    width="24"
                    height="60"
                    stroke="#26C281"
                    strokeWidth="1.5"
                    fill="none"
                />

                {/* Outer Diamond Outline */}
                <polygon
                    points="30,16 52,38 30,60 8,38"
                    stroke="#26C281"
                    strokeWidth="1.5"
                    fill="none"
                />

                {/* Inner Diamond Outline */}
                <polygon
                    points="30,24 44,38 30,52 16,38"
                    stroke="#26C281"
                    strokeWidth="1.5"
                    fill="none"
                />

                {/* Inner Blue Square (solid) */}
                <rect
                    x="22"
                    y="30"
                    width="16"
                    height="16"
                    fill="#0071BC"
                />
            </svg>
            
            {/* Logo Text */}
            <div className="flex flex-col items-center leading-none mt-1">
                <span className="font-sans font-light tracking-wide text-[16px] text-[#26C281]">
                    Azulejos
                </span>
                <span className="font-sans font-medium tracking-wide text-[22px] text-[#0071BC] -mt-1">
                    Valencia
                </span>
            </div>
        </div>
    )
}
