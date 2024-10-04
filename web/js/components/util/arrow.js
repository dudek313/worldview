import React from 'react';
import PropTypes from 'prop-types';
import { ArrowFilledUp } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui';

/*
 * @function Arrow Up/Down
 */
function Arrow({
  onClick, type, direction, isKioskModeActive,
}) {
  const containerClassName = `date-arrows date-arrow-${direction}`;
  const arrowClassName = `${direction}arrow`;

  return (
    <div
      onClick={onClick}
      className={isKioskModeActive ? 'd-none' : containerClassName}
      data-interval={type}
    >
      <ArrowFilledUp className={arrowClassName} size="18px" />
    </div>
  );
}

Arrow.propTypes = {
  direction: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  isKioskModeActive: PropTypes.bool,
};

export default Arrow;
