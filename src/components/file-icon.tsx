import type { FC } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'; // Import Image from Next.js

type Extension = 'jpeg' | 'jpg' | 'mp4' | 'pdf' | 'png' | 'doc' |'docx' | string;

const icons: Record<Extension, any> = {
  jpeg: '/assets/icons/icon-jpg.svg',
  jpg: '/assets/icons/icon-jpg.svg',
  mp4: '/assets/icons/icon-mp4.svg',
  pdf: '/assets/icons/icon-pdf.svg',
  png: '/assets/icons/icon-png.svg',
  svg: '/assets/icons/icon-svg.svg',
  doc: '/assets/icons/icon-doc.svg',
  docx: '/assets/icons/icon-docx.svg',
};

interface FileIconProps {
  extension?: Extension | null;
}

export const FileIcon: FC<FileIconProps> = (props) => {
  const { extension } = props;

  let icon: string;

  if (!extension) {
    icon = '/assets/icons/icon-other.svg';
  } else {
    icon = icons[extension] || '/assets/icons/icon-other.svg';
  }

  return <Image src={icon} alt={`${extension} icon`} width={24} height={24} />; // Use Image from Next.js
};

FileIcon.propTypes = {
  extension: PropTypes.string,
};
