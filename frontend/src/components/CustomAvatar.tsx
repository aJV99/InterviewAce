import { Avatar, AvatarProps } from '@chakra-ui/react';
import React from 'react';

// The color mapping from the previous step
const colorMapping: { [key: string]: string } = {
  A: '#800000',
  B: '#008000',
  C: '#000080',
  D: '#808000',
  E: '#800080',
  F: '#008080',
  G: '#8B4513',
  H: '#006400',
  I: '#483D8B',
  J: '#2F4F4F',
  K: '#8B008B',
  L: '#556B2F',
  M: '#FF4500',
  N: '#2E8B57',
  O: '#4682B4',
  P: '#D2691E',
  Q: '#6B8E23',
  R: '#4169E1',
  S: '#8FBC8F',
  T: '#9932CC',
  U: '#E9967A',
  V: '#8A2BE2',
  W: '#DEB887',
  X: '#5F9EA0',
  Y: '#D2B48C',
  Z: '#BC8F8F',
};

function getGradientForName(fullName: string): string {
  const cleanName = fullName.toUpperCase().split(' ');
  const firstLetter = cleanName[0][0];
  const lastLetter = cleanName[1][0] !== cleanName[0][0] ? cleanName[1][0] : cleanName[1][1];
  const firstColor = colorMapping[firstLetter] || '#FFFFFF'; // Default to white if letter not found
  const lastColor = colorMapping[lastLetter] || '#FFFFFF'; // Default to white if letter not found

  return `linear-gradient(135deg, ${firstColor}, ${lastColor})`;
}

// Enhancing Avatar component to accept all AvatarProps
const CustomAvatar: React.FC<AvatarProps & { name: string }> = ({ name, ...props }) => {
  const background = getGradientForName(name);

  return <Avatar {...props} name={name} color="white" style={{ background, ...props.style }} />;
};

export default CustomAvatar;
