/* eslint-disable @next/next/no-img-element */
export interface BaseOpenGraphProps {
  bg: string;
  language: { code: string; direction?: string };
}

export default function BaseOpenGraph({
  bg,
  children,
  style,
}: BaseOpenGraphProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        fontFamily: 'sans-serif',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        ...style,
      }}
    >
      <img
        alt='BG'
        src={bg}
        style={{
          opacity: 0.6,
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: '-1',
        }}
      />
      {children}
    </div>
  );
}
