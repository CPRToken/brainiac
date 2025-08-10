// src/components/dropdown/dropdown-trigger.tsx
import PropTypes from 'prop-types';
import React from 'react';

type Props = { children: React.ReactNode };

export const DropdownTrigger = ({ children }: Props) => <>{children}</>;

DropdownTrigger.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DropdownTrigger; // optional; keeps both default + named
