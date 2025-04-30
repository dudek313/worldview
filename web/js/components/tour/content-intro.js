/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { ArrowLineRightCircleFill } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui';

function TourIntro(props) {
  return (
    <div className="tour-intro">
      <p className="intro">
        Visually explore the past and the present of this dynamic planet from a satellite&apos;s perspective.
        Select from an array of stories below to learn more about DCCEEW Worldview Beta, the satellite imagery we provide and events occurring around the NSW.
        {' '}
        <a href="#" title="Start using DCCEEW Worldview Beta" onClick={props.toggleModalStart} className="start-link">
          Start using DCCEEW Worldview Beta
          <ArrowLineRightCircleFill class="intro-arrow" size="16px" />
        </a>
      </p>
    </div>
  );
}

TourIntro.propTypes = {
  toggleModalStart: PropTypes.func.isRequired,
};

export default TourIntro;
