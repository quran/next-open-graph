/* eslint-disable @next/next/no-img-element */
interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export default function Logo({ src, style, ...props }: LogoProps) {
  return (
    <img
      {...props}
      alt='Quran.com'
      src={src}
      style={{ objectFit: 'contain', ...style }}
    />
  );
}
