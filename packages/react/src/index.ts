import React, { createElement, forwardRef } from 'react';
import {
  AtomsFnBase,
  extractAtomsFromProps,
  composeClassNames,
} from '@dessert-box/core';
import type { CreateBoxParams } from './types';

type HTMLProperties = Omit<
  React.AllHTMLAttributes<HTMLElement>,
  'as' | 'color' | 'height' | 'width'
>;

export function createBox<AtomsFn extends AtomsFnBase>({
  atoms: atomsFn,
  defaultClassName,
}: CreateBoxParams<AtomsFn>) {
  type BoxProps = {
    as?: React.ElementType;
    children?: React.ReactNode;
    className?: string;
  } & Parameters<AtomsFn>[0] &
    HTMLProperties;

  const Box = forwardRef<HTMLElement, BoxProps>(
    ({ as: element = 'div', className, ...props }: BoxProps, ref) => {
      const { atomProps, otherProps } = extractAtomsFromProps(props, atomsFn);

      return createElement(element, {
        ref,
        ...otherProps,
        className: composeClassNames(
          className,
          atomsFn(atomProps),
          defaultClassName,
        ),
      });
    },
  );

  Box.displayName = 'Box';

  return Box;
}

export function createBoxWithAtomsProp<AtomsFn extends AtomsFnBase>({
  atoms: atomsFn,
  defaultClassName,
}: CreateBoxParams<AtomsFn>) {
  type BoxProps = {
    as?: React.ElementType;
    children?: React.ReactNode;
    className?: string;
    atoms?: Parameters<AtomsFn>[0];
  } & HTMLProperties;

  const Box = forwardRef<HTMLElement, BoxProps>(
    ({ as: element = 'div', className, atoms, ...props }, ref) => {
      const hasAtomProps = typeof atoms !== 'undefined';

      return createElement(element, {
        ref,
        ...props,
        className: composeClassNames(
          className,
          atomsFn(atoms),
          defaultClassName,
        ),
      });
    },
  );

  Box.displayName = 'Box';

  return Box;
}
