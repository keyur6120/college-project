import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for the moving scooter animation
const moveScooter = keyframes`
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(100%);
  }
`;

// Styled container for the scooter
const ScooterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #e0e0e0; /* Light gray background */
`;

// Styled scooter that moves across the screen
const Scooter = styled.div`
  width: 100px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation: ${moveScooter} 5s linear infinite;
`;

// Delivery animation component
const DeliveryAnimation = () => {
  return (
    <ScooterContainer>
      <Scooter>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="100"
          height="100"
        >
          <g>
            <path
              fill="#E44D26"
              d="M58.55,27.39L55,21.84V16h-4.01v2H29v-2h-3v2H11v-2H7v6H5.01v9h2.07c-1.35,0.87-2.46,2.04-3.16,3.44L1,44h8c0-5.52,4.48-10,10-10c5.16,0,9.39,3.91,9.95,8.92c0.06,0.52,0.07,1.06,0.03,1.58c-0.06,0.8-0.23,1.59-0.51,2.34C29.84,47.49,30.94,47,32.14,47c0.57,0,1.12,0.07,1.65,0.2c0.03-0.4,0.07-0.8,0.07-1.2c0-0.9-0.08-1.77-0.21-2.63L32,41h6c0.09,0.34,0.19,0.68,0.3,1h9.47l0.33-1H58v-2.03L62,36v-2L58.55,27.39z"
            />
            <circle cx="18" cy="44" r="5" fill="#000" />
            <circle cx="42" cy="44" r="5" fill="#000" />
          </g>
        </svg>
      </Scooter>
    </ScooterContainer>
  );
};

export default DeliveryAnimation;
