export function ChartsIcon({ styles }: { styles?: React.CSSProperties | undefined }) {
  return (
    <svg
      width='70'
      height='70'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={styles}
    >
      <path
        d='M24.5 28.5V17.25M31.25 28.5V10.5M17.75 28.5V24'
        stroke='currentColor'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M16 42H32M24 34V42M8 6H40C42.2091 6 44 7.79086 44 10V30C44 32.2091 42.2091 34 40 34H8C5.79086 34 4 32.2091 4 30V10C4 7.79086 5.79086 6 8 6Z'
        stroke='currentColor'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
