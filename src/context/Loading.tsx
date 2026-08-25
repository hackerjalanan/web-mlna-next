const LOGO_PATH =
  "M 28.381657,48.415248 12.167571,85.151282 -4.7202089,48.721826 -12.99228,67.134768 l 0.0163,0.03322 -72.714383,161.828372 h 6.563355 10.158455 16.362499 16.723753 16.8136 16.7237688 0.064483 l 13.3102622,-29.96957 0.152308,-0.13482 1.80049,-4.00715 1.989902,4.427 13.460628,29.68448 h 16.600724 18.307494 16.86438 16.467925 6.682476 10.17996 L 36.980532,66.707101 l 0.0163,-0.03322 z M 28.826918,85.180576 90.090093,215.0436 H 73.622137 l -35.958825,-76.22943 0.01629,-0.0332 -8.61185,-18.25867 -16.214054,36.73605 -1.7966,-3.87631 -1.3220436,-2.9409 c -0.00645,0.0188 -0.00988,0.0379 -0.016295,0.0567 l -13.7554928,-29.66893 -8.2720706,18.41488 0.0163,0.0332 -34.045076,75.76662 H -62.700073 L -4.4852,85.487093 l 8.5161572,18.375837 -0.012962,0.0272 8.4907488,18.31333 8.152946,-18.4676 v -0.001 l -0.01289,-0.0252 z m 0.685424,72.107084 27.245447,57.75594 H 38.762724 l -17.514646,-38.97785 0.09948,-0.22262 v -0.001 l -0.01289,-0.0259 z m -33.3127971,0.3085 8.5161552,18.37387 -0.00982,0.0259 0.019433,0.0431 -17.5263421,39.00327 h -16.813488 z";

export default function LoadingLogo() {
  return (
    <div className="loading-logo">
      <svg
        viewBox="-100 40 200 180"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Bentuk logo */}
          <clipPath id="logoClip">
            <path d={LOGO_PATH} />
          </clipPath>

          {/* Warna isi */}
          <linearGradient
            id="loadingGradient"
            x1="0"
            y1="1"
            x2="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="70%" stopColor="#008cff" />
            <stop offset="100%" stopColor="#7c4dff" />
          </linearGradient>

          {/* Efek glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Logo dasar / outline */}
        <path
          d={LOGO_PATH}
          fill="none"
          stroke="#263238"
          strokeWidth="1.5"
          opacity="0.35"
        />

        {/* Isi yang naik dari bawah */}
        <g clipPath="url(#logoClip)">
          <rect
            className="loading-fill"
            x="-110"
            y="215"
            width="220"
            height="180"
            fill="url(#loadingGradient)"
            filter="url(#glow)"
          />

          {/* Kilau horizontal */}
          <rect
            className="loading-shine"
            x="-110"
            y="80"
            width="220"
            height="3"
            fill="#ffffff"
            opacity="0.7"
          />
        </g>

        {/* Outline di atas fill supaya bentuk tetap tajam */}
        <path
          d={LOGO_PATH}
          fill="none"
          stroke="#00cfff"
          strokeWidth="1.2"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}