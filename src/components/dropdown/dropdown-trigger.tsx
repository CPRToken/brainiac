// src/components/dropdown/dropdown-trigger.tsx
import PropTypes from 'prop-types';
import React from 'react';

type Props = { children: React.ReactNode };

export default function DropdownTrigger({ children }: Props) {
  return <>{children}</>;
}

DropdownTrigger.propTypes = {
  children: PropTypes.node.isRequired, // ← was element
};
