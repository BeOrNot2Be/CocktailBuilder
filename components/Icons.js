import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Icon,
} from '@ui-kitten/components';


export const RemoveIcon = (style) => (
    <Icon {...style} name='close-circle-outline' />
  );

export const QuestionIcon = (style) => (
    <Icon {...style} name='question-mark-circle-outline' />
  );

export const AddedIcon = (style) => (
    <Icon {...style} name='plus-circle-outline' />
  );

export const SearchIcon = (style) => (
    <Icon {...style} name='search-outline' />
  );

export const HeartIcon = (style) => (
    <Icon
      {...style}
      width={30}
      height={30}
      name='heart'
     />
  );

export const HeartOutlineIcon = (style) => (
    <Icon 
      {...style} 
      name='heart-outline'
      width={30}
      height={30}
    />
  );

export const MenuIcon = (style) => (
    <Icon
      {...style}
      name='settings-2-outline'
     />
  );
  
export const BackIcon = (style) => (
      <Icon 
        {...style}
        name='arrow-back'
      />
    );

export const AddedSquareIcon = (style) => (
    <Icon 
      {...style}
      name='plus-square-outline'
    />
  );

export const AlertIcon = (style) => (
    <Icon 
      {...style}
      name='alert-circle-outline'
    />
  );

export  const ListIcon = (style) => (
    <Icon {...style} name='list-outline' />
  );
  // get 3rd party icon pack / or svg and get glass or cocktail stuff  
export  const CocktailIcon = (style) => (
    <Icon {...style} name='email-outline' />
  );

export  const CrossIcon = (style) => (
    <Icon {...style} name='close-outline' />
  );
  
