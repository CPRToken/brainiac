import { useRef } from 'react';

const ReponseText = () => {
  const textRef = useRef<HTMLDivElement>(null);

  const handleCopyText = () => {
    const text = textRef.current?.innerText || '';
    navigator.clipboard.writeText(text);
  };

  return { textRef, handleCopyText };
};

export default ReponseText
